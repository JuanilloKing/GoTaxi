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

        // Obtener reservas asociadas a este cliente
        $reservas = Reserva::where('cliente_id', $user->tipable_id)->get();

        return Inertia::render('Cliente/MisViajes', [
            'reservas' => $reservas,
        ]);
    }
}
