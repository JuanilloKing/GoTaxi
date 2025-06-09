<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Reserva;
use Illuminate\Support\Facades\DB;
use App\Models\Taxista;
use App\Models\Cliente;

class UserController extends Controller
{

public function index(Request $request)
{
    $search = $request->input('search');
    $roles = $request->input('roles', []);
    $municipioId = $request->input('municipio_id');

    $users = User::query()
        ->when($search, fn($q) =>
            $q->where('dni', 'ILIKE', "{$search}%")
        )
        ->when(!empty($roles), function ($q) use ($roles) {
            $q->where(function ($q) use ($roles) {
                foreach ($roles as $role) {
                    if ($role === 'taxista') {
                        $q->orWhere('tipable_type', Taxista::class);
                    }
                    if ($role === 'cliente') {
                        $q->orWhere('tipable_type', Cliente::class);
                    }
                }
            });
        })
        ->when($municipioId, function ($q) use ($municipioId) {
            $q->whereHasMorph('tipable', [Taxista::class], function ($q) use ($municipioId) {
                $q->where('municipio_id', $municipioId);
            });
        })
        ->orderBy('created_at', 'desc')
        ->paginate(10)
        ->withQueryString();

    return Inertia::render('Admin/Usuarios/Index', [
        'users' => $users,
        'filters' => [
            'search' => $search,
            'roles' => $roles,
            'municipio_id' => $municipioId,
        ],
    ]);
}

    public function showTaxista(User $user, Request $request)
    {
        if (!$user->tipable || !$user->tipable instanceof \App\Models\Taxista) {
            abort(404, 'No es un taxista válido');
        }

        $taxista = $user->tipable()->with('estado_taxistas')->first();

        $reservas = $taxista
            ->reservas()
            ->whereHas('valoracion')
            ->with('valoracion')
            ->latest()
            ->paginate(5)
            ->through(function ($reserva) {
                return [
                    'comentario' => $reserva->valoracion->comentario ?? null,
                    'puntuacion' => $reserva->valoracion->puntuacion ?? null,
                    'fecha' => $reserva->created_at->format('d/m/Y H:i'),
                ];
            });

        $media = $taxista
            ->reservas()
            ->whereHas('valoracion')
            ->with('valoracion')
            ->get()
            ->pluck('valoracion.puntuacion')
            ->avg();

        return Inertia::render('Admin/Usuarios/MostrarTaxista', [
            'taxista' => $user,
            'estado' => $taxista->estado_taxistas?->id,
            'comentarios' => $reservas,
            'media' => round($media, 2),
            'reservas' => $taxista->reservas()->count(),
        ]);
    }


    public function togleAdmin(User $user)
    {
        if ($user->is_admin) {
            $user->is_admin = false;
            $user->save();
        }
        else {
            $user->is_admin = true;
            $user->save();
        }
        
        return back()->with('success', 'Rol actualizado.');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return back()->with('success', 'Usuario eliminado.');
    }

}
