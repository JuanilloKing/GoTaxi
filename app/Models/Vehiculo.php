<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehiculo extends Model
{
    use SoftDeletes;
    /** @use HasFactory<\Database\Factories\VehiculoFactory> */
    use HasFactory;

    public function taxistas()
    {
        return $this->hasMany(Taxista::class);
    }

    protected $fillable = [
        'licencia_taxi',
        'matricula',
        'marca',
        'modelo',
        'estado',
        'color',
        'minusvalido',
        'capacidad',
    ];
}
