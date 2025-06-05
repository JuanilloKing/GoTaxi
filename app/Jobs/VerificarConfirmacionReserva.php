<?php

namespace App\Jobs;

use App\Models\Reserva;
use App\Models\Taxista;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

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

        if (!$reserva || $reserva->estado_reservas_id !== 1) {
            // Ya fue aceptada o cancelada
            return;
        }

        $ciudadOrigen = $reserva->ciudad_origen; // Asegúrate de tener este campo
        $pasajeros = $reserva->num_pasajeros;
        $requiereAccesibilidad = $reserva->minusvalido;

        $taxistasEnCiudad = Taxista::whereHas('municipio', function ($query) use ($ciudadOrigen) {
            $query->where('municipio', $ciudadOrigen);
        })->get();

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
            $reserva->update([
                'estado_reservas_id' => 3, // Rechazada o no asignada
                'taxista_id' => null,
            ]);

            Log::info("Reserva #{$reserva->id} no pudo ser asignada. No hay taxistas disponibles.");
            return;
        }

        $taxista = $taxistasDisponibles->sort(function ($a, $b) {
            $aFecha = $a->ultimo_viaje ?? '1970-01-01 00:00:00';
            $bFecha = $b->ultimo_viaje ?? '1970-01-01 00:00:00';

            return $aFecha <=> $bFecha ?: $a->created_at <=> $b->created_at;
        })->first();

        // Reasignar reserva
        $reserva->update([
            'taxista_id' => $taxista->id,
            'estado_reservas_id' => 1, // Sigue pendiente
        ]);

        Log::info("Reserva #{$reserva->id} reasignada a taxista #{$taxista->id}.");

        // Re-disparar job en 5 minutos por si este tampoco acepta
        self::dispatch($reserva->id)->delay(now()->addMinutes(5));
    }
}
