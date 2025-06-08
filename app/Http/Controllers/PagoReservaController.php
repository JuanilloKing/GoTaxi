<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reserva;
use Stripe\Stripe;
use Stripe\Refund;
use Stripe\PaymentIntent;
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
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => 'eur',
                        'product_data' => [
                            'name' => 'Reserva de viaje',
                            'description' => "Origen: {$reserva->origen} --> Destino: {$reserva->destino}",
                        ],
                        'unit_amount' => intval($reserva->precio * 100),
                    ],
                    'quantity' => 1,
                ]
            ],
            'mode' => 'payment',
            'success_url' => route('pago.success', ['reserva' => $reserva->id]) . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('pago.cancel', $reserva->id),
        ]);

        return redirect($session->url);
    }

    public function success(Request $request, Reserva $reserva)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $session_id = $request->get('session_id');
        $session = StripeSession::retrieve($session_id);

        $paymentIntentId = $session->payment_intent;

        $reserva->pagado = true;
        $reserva->stripe_payment_intent_id = $paymentIntentId;
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

    if ($reserva->estado_reservas_id !== 2) {
        abort(403, 'No autorizado para ver esta página.');
    }

    if (!$reserva->pagado) {
        return redirect()->route('cliente.mis-viajes')->with('error', 'Esta reserva no ha sido abonada.');
    }

    return Inertia::render('Cliente/Devolucion', [
        'reserva' => $reserva
    ]);
}

    public function procesarReembolso(Reserva $reserva)
    {
        if ($reserva->estado_reservas_id !== 2) {
            abort(403, 'No autorizado para realizar el reembolso.');
    }

        if (!$reserva->pagado || !$reserva->stripe_payment_intent_id) {
            return redirect()->back()->with('error', 'No se puede procesar el reembolso.');
        }

        Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            Refund::create([
                'payment_intent' => $reserva->stripe_payment_intent_id,
            ]);

            $reserva->pagado = false;
            $reserva->save();

            return redirect()->route('cliente.mis-viajes')->with('success', 'Reembolso procesado correctamente.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Error al procesar el reembolso: ' . $e->getMessage());
        }
    }

}
