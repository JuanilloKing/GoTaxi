<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Taxista extends Model
{
    /** @use HasFactory<\Database\Factories\TaxistaFactory> */
    use HasFactory;

    public function user() {
        return $this->morphOne(User::class, 'tipable');
    }

    public function vehiculo() {
        return $this->belongsTo(Vehiculo::class);
    }

    public function estado_taxistas()
    {
    return $this->belongsTo(EstadoTaxista::class);
    }

    public function reservas()
{
    return $this->hasMany(Reserva::class);
}


    protected $fillable = [
        'vehiculo_id',
        'ciudad',
        'ultimo_viaje', 
    ];
}
