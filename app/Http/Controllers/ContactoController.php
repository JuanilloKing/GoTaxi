<?php

namespace App\Http\Controllers;
use App\Models\Contacto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ContactoController extends Controller
{

    public function index()
    {
        $contactos = Contacto::with('user')->latest()->paginate(10);

        return Inertia::render('Admin/Mensajes/Index', [
            'contactos' => $contactos,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'asunto' => 'required|string|max:255',
            'mensaje' => 'required|string',
        ]);
        
        if (strlen($request->mensaje) < 10) {
            return redirect()->back()->with('error', 'El mensaje debe tener al menos 10 caracteres. [' . now()->timestamp . ']');
        }

        Contacto::create([
            'user_id' => Auth::id(),
            'asunto' => $request->asunto,
            'mensaje' => $request->mensaje,
        ]);

        return redirect()->back()->with('success', 'Mensaje enviado correctamente. [' . now()->timestamp . ']');
    }
};
