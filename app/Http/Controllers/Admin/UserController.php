<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $users = User::when($search, fn($q) =>
            $q->where('dni', 'ILIKE', "%{$search}%")
        )
        ->orderBy('created_at', 'desc')
        ->paginate(10)
        ->withQueryString();

        return Inertia::render('Admin/Usuarios/Index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
            ],
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
