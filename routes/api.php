<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\TarifaController;


Route::get('/provincias', [LocationController::class, 'getProvincias']);
Route::get('/municipios/{provinciaId}', [LocationController::class, 'getMunicipios']);
Route::get('/tarifas/{provincia}', [TarifaController::class, 'getTarifaPorProvincia']);