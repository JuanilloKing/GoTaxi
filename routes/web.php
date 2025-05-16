<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReservarController;
use App\Http\Controllers\TaxistaController;
use App\Http\Controllers\VehiculoController;
use App\Http\Controllers\ClienteController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');


Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->get('/reservar', function () {
    return Inertia::render('Reservar/Create');
});

Route::get('/registrar-taxista', [TaxistaController::class, 'create'])->name('registrar-taxista.create');
Route::post('/registrar-taxista', [TaxistaController::class, 'store'])->name('registrar-taxista.store');
Route::get('/taxistas/{taxista}', [TaxistaController::class, 'show'])->name('taxistas.show');

Route::post('/reservar', [ReservarController::class, 'store'])->middleware('auth')->name('reservar.store');

Route::post('/reservas/{reserva}/finalizar', [ReservarController::class, 'finalizar'])->name('reservas.finalizar');

Route::get('/taxista/editar', [TaxistaController::class, 'edit'])->name('taxista.edit');

Route::put('/taxista/editar', [TaxistaController::class, 'update'])->name('taxista.update')->middleware('auth');

Route::post('/taxista/vehiculo/cambiar', [VehiculoController::class, 'cambiar'])->name('vehiculo.cambiar');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/Cliente/mis-viajes', [ClienteController::class, 'misViajes'])
        ->name('cliente.mis-viajes');
});

Route::get('/sobre-nosotros', function () {
    return Inertia::render('SobreNosotros');
})->name('sobre-nosotros');

Route::post('/taxista/cambiar-estado', [TaxistaController::class, 'cambiarEstado'])
    ->name('taxista.cambiar-estado');

// routes/web.php

require __DIR__.'/auth.php';
