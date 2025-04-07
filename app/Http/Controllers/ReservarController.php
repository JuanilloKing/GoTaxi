<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reserva;

class ReservarController extends Controller
{
    public function store(Request $request)
    {
        dd($request->all());
        
        $request->validate([
            'cliente_id'       => 'required|exists:clientes,id',
            'taxista_id'       => 'required|exists:taxistas,id',
            'fecha_reserva'    => 'required|date',
            'fecha_recogida'   => 'required|date|after_or_equal:fecha_reserva',
            'fecha_entrega'    => 'nullable|date|after_or_equal:fecha_recogida',
            'origen'           => 'required|string|max:255',
            'destino'          => 'required|string|max:255',
            'num_pasajeros'    => 'required|integer|min:1|max:8',
            'distancia'        => 'required|numeric|min:0',
            'precio'           => 'required|numeric|min:0',
            'estado'           => 'required|in:pendiente,aceptada,finalizada,cancelada',
            'minusvalido'      => 'required|boolean',
        ]);

        $reserva = Reserva::create([
            'cliente_id'     => $request->cliente_id,
            'taxista_id'     => $request->taxista_id,
            'fecha_reserva'  => $request->fecha_reserva,
            'fecha_recogida' => $request->fecha_recogida,
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
}
