<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Taxista extends Model
{
    /** @use HasFactory<\Database\Factories\TaxistaFactory> */
    use HasFactory;

    public function users() {
        return $this->morphOne(User::class, 'tipable');
    }

    public function vehiculo() {
        return $this->belongsTo(Vehiculo::class);
    }
}
