<?php
namespace App\Http\Controllers;

use App\Models\Reserva;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ValoracionController extends Controller
{
    public function create(Reserva $reserva)
    {
        $user = Auth::user();

        // Validar que la reserva pertenece al cliente logueado
        if ($reserva->cliente_id !== $user->tipable_id) {
            abort(403, 'No tienes permiso para valorar esta reserva.');
        }

        // Asegurar que no se haya valorado ya
        if ($reserva->valoracion) {
            return redirect()->route('cliente.mis-viajes')->with('message', 'Ya has valorado esta reserva.');
        }

        // Cargar la relación del taxista y su usuario
        $reserva->load('taxista.users');

        return Inertia::render('Cliente/CrearValoracion', [
            'reserva' => [
                'id' => $reserva->id,
                'origen' => $reserva->origen,
                'destino' => $reserva->destino,
                'fecha' => $reserva->fecha_recogida,
                'taxista' => [
                    'id' => $reserva->taxista->id,
                    'nombre' => $reserva->taxista->users->nombre,
                ],
            ],
        ]);
    }
}
