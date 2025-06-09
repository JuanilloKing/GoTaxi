<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reserva;
use App\Models\Taxista;
use App\Models\User;
use GuzzleHttp\Client;
use App\Mail\ReservaCreada;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Jobs\VerificarConfirmacionReserva;
use App\Mail\ReservaConfirmadaCliente;

class ReservaController extends Controller
{
    public function store(Request $request)
    {
        $tipable = Auth::user()->tipable;
        if (!$tipable instanceof \App\Models\Cliente) {
            return redirect()->back()->with('error', 'Registrate como cliente para poder hacer reservas. [' . now()->timestamp . ']');
        }
        $cliente = $tipable;
        $tieneReservaActiva = Reserva::where('cliente_id', $cliente->id)
            ->whereIn('estado_reservas_id', [2, 4])
            ->exists();

        if ($tieneReservaActiva) {
            return redirect()->back()->with('error', 'Ya tienes una reserva activa. Debes cancelarla antes de poder hacer otra. [' . now()->timestamp . ']');
        }

        $request->merge([
            'distancia' => (float) $request->input('distancia'),
            'duracion' => (int) $request->input('duracion'),
            'precio' => (float) $request->input('precio'),
            'minusvalido' => filter_var($request->input('minusvalido'), FILTER_VALIDATE_BOOLEAN),
            'pasajeros' => (int) $request->input('pasajeros'),
        ]);

        $request->validate([
            'origen' => 'required|string|max:255',
            'destino' => 'required|string|max:255',
            'distancia' => 'required|numeric|min:0',
            'duracion' => 'required|numeric|min:0',
            'precio' => 'required|numeric|min:0',
            'anotaciones' => 'nullable|string|max:255',
            'minusvalido' => 'required|boolean',
            'pasajeros' => 'required|integer|min:1|max:8',
        ]);
        
        // Obtener las coordenadas de origen y destino
        $latOrigen = $request->lat_origen;
        $lonOrigen = $request->lon_origen;
        
        // Llamar a la API de Geoapify
        $client = new Client();
        $geoapifyApiKey = '3b3471c7f4ec44afa8588b257cc362d8';
        $url = "https://api.geoapify.com/v1/geocode/reverse?lat=$latOrigen&lon=$lonOrigen&apiKey=$geoapifyApiKey";
        $response = $client->get($url);
        $data = json_decode($response->getBody()->getContents(), true);
        $ciudadOrigen = $data['features'][0]['properties']['city'] ?? 'Desconocido';
        $fecha_reserva = now();
        $fecha_recogida = empty($request->fecha_recogida) ? now() : $request->fecha_recogida;

        if ($request->duracion >= 1080) {
            return redirect()->back()->with('error', 'La duración del viaje no puede ser mayor a 18 horas. [' . now()->timestamp . ']');
        }   

        $taxistasEnCiudad = Taxista::whereHas('municipio', function ($query) use ($ciudadOrigen) {
            $query->where('municipio', $ciudadOrigen);
        })->get();

        if ($taxistasEnCiudad->isEmpty()) {
            return redirect()->back()->with('error', 'La ciudad seleccionada aún no está operativa con nosotros. [' . now()->timestamp . ']');
        }

        // 2. Filtrar por vehículos disponibles con capacidad suficiente
        $taxistasDisponibles = $taxistasEnCiudad->filter(function ($taxista) use ($request) {
            return $taxista->vehiculo &&
                $taxista->vehiculo->capacidad >= $request->pasajeros;
        });

        if ($taxistasDisponibles->isEmpty()) {
            return redirect()->back()->with('error', 'No hay taxis disponibles para esa capacidad en este momento. [' . now()->timestamp . ']');
        }

        $taxistasDisponibles = $taxistasDisponibles->filter(function ($taxista) {
            return $taxista->estado_taxistas_id === 1;
        });

        if ($taxistasDisponibles->isEmpty()) {
            return redirect()->back()->with('error', 'Todos los taxistas de esta ciudad están ocupados en estos momentos. [' . now()->timestamp . ']');
        }
        
        // 3. Filtrar por accesibilidad si es necesario
        if ($request->minusvalido) {
            $taxistasDisponibles = $taxistasDisponibles->filter(fn($t) => $t->minusvalido);

            if ($taxistasDisponibles->isEmpty()) {
                return redirect()->back()->with('error', 'No hay taxistas disponibles para personas con movilidad reducida en estos momentos. [' . now()->timestamp . ']');
            }
        }

        // 4. Verificar precio mínimo
        if ($request->precio <= 2) {
            return redirect()->back()->with('error', 'El precio mínimo para un viaje es de 2 euros. [' . now()->timestamp . '] ');
        }

        // 5. Seleccionar el mejor taxista según prioridad
        $taxista = $taxistasDisponibles->sort(function ($a, $b) {
            $aFecha = $a->ultimo_viaje ?? '1970-01-01 00:00:00';
            $bFecha = $b->ultimo_viaje ?? '1970-01-01 00:00:00';

            // Orden ascendente por último viaje (el más viejo primero)
            if ($aFecha === $bFecha) {
                // Desempatar por created_at (el más antiguo primero)
                return $a->created_at <=> $b->created_at;
            }

            return $aFecha <=> $bFecha;
        })->first();

            if ($taxista == null) {
                return redirect()->back()->with('error', 'No hay taxista disponibles. Intentelo más tarde. [' . now()->timestamp . '] ');
            }

            $pendiente = 1;
        try {
            DB::beginTransaction();

            $reserva = Reserva::create([
                'cliente_id' => $tipable->id,
                'taxista_id' => $taxista->id,
                'fecha_reserva' => date('Y-m-d H:i:s', strtotime($fecha_recogida)),
                'fecha_recogida' => $fecha_recogida,
                'origen' => $request->origen,
                'destino' => $request->destino,
                'distancia' => $request->distancia,
                'duracion' => $request->duracion,
                'precio' => $request->precio,
                'anotaciones' => $request->anotaciones,
                'estado_reservas_id' => $pendiente,
                'fecha_estado' => $fecha_reserva,
                'minusvalido' => $request->minusvalido,
                'num_pasajeros' => $request->pasajeros,
                'ciudad_origen' => $ciudadOrigen,
            ]);
            DB::commit();
            $taxista->estado_taxistas_id = 2;
            $taxista->vehiculo->disponible = false;
            $taxista->vehiculo->save();
            $taxista->save();
        } catch (\Exception $e) {
            DB::rollBack();
            dd('Error al guardar reserva:', $e->getMessage());
        }

        VerificarConfirmacionReserva::dispatch($reserva->id)->delay(now()->addMinutes(1));
        Mail::to($taxista->users->email)->send(new ReservaCreada($reserva));
        return redirect()->route('home')->with('success', 'Reserva creada correctamente');
    }

    public function finalizar(Reserva $reserva)
    {
        if ($reserva->estado_reservas_id !== 4) {
            return redirect()->back()->with('error', 'No se puede finalizar reservas que no están en curso. [' . now()->timestamp . ']');
        }

        $reserva->update(['fecha_entrega' => now()]);

        $reserva->update(['estado_reservas_id' => 5]);

        $taxista = $reserva->taxista;

        $taxista->estado_taxistas_id = 1;
        $taxista->ultimo_viaje = now();
        $taxista->vehiculo->disponible = true;
        $taxista->vehiculo->save();
        $taxista->save();
        $reserva->save();

        return redirect()->back()->with('success', 'Servicio finalizado correctamente. [' . now()->timestamp . ']');
    }

    public function cancelado(Reserva $reserva)
    {
        if (!in_array($reserva->estado_reservas_id, [1, 2])) {
            return redirect()->back()->with('error', 'No se puede cancelar reservas en curso. [' . now()->timestamp . ']');
        }

        $reserva->update(['estado_reservas_id' => 3]);

        $taxista = $reserva->taxista;

        $taxista->estado_taxistas_id = 1;
        $taxista->vehiculo->disponible = true;
        $taxista->vehiculo->save();
        $taxista->save();
        $reserva->save();

        return redirect()->back()->with('success', 'Reserva cancelada correctamente. [' . now()->timestamp . ']');
    }

    public function comenzar(Reserva $reserva)
    {
        if ($reserva->estado_reservas_id !== 2) {
            return redirect()->back()->with('error', 'No se puede comenzar reservas que no están confirmadas. [' . now()->timestamp . ']');
        }
        else {
            $reserva->estado_reservas_id = 4;
            $reserva->fecha_recogida = now();
            $reserva->save();

            return back()->with('success', 'Reserva comenzada correctamente. [' . now()->timestamp . ']');
        }
    }

    public function confirmar(Request $request, Reserva $reserva)
    {
        if ($reserva->estado_reservas_id !== 1) {
            return redirect()->back()->with('error', 'No se puede confirmar reservas que no están pendientes. [' . now()->timestamp . ']');
        }
        else {
            $reserva->update(['estado_reservas_id' => 2,
                            'fecha_recogida' => now()]);
    
            
            $taxista = $reserva->taxista;

            // Actualizar ubicación si está disponible
            if ($request->filled(['lat', 'lng'])) {
                $taxista->lat = $request->lat;
                $taxista->lng = $request->lng;
                $taxista->ultima_actualizacion_localizacion = now();
            }

            $taxista->estado_taxistas_id = 2;
            $taxista->vehiculo->disponible = true;
            $taxista->vehiculo->save();
            $taxista->save();
            // enviar correo al cliente
            Mail::to($reserva->cliente->user->email)->send(new ReservaConfirmadaCliente($reserva));
            return back()->with('success', 'Reserva confirmada correctamente.');
        }
    }

    
    public function cancelar(Reserva $reserva)
    {
        if ($reserva->estado_reservas_id == 4 && $reserva->estado_reservas_id == 5) {
            return redirect()->back()->with('error', 'No se puede cancelar reservas en curso o ya finalizadas. [' . now()->timestamp . ']');
        }
        else {
            VerificarConfirmacionReserva::dispatch($reserva->id)->delay(now());
            return redirect()->back()->with('success', 'Reserva cancelada correctamente. [' . now()->timestamp . ']');
        }
    }

    public function tieneReservaActiva()
    {
        $user = Auth::user();

        if ($user->tipable_type !== \App\Models\Taxista::class) {
            return response()->json(['hasReservaActiva' => false]);
        }

        $taxista = $user->tipable;

        $tiene = $taxista->reservas()
            ->whereIn('estado_reservas_id', [1, 2, 4])
            ->exists();

        return response()->json(['hasReservaActiva' => $tiene]);
    }

    public function reservaActiva(Request $request)
{
    $user = $request->user();

    $taxista = $user->tipable;

    $reservaActiva = $taxista->reservas()
        ->whereIn('estado_reservas_id', [1, 2, 4])
        ->with(['cliente.user'])
        ->latest()
        ->first();

    return response()->json([
        'reservaActiva' => $reservaActiva,
    ]);
}

public function reservaActivaCliente(Request $request)
{
    $user = $request->user();

    $cliente = $user->tipable;

    $reservaActiva = $cliente->reservas()
        ->whereIn('estado_reservas_id', [2, 4])
        ->with(['taxista.user', 'taxista.vehiculo', 'estado_reservas'])
        ->latest()
        ->first();

    return response()->json([
        'reservaActiva' => $reservaActiva,
    ]);
}


}
