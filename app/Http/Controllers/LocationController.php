<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Provincia;
use App\Models\Municipio;

class LocationController extends Controller
{
    public function getProvincias()
    {
        return response()->json(Provincia::all());
    }

    public function getMunicipios($provinciaId)
    {
        return response()->json(
            Municipio::where('provincia_id', $provinciaId)->get()
        );
    }
}
