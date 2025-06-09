<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ConsultaTarifaController extends Controller
{
public function index(Request $request)
{
    $search = $request->input('search', '');
    $sort = $request->input('sort', 'asc');

    $query = DB::table('provincias')
        ->leftJoin('tarifas', 'provincias.id', '=', 'tarifas.provincia_id')
        ->select(
            'provincias.id',
            'provincias.provincia as nombre',
            DB::raw('COALESCE(tarifas.precio_km, 1.26) as precio_km'),
            DB::raw('COALESCE(tarifas.precio_hora, 0.2) as precio_hora')
        );

    if (!empty($search)) {
        $query->where('provincias.provincia', 'ILIKE', $search . '%');
    }

    $query->orderByRaw("TRANSLATE(provincias.provincia, 'Á', 'A') $sort");

    $provincias = $query->paginate(10)->withQueryString();

    return Inertia::render('Admin/Tarifa/Index', [
        'provincias' => $provincias,
        'filters' => [
            'search' => $search,
            'sort' => $sort,
        ],
        'editable' => false,
    ]);
}

}
