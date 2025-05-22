<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Reserva;

class ClienteController extends Controller
{
    public function misViajes()
    {
        $user = Auth::user();

        if ($user->tipable_type !== 'App\\Models\\Cliente') {
            abort(403, 'No tienes permiso para acceder a esta sección.');
        }

        // Cargar relaciones 'estado_reservas' y 'valoracion'
        $reservas = Reserva::with(['estado_reservas', 'valoracion', 'taxista'])
            ->where('cliente_id', $user->tipable_id)
            ->orderByDesc('fecha_recogida')
            ->paginate(5);

        return Inertia::render('Cliente/MisViajes', [
            'reservas' => $reservas,
        ]);
    }
}
