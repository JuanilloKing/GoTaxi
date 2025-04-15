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
             'distancia' => (float) $request->input('distancia'),  // Convertir a número
             'duracion' => (int) $request->input('duracion'),      // Convertir a entero
             'precio' => (float) $request->input('precio'),        // Convertir a número
            'minusvalido' => filter_var($request->input('minusvalido'), FILTER_VALIDATE_BOOLEAN), // Convertir a booleano
            'pasajeros' => (int) $request->input('pasajeros'),    // Convertir a número
        ]);
        $request->validate([
            //'fecha_reserva'    => 'required|date',
            //'fecha_recogida'   => 'required|date|after_or_equal:fecha_reserva',
            //'fecha_entrega'    => 'nullable|date|after_or_equal:fecha_recogida',
            'origen'           => 'required|string|max:255',
            'destino'          => 'required|string|max:255',
            'distancia'        => 'required|numeric|min:0',
            'duracion'         => 'required|numeric|min:0',
            'precio'           => 'required|numeric|min:0',
            'anotaciones'      => 'nullable|string|max:255',
            'minusvalido'      => 'required|boolean',
            'pasajeros'    => 'required|integer|min:1|max:8',
            //'precio'           => 'required|numeric|min:0',
            //'estado'           => 'required|in:pendiente,aceptada,finalizada,cancelada',
        ]);
        $latOrigen = $request->lat_origen;
        $lonOrigen = $request->lon_origen;
        
        $client = new Client();
        $geoapifyApiKey = '3b3471c7f4ec44afa8588b257cc362d8';
        
        $url = "https://api.geoapify.com/v1/geocode/reverse?lat=$latOrigen&lon=$lonOrigen&apiKey=$geoapifyApiKey";
        
        $response = $client->get($url);
        $data = json_decode($response->getBody()->getContents(), true);
        
        $ciudadOrigen = $data['features'][0]['properties']['city'] ?? 'Desconocido';
        $fecha_reserva = now();
        
        if (empty($request->fecha_recogida)) {
            $fecha_recogida = now();
        } else {
            $fecha_recogida = $request->fecha_recogida; 
        }
        
        $taxista = Taxista::where('ciudad', $ciudadOrigen)
        ->where('estado_taxistas_id', 1)
        ->orderByRaw('COALESCE(ultimo_viaje, \'1970-01-01 00:00:00\') DESC, ultimo_viaje ASC, created_at ASC')
        ->first();
        
        if ($taxista->num_plazas < $request->pasajeros) {
            return redirect()->back()->with('error', 'El número de pasajeros excede la capacidad del vehículo.');
            
        }
        
        if ($taxista == null) {
            return redirect()->back()->with('error', 'No hay taxista disponibles en la ciudad de origen.');
        }

        $pendiente = 1;
        DB::beginTransaction();

        $reserva = Reserva::create([
            'cliente_id'     => $user->id,  //lo pilla
            'taxista_id'     => $taxista->id,   //lo pilla
            'fecha_reserva'  => date('d/m/Y H:i:s', strtotime($fecha_recogida)), //lo pilla
            'fecha_recogida' => date('d/m/Y H:i:s', strtotime($fecha_reserva)), //lo pilla (reservar ahora, programar fecha aun no disponible)
            //  'fecha_entrega'  => $request->fecha_entrega,     hay que calcular cuando termine
            'origen'         => $request->origen,       //lo pilla
            'destino'        => $request->destino,      //lo pilla
            'estado_reservas_id' => $pendiente, //pendiente
            'num_pasajeros'  => $request->pasajeros,    //lo pilla
            'anotaciones'    => $request->anotaciones,  //lo pilla
            'distancia'      => $request->distancia,        //lo pilla
            'precio'         => $request->precio,           //lo pilla
            'minusvalido'    => $request->minusvalido,      //lo pilla
        ]);

        $reserva->save();
        $taxista->estado_taxistas_id = 3; //cambiar a ocupado
        $taxista->ultimo_viaje = now();     //cuando termine

        $taxista->save();
        DB::commit();

        

        return redirect()->to('/')->with('success', 'Reserva creada correctamente');
    }
}
