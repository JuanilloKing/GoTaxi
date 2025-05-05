<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reserva;
use App\Models\Taxista;
use App\Models\User;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ReservarController extends Controller
{
    public function store(Request $request)
    {
        $user = User::findOrFail(Auth::user()->id);
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
        
        // Lógica de geolocalización para el origen
        $client = new Client();
        $geoapifyApiKey = '3b3471c7f4ec44afa8588b257cc362d8';
        $url = "https://api.geoapify.com/v1/geocode/reverse?lat=$latOrigen&lon=$lonOrigen&apiKey=$geoapifyApiKey";
        $response = $client->get($url);
        $data = json_decode($response->getBody()->getContents(), true);
        $ciudadOrigen = $data['features'][0]['properties']['city'] ?? 'Desconocido';
        
        $fecha_reserva = now();
        $fecha_recogida = empty($request->fecha_recogida) ? now() : $request->fecha_recogida;
        
    // Buscar taxistas en la ciudad
    $taxistasEnCiudad = Taxista::where('ciudad', $ciudadOrigen)->get();

    if ($taxistasEnCiudad->isEmpty()) {
        return redirect()->back()->with('error', 'No tenemos taxistas para esa ciudad.');
    }

    // Filtrar por estado disponible
    $taxistasDisponibles = $taxistasEnCiudad->where('estado_taxistas_id', 1);

    if ($taxistasDisponibles->isEmpty()) {
        return redirect()->back()->with('error', 'Todos los taxistas de esta zona están ocupados, inténtelo más tarde.');
    }

    // Si el usuario requiere vehículo adaptado, filtramos solo los que lo tienen.
    if ($request->minusvalido) {
        $taxistasDisponibles = $taxistasDisponibles->filter(function ($taxista) {
            return $taxista->vehiculo && $taxista->vehiculo->minusvalido === true;
        });

        if ($taxistasDisponibles->isEmpty()) {
            return redirect()->back()->with('error', 'No hay vehículos adaptados para personas con movilidad reducida disponibles en esta zona.');
        }
    }

    // Ahora filtramos por capacidad suficiente.
    $taxistasConVehiculoAdecuado = $taxistasDisponibles->filter(function ($taxista) use ($request) {
        $vehiculo = $taxista->vehiculo;
        return $vehiculo && $vehiculo->disponible && $vehiculo->capacidad >= $request->pasajeros;
    });

    if ($taxistasConVehiculoAdecuado->isEmpty()) {
        return redirect()->back()->with('error', 'Los taxistas disponibles no tienen la capacidad indicada. Ingrese un número inferior de pasajeros o inténtelo más tarde.');
    }

    // Elegimos el que lleve mas tiempo sin hacer una reserva
    $taxista = $taxistasConVehiculoAdecuado->sortBy(function ($t) {
        return $t->ultimo_viaje ?? '1970-01-01 00:00:00';
    })->first();


        $confirmada = 2;
        try {
            DB::beginTransaction();
        
            $reserva = Reserva::create([
                'cliente_id' => $user->id,
                'taxista_id' => $taxista->id,
                'fecha_reserva' => date('Y-m-d H:i:s', strtotime($fecha_recogida)),
                'fecha_recogida' => $fecha_recogida,
                'origen' => $request->origen,
                'destino' => $request->destino,
                'distancia' => $request->distancia,
                'duracion' => $request->duracion,
                'precio' => $request->precio,
                'anotaciones' => $request->anotaciones,
                'estado_reservas_id' => $confirmada,
                'fecha_estado' => $fecha_reserva,
                'minusvalido' => $request->minusvalido,
                'num_pasajeros' => $request->pasajeros,
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

        return redirect()->route('home')->with('success', 'Reserva creada correctamente');
    }

    public function finalizar(Reserva $reserva)
    {
        $reserva->update(['fecha_entrega' => now()]);

        $reserva->update(['estado_reservas_id' => 5]);

        $taxista = $reserva->taxista;

        $taxista->estado_taxistas_id = 1;
        $taxista->ultimo_viaje = now();
        $taxista->vehiculo->disponible = true;
        $taxista->vehiculo->save();
        $taxista->save();
        $reserva->save();

        return redirect()->back()->with('success', 'Servicio finalizado correctamente.');
    }

    public function cancelar(Reserva $reserva)
    {
        $reserva->update(['estado_reservas_id' => 3]);

        $taxista = $reserva->taxista;

        $taxista->estado_taxistas_id = 1;
        $taxista->vehiculo->disponible = true;
        $taxista->vehiculo->save();
        $taxista->save();
        $reserva->save();

        return redirect()->back()->with('success', 'Reserva cancelada correctamente.');
    }
}
