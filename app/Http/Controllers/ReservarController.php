<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reserva;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ReservarController extends Controller
{
    public function store(Request $request)
    {
         $user = User::findOrFail(Auth::user()->id);

        $request->validate([
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
            'cliente_id'     => $user->id,
            'taxista_id'     => $que, // Asignar taxista_id, el disponible que lleve mas tiempo inactivo.
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
