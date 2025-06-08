<?php

namespace App\Jobs;

use App\Mail\ReservaCancelada;
use App\Mail\ReservaCreada;
use App\Models\Reserva;
use App\Models\Taxista;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class VerificarConfirmacionReserva implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $reservaId;

    public function __construct($reservaId)
    {
        $this->reservaId = $reservaId;
    }

    public function handle()
    {

        $reserva = Reserva::find($this->reservaId);
        if (!$reserva) {
            Log::warning("❌ Reserva ID {$this->reservaId} no encontrada.");
            return;
        }

        if ($reserva->estado_reservas_id !== 1) {
            return;
        }

        $taxistaAnteriorId = $reserva->taxista_id;
        $taxistaAnterior = Taxista::find($taxistaAnteriorId);

        // Marcar al taxista anterior como NO DISPONIBLE (2)
        if ($taxistaAnterior) {
            $taxistaAnterior->estado_taxistas_id = 3;
            if ($taxistaAnterior->vehiculo) {
                $taxistaAnterior->vehiculo->disponible = true;
                $taxistaAnterior->vehiculo->save();
            }
            $taxistaAnterior->save();

        }

        $ciudadOrigen = $reserva->ciudad_origen;
        $pasajeros = $reserva->num_pasajeros;
        $requiereAccesibilidad = $reserva->minusvalido;

        $taxistasEnCiudad = Taxista::whereHas('municipio', function ($query) use ($ciudadOrigen) {
            $query->where('municipio', $ciudadOrigen);
        })->get();

        if ($taxistasEnCiudad->isEmpty()) {
            Log::warning("⚠️ No hay taxistas en la ciudad: {$ciudadOrigen}.");
            return $this->cancelarReserva($reserva);
        }

        $taxistasDisponibles = $taxistasEnCiudad->filter(function ($taxista) use ($pasajeros) {
            return $taxista->vehiculo &&
                $taxista->vehiculo->disponible &&
                $taxista->vehiculo->capacidad >= $pasajeros &&
                $taxista->estado_taxistas_id === 1;
        });

        if ($requiereAccesibilidad) {
            $taxistasDisponibles = $taxistasDisponibles->filter(fn($t) => $t->minusvalido);
        }

        if ($taxistasDisponibles->isEmpty()) {
            Log::warning("🚫 No hay taxistas disponibles que cumplan los requisitos para la reserva #{$reserva->id}.");
            return $this->cancelarReserva($reserva);
        }

        $taxista = $taxistasDisponibles->sort(function ($a, $b) {
            $aFecha = $a->ultimo_viaje ?? '1970-01-01 00:00:00';
            $bFecha = $b->ultimo_viaje ?? '1970-01-01 00:00:00';
            return $aFecha <=> $bFecha ?: $a->created_at <=> $b->created_at;
        })->first();

        // Asignar nuevo taxista a la reserva
        $reserva->update([
            'taxista_id' => $taxista->id,
        ]);

        $taxista->estado_taxistas_id = 2; 
        $taxista->vehiculo->disponible = false;
        $taxista->vehiculo->save();
        $taxista->save();


        // Lanzar el job para ejecutar en 1 minuto
        self::dispatch($reserva->id)->delay(now()->addMinutes(1));

        // Enviar email al nuevo taxista
        Mail::to($taxista->users->email)->send(new ReservaCreada($reserva));
    }

    protected function cancelarReserva($reserva)
    {
        $clienteEmail = $reserva->cliente->user->email ?? null;

        if ($clienteEmail) {
            Mail::to($clienteEmail)->send(new ReservaCancelada($reserva));
        }
        $reserva->delete();
    }
}
