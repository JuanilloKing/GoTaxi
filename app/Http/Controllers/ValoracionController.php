<?php
namespace App\Http\Controllers;

use App\Models\Reserva;
use App\Models\Valoracion;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;

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

public function store(Request $request)
    {
        // Validación                               PROTECTED FILLABLE EN VALORACION.PHP
        $data = $request->validate([
            'reserva_id' => 'required|exists:reservas,id',
            'puntuacion' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string|max:500',
        ]);

        $user = Auth::user();
        $reserva = Reserva::findOrFail($data['reserva_id']);

        if ($reserva->cliente_id !== $user->tipable_id) {
            abort(403, 'No tienes permiso para valorar esta reserva.');
        }

        if ($reserva->valoracion) {
            return redirect()->route('cliente.mis-viajes')->with('message', 'Ya has valorado esta reserva.');
        }

        $reserva->valoracion()->create([
            'cliente_id' => $user->tipable_id,
            'taxista_id' => $reserva->taxista_id,
            'puntuacion' => $data['puntuacion'],
            'comentario' => $data['comentario'],
        ]);

        return redirect()->route('cliente.mis-viajes')->with('message', 'Valoración creada con éxito.');
    }

}
