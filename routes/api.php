<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LocationController;

Route::get('/provincias', [LocationController::class, 'getProvincias']);
Route::get('/municipios/{provinciaId}', [LocationController::class, 'getMunicipios']);
