<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaxistaUbicacionController extends Controller
{
public function update(Request $request)
{
    try {
        $user = Auth::user();

        if (!$user->tipable_type || $user->tipable_type !== \App\Models\Taxista::class) {
            return response()->json(['message' => 'No autorizado'], 403);
        }

        $request->validate([
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
        ]);

        $taxista = $user->tipable;

        $taxista->lat = $request->lat;
        $taxista->lng = $request->lng;
        $taxista->ultima_actualizacion_ubicacion = now();
        $taxista->save();

        return response()->json(['success' => true]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile(),
        ], 500);
    }
}

}
