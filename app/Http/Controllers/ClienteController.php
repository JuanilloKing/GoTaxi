<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Reserva;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ClienteController extends Controller
{
    public function misViajes()
    {
        $user = Auth::user();

        if ($user->tipable_type !== 'App\\Models\\Cliente') {
            abort(403, 'No tienes permiso para acceder a esta sección.');
        }
        
$reservas = Reserva::with([
    'estado_reservas',
    'valoracion',
    'taxista' => function ($query) {
        $query->select('id', 'lat', 'lng', 'ultima_actualizacion_ubicacion', 'vehiculo_id');
    },
    'taxista.users:id,nombre,tipable_id',
    'taxista.vehiculo:id,marca,modelo,matricula,color',
])
->where('cliente_id', $user->tipable_id)
->orderByDesc('fecha_recogida')
->paginate(5);


        return Inertia::render('Cliente/MisViajes', [
            'reservas' => $reservas,
        ]);
    }
}
