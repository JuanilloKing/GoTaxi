<?php

namespace App\Http\Middleware;

use App\Models\Reserva;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => fn () => $request->user(),
                'hasReservaActiva' => function () use ($request) {
                    $user = $request->user();
    
                    if (!$user || $user->tipable_type !== 'App\\Models\\Taxista') {
                        return false;
                    }
    
                    return Reserva::where('taxista_id', $user->tipable_id)
                        ->whereNull('fecha_entrega')
                        ->exists();
                },
            ],
        ]);
    }
}
