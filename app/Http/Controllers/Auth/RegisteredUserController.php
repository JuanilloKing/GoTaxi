<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        DB::beginTransaction();
        try {

            // Validación de los datos
            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'apellidos' => 'required|string|max:255',
                'dni' => 'required|string|unique:users,dni',
                'telefono' => 'required|string|unique:users,telefono',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|confirmed|min:8',
            ]);
                                                                                                                                   
            $user = new User();
            $user->nombre = $validated['nombre'];
            $user->apellidos = $validated['apellidos'];
            $user->dni = $validated['dni'];
            $user->telefono = $validated['telefono'];
            $user->email = $validated['email'];
            $user->password = Hash::make($validated['password']);
            // Asignar el ID del usuario al campo tipable_id
            if ($request->tipable_type === 'Cliente') {
                // Crear el cliente
                $cliente = new Cliente();
                $cliente->save();
                $user->tipable()->associate($cliente);  // Asociar el usuario con el cliente o taxista
            } else {
                //crear taxista
            }
            $user->save();  // Guardar la relación
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al registrar el usuario: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Error al registrar el usuario.']);
        }
        DB::commit();

        event(new Registered($user));
        Auth::login($user);


        return redirect()->to('/');
    }
   
}
