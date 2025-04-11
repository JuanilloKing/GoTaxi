<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reserva;
use App\Models\Taxista;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ReservarController extends Controller
{
    public function store(Request $request)
    {
        dd($request->all());
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


        $fecha_reserva = now();

        if (empty($request->fecha_recogida)) {
            $fecha_recogida = now();
        } else {
            $fecha_recogida = $request->fecha_recogida; 
        }

        $origen = $request->origen;
        $ciudad_origen = $this->extractCity($origen);  // Extraer solo la ciudad del origen
        dd($ciudad_origen);
        // Buscar un taxista que esté en la misma ciudad
        $taxista = Taxista::where('ciudad', 'LIKE', '%' . $ciudad_origen . '%')->first();
    
        // Verificar si se encuentra un taxista en la ciudad del origen
        if (!$taxista) {
            return back()->with('error', 'No hay taxistas disponibles en la ciudad de origen.');
        }


        // Obtener el taxista que mas tiempo lleve sin recibir una reserva

        $reserva = Reserva::create([
            'cliente_id'     => $user->id,
            'taxista_id'     => $taxista->id, 
            'fecha_reserva'  => $fecha_reserva,
            'fecha_recogida' => $fecha_recogida,
            'fecha_entrega'  => $request->fecha_entrega,
            'origen'         => $request->origen,
            'destino'        => $request->destino,
            'num_pasajeros'  => $request->num_pasajeros,
            'distancia'      => $request->distancia,
            'precio'         => $request->precio,
            'estado'         => $request->estado,
            'minusvalido'    => $request->minusvalido,
        ]);

        return redirect()->route('reservas.index')->with('success', 'Reserva creada correctamente');
    }
private function extractCity($address)
{
    $address_parts = explode(',', $address);
    $city = trim($address_parts[count($address_parts) - 3]); 
    
    $city = preg_replace('/(Comunidad de|Andalucía|España|Comunidad Valenciana|Islas Canarias)/i', '', $city);
    
    return ucfirst(strtolower($city)); 
    }
}
