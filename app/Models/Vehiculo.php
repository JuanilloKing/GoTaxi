<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehiculo extends Model
{
    /** @use HasFactory<\Database\Factories\VehiculoFactory> */
    use HasFactory;

    public function taxistas()
    {
        return $this->hasMany(Taxista::class);
    }
}
