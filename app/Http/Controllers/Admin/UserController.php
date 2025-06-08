<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Reserva;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $roles = $request->input('roles', []);

        $users = User::when($search, fn($q) =>
                $q->where('dni', 'ILIKE', "{$search}%")
            )
            ->when(!empty($roles), function ($query) use ($roles) {
                $query->where(function ($q) use ($roles) {
                    if (in_array('taxista', $roles)) {
                        $q->orWhere('tipable_type', 'LIKE', '%Taxista');
                    }
                    if (in_array('cliente', $roles)) {
                        $q->orWhereNull('tipable_type')
                        ->orWhere('tipable_type', 'LIKE', '%Cliente');
                    }
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
