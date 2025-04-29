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
                'dni' => ['sometimes', 'string', 'unique:users,dni', 'regex:/^\d{8}[A-Z]$/'],
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
        
        $reservas = $taxista->reservas()
            ->with('cliente.user') 
            ->get();
    
        $reservaActiva = $reservas->firstWhere('fecha_entrega', null);
    
        $reservasFinalizadas = $reservas
            ->filter(fn($r) => $r->fecha_entrega !== null)
            ->sortByDesc('fecha_entrega')
            ->values(); 
    
        return Inertia::render('Taxista/Show', [
            'taxista' => $taxista,
            'reservaActiva' => $reservaActiva,
            'reservasFinalizadas' => $reservasFinalizadas,
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Taxista $taxista)
    {
        // Obtén el taxista autenticado
        $taxista = Auth::user()->tipable;
        // Si el usuario no es un taxista, redirige o muestra un error
        if (!$taxista) {
            return redirect()->route('home')->with('error', 'No tienes acceso a esta página.');
        }   
        // Retorna la vista de edición con los datos del taxista
        return inertia('Taxista/Edit', ['taxista' => $taxista,
                                        'vehiculo' => $taxista->vehiculo]);
        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Taxista $taxista)
    {
        $user = Auth::user();
        $taxista = $user->tipable;
    
        if (!$taxista) {
            return redirect()->route('home')->with('error', 'No tienes acceso a esta página.');
        }
    
        // Validaciones
        $validated = $request->validate([
            'nombre' => 'sometimes|nullable|string|max:255',
            'apellidos' => 'sometimes|nullable|string|max:255',
            'email' => 'sometimes|nullable|email|max:255|unique:users,email,' . $user->id,
            'dni' => 'sometimes|nullable|string|max:20',
            'telefono' => 'sometimes|nullable|string|min:9|max:9',
            'password' => 'sometimes|nullable|string|min:8|confirmed',
            'ciudad' => 'sometimes|nullable|string|max:255',
        ]);

        // Actualizar campos del usuario
        if (isset($validated['nombre'])) $user->nombre = $validated['nombre'];
        if (isset($validated['apellidos'])) $user->apellidos = $validated['apellidos'];
        if (isset($validated['email'])) $user->email = $validated['email'];
        if (isset($validated['dni'])) $user->dni = $validated['dni'];
        if (isset($validated['telefono'])) $user->telefono = $validated['telefono'];
        if (!empty($validated['password'])) $user->password = Hash::make($validated['password']);
    
        $user->save();

        // Actualizar campos del modelo relacionado (taxista)
        if (isset($validated['ciudad'])) {
            $taxista->ciudad = $validated['ciudad'];
            $taxista->save();
        }

        return redirect()->route('taxista.edit')->with('success', 'Perfil actualizado correctamente.');
            }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Taxista $taxista)
    {
        //
    }
}
