<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VehiculoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Vehiculo $vehiculo)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vehiculo $vehiculo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Vehiculo $vehiculo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vehiculo $vehiculo)
    {
        //
    }

    public function cambiar(Request $request)
    {
        $request->validate([
            'licencia_taxi' => 'required|unique:vehiculos',
            'matricula' => 'required|unique:vehiculos',
            'marca' => 'required',
            'modelo' => 'required',
            'color' => 'required',
            'minusvalido' => 'required',
            'capacidad' => 'required',
        ]);
        $loggeado = Auth::user();
        $taxista = $loggeado->tipable;  
        $vehiculoAnterior = $taxista->vehiculo;
    
        // Si hay un vehículo anterior
        if ($vehiculoAnterior) {
    
            // Verificar si ningún otro taxista está usando ese vehículo
            $otrosTaxistas = \App\Models\Taxista::where('vehiculo_id', $vehiculoAnterior->id)
                ->where('id', '!=', $taxista->id)
                ->exists();
    
            // Si ningún otro lo está usando, hacer soft delete
            if (!$otrosTaxistas) {
                $vehiculoAnterior->delete();
            }
        }

        // Crear el nuevo vehículo
        $vehiculo = Vehiculo::create([
            'licencia_taxi' => $request->licencia_taxi,
            'matricula' => $request->matricula,
            'marca' => $request->marca,
            'modelo' => $request->modelo,
            'color' => $request->color,
            'capacidad' => $request->capacidad,
            'minusvalido' => $request->minusvalido,
            'disponible' => false,
        ]);
    
        // Asignar el nuevo vehículo al taxista
        $taxista->vehiculo_id = $vehiculo->id;
        $taxista->save();
    
        return back()->with('success', 'Vehículo actualizado correctamente.');
    }
}