<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reserva;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PagoReservaController extends Controller
{
    public function checkout(Reserva $reserva)
    {
        $user = Auth::user();

        if ($user->tipable_type !== 'App\\Models\\Cliente' || $user->tipable_id !== $reserva->cliente_id) {
            abort(403, 'No tienes acceso a esta reserva.');
        }

        if ($reserva->pagado) {
            return redirect()->route('cliente.mis-viajes')->with('error', 'Esta reserva ya fue pagada.');
        }

        Stripe::setApiKey(env('STRIPE_SECRET'));

        $session = StripeSession::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => 'Reserva de viaje',
                    ],
                    'unit_amount' => intval($reserva->precio * 100),
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => route('pago.success', $reserva->id),
            'cancel_url' => route('pago.cancel', $reserva->id),
        ]);

        return redirect($session->url);
    }

    public function success(Reserva $reserva)
    {
        $reserva->pagado = true;
        $reserva->save();

        return redirect()->route('cliente.mis-viajes')->with('success', 'Servicio abonado correctamente.');
    }

    public function cancel(Reserva $reserva)
    {
        return redirect()->route('cliente.mis-viajes')->with('error', 'El pago fue cancelado.');
    }

    public function mostrarReembolso(Reserva $reserva)
    {
        if (!$reserva->pagado) {
            return redirect()->route('cliente.mis-viajes')->with('error', 'Esta reserva no ha sido abonada.');
        }

        return Inertia::render('Cliente/Devolucion', [
            'reserva' => $reserva
        ]);
    }

}
