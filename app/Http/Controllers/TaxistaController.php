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
        // Validación de los datos con mensajes personalizados
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'dni' => ['sometimes', 'string', 'unique:users,dni', 'regex:/^\d{8}[A-Z]$/'],
            'telefono' => 'required|string|unique:users,telefono',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string|min:8|same:password',
            'ciudad' => 'required|string|max:255',
            'licencia_taxi' => 'required|string|max:255|unique:vehiculos,licencia_taxi',
            'matricula' => 'required|string|max:255|unique:vehiculos,matricula',
            'marca' => 'required|string|max:255',
            'modelo' => 'required|string|max:255',
            'color' => 'required|string|max:255',
            'capacidad' => 'required|integer|max:255',
            'minusvalido' => 'required|boolean',
        ], [
            'dni.regex' => 'El DNI introducido no es correcto.',
            'dni.unique' => 'Este DNI ya está registrado.',
            'telefono.unique' => 'Este teléfono ya está registrado.',
            'email.unique' => 'Este correo electrónico ya está registrado.',
            'licencia_taxi.unique' => 'Licencia de taxi ya registrada.',
            'matricula.unique' => 'Vehículo ya registrado.',
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

        $Taxista = new Taxista();
        $Taxista->ciudad = $validated['ciudad'];
        $Taxista->vehiculo_id = $vehiculo->id;
        $Taxista->estado_taxistas_id = 1;
        $Taxista->save();

        $user->tipable()->associate($Taxista);
        $user->save();

        DB::commit();

        event(new Registered($user));
        Auth::login($user);

        return redirect()->to('/');
    } catch (\Illuminate\Validation\ValidationException $e) {
        DB::rollBack();
        return redirect()->back()->withErrors($e->validator)->withInput();
    } catch (\Illuminate\Database\QueryException $e) {
        DB::rollBack();

        $message = 'Error al registrar el usuario.';
        $errorMsg = $e->getMessage();

        // Detectar claves únicas violadas (depende del motor de BD)
        if (str_contains($errorMsg, 'vehiculos_licencia_taxi_unique')) {
            $message = 'Licencia de taxi ya registrada.';
        } elseif (str_contains($errorMsg, 'vehiculos_matricula_unique')) {
            $message = 'Vehículo ya registrado.';
        } elseif (str_contains($errorMsg, 'users_dni_unique')) {
            $message = 'Este DNI ya está registrado.';
        } elseif (str_contains($errorMsg, 'users_email_unique')) {
            $message = 'Este correo electrónico ya está registrado.';
        } elseif (str_contains($errorMsg, 'users_telefono_unique')) {
            $message = 'Este teléfono ya está registrado.';
        }

        Log::error('Error en el registro (Query): ' . $e->getMessage());
        return redirect()->back()->withErrors(['error' => $message])->withInput();
    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Error inesperado en el registro: ' . $e->getMessage());
        return redirect()->back()->withErrors(['error' => 'Ocurrió un error inesperado.'])->withInput();
    }
}

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Taxista $taxista)
    {
        // Cargar solo la reserva activa (sin fecha_entrega)
        $reservaActiva = $taxista->reservas()
            ->with('cliente.user')
            ->whereNull('fecha_entrega')
            ->first();
    
        // Paginación de reservas finalizadas (con fecha_entrega)
        $reservasFinalizadas = $taxista->reservas()
            ->with('cliente.user')
            ->whereNotNull('fecha_entrega')
            ->orderByDesc('fecha_entrega')
            ->paginate(5) // Paginamos de 5 en 5
            ->withQueryString(); // Para mantener filtros si los hubiera
    
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


        public function cambiarEstado()
        {   
            $user = Auth::user();
            
            if (!$user || $user->tipable_type !== 'App\\Models\\Taxista') {
                abort(403, 'No autorizado.');
            }
            $taxista = $user->tipable;

            if ($taxista->estado_taxistas_id == 2) {
                return back()->with('error', 'No puedes cambiar el estado teniendo un servicio activo.');
            }
            if ($taxista->estado_taxistas_id == 1) {
                // Cambiar a ocupado
                $taxista->estado_taxistas_id = 3;

            } elseif ($taxista->estado_taxistas_id == 3) {
                // Cambiar disponible
                $taxista->estado_taxistas_id = 1;
            }
            $taxista->save();
            return back()->with('success', 'Estado de disponibilidad actualizado correctamente.');
        }

}
