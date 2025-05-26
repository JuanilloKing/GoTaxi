<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\TaxistaController;
use App\Http\Controllers\VehiculoController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ConsultaTarifaController;
use App\Http\Controllers\PagoReservaController;
use App\Http\Controllers\ContactoController;
use App\Http\Controllers\ValoracionController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\TarifaController;
use App\Http\Middleware\AdminMiddleware;

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

Route::post('/reservar', [ReservaController::class, 'store'])->middleware('auth')->name('reservar.store');


    // Rutas de estado reservas
Route::post('/reservas/{reserva}/finalizar', [ReservaController::class, 'finalizar'])->name('reservas.finalizar');

Route::post('/reservas/{reserva}/cancelado', [ReservaController::class, 'cancelado'])->name('reservas.cancelado');

Route::post('/reservas/{reserva}/comenzar', [ReservaController::class, 'comenzar'])->name('reservas.comenzar');


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

Route::get('/empresas', function () {
    return Inertia::render('Empresas');
})->name('empresas');

Route::get('/contactos', function () {
    return Inertia::render('Contactos');
})->name('contactos');

Route::post('/taxista/cambiar-estado', [TaxistaController::class, 'cambiarEstado'])
    ->name('taxista.cambiar-estado');

    // Rutas APIS 
Route::get('/api/provincias', [LocationController::class, 'getProvincias']);
Route::get('/api/municipios/{provinciaId}', [LocationController::class, 'getMunicipios']);

    // Rutas de admin
Route::get('/admin/tarifas', [TarifaController::class, 'index'])
    ->name('tarifas.index')
    ->middleware(AdminMiddleware::class);

Route::put('/admin/tarifas/{id}', [TarifaController::class, 'update'])
    ->middleware(AdminMiddleware::class)
    ->name('tarifas.update');

    
Route::get('/consultar-tarifa', [ConsultaTarifaController::class, 'index'])
    ->name('tarifas.consultar');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/valoraciones/crear/{reserva}', [ValoracionController::class, 'create'])->name('valoraciones.create');
    Route::post('/valoraciones', [ValoracionController::class, 'store'])->name('valoraciones.store');
});

Route::post('/contacto', [ContactoController::class, 'store'])->middleware('auth');


    // Ruta de pagos
Route::middleware(['auth'])->group(function () {
    Route::get('/reserva/{reserva}/pagar', [PagoReservaController::class, 'checkout'])->name('pago.reserva');
    Route::get('/reserva/{reserva}/pago-exitoso', [PagoReservaController::class, 'success'])->name('pago.success');
    Route::get('/reserva/{reserva}/pago-cancelado', [PagoReservaController::class, 'cancel'])->name('pago.cancel');
    Route::post('/reserva/{reserva}/reembolso', [PagoReservaController::class, 'procesarReembolso'])->name('pago.reembolso');
    Route::get('/pago/{reserva}/reembolso', [PagoReservaController::class, 'mostrarReembolso'])->name('pago.reembolso.mostrar');
});


// routes/web.php

require __DIR__.'/auth.php';
