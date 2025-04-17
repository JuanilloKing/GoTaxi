<?php

namespace App\Http\Controllers;

use App\Models\Taxista;
use App\Models\User;
use App\Models\Vehiculo;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class TaxistaController extends Controller
{

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('RegisterTaxista');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
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
                'password' => 'required|string|min:8|confirmed',
                'password_confirmation' => 'required|string|min:8|same:password', 
                'ciudad' => 'required|string|max:255',
                'licencia_taxi' => 'required|string|max:255',
                'matricula' => 'required|string|max:255',
                'marca' => 'required|string|max:255',
                'modelo' => 'required|string|max:255',
                'color' => 'required|string|max:255',
                'capacidad' => 'required|integer|max:255', 
                'minusvalido' => 'required|boolean',
            ]);
            $vehiculo = new Vehiculo();
            $vehiculo->licencia_taxi = $validated['licencia_taxi'];
            $vehiculo->matricula = $validated['matricula'];
            $vehiculo->marca = $validated['marca'];
            $vehiculo->modelo = $validated['modelo'];
            $vehiculo->color = $validated['color'];
            $vehiculo->minusvalido = $validated['minusvalido'];
            $vehiculo->capacidad = $validated['capacidad'];
            $vehiculo->save();
                                      
            $user = new User();
            $user->nombre = $validated['nombre'];
            $user->apellidos = $validated['apellidos'];
            $user->dni = $validated['dni'];
            $user->telefono = $validated['telefono'];
            $user->email = $validated['email'];
            $user->password = Hash::make($validated['password']);
                // Crear el Taxista
                $Taxista = new Taxista();
                $Taxista->ciudad = $validated['ciudad'];
                $Taxista->vehiculo_id = $vehiculo->id;
                $Taxista->estado_taxistas_id = 1; 
                $Taxista->save();
                $user->tipable()->associate($Taxista);  // Asociar el usuario con el Taxista o taxista
            $user->save();  // Guardar la relación
        } catch (\Exception $e) {
            DB::rollBack();
            dd($e);
            Log::error('Error al registrar el usuario: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Error al registrar el usuario.']);
        }
        DB::commit();

        event(new Registered($user));
        Auth::login($user);


        return redirect()->to('/');
    }

    /**
     * Display the specified resource.
     */
    public function show(Taxista $taxista)
    {
        return Inertia::render('Taxista/Show', [
            'taxista' => $taxista
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Taxista $taxista)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Taxista $taxista)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Taxista $taxista)
    {
        //
    }
}
