<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\Tarifa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TarifaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $sort = $request->input('sort', 'asc');

        $provinciasConTarifas = DB::table('provincias')
            ->leftJoin('tarifas', 'provincias.id', '=', 'tarifas.provincia_id')
            ->select(
                'provincias.id',
                'provincias.provincia as nombre',
                DB::raw('COALESCE(tarifas.precio_km, 1.26) as precio_km'),
                DB::raw('COALESCE(tarifas.precio_hora, 0.2) as precio_hora')
            )
            ->when($search, function ($query, $search) {
                $query->where('provincias.provincia', 'LIKE', $search . '%');
            })
            ->orderBy('provincias.provincia', $sort)
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Tarifa/Index', [
            'provincias' => $provinciasConTarifas,
            'filters' => [
                'search' => $search,
                'sort' => $sort,
            ]
        ]);
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
    public function show(Tarifa $tarifa)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tarifa $tarifa)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'precio_km' => 'required|numeric|min:0',
            'precio_hora' => 'required|numeric|min:0',
        ]);

        $tarifa = Tarifa::firstOrNew(['provincia_id' => $id]);
        $tarifa->precio_km = $request->precio_km;
        $tarifa->precio_hora = $request->precio_hora;
        $tarifa->provincia_id = $id;
        $tarifa->save();

        return back()->with('success', 'Tarifa actualizada correctamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tarifa $tarifa)
    {
        //
    }
}
