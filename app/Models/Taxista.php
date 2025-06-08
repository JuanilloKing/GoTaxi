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

    public function estado_taxistas()
    {
    return $this->belongsTo(EstadoTaxista::class);
    }

    public function reservas()
    {
        return $this->hasMany(Reserva::class);
    }

    public function municipio()
    {
        return $this->belongsTo(Municipio::class);
    }

    public function valoraciones()
{
    return $this->hasMany(Valoracion::class);
}


    protected $fillable = [
        'vehiculo_id',
        'municipio_id',
        'ultimo_viaje', 
    ];
}
