<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reserva extends Model
{
    /** @use HasFactory<\Database\Factories\ReservaFactory> */
    use HasFactory;

    protected $fillable = [
        'cliente_id',
        'taxista_id',
        'fecha_reserva',
        'fecha_recogida',
        'fecha_entrega',
        'duracion',
        'origen',
        'destino',
        'num_pasajeros',
        'distancia',
        'anotaciones',
        'precio',
        'estado_reservas_id',
        'minusvalido',
        'stripe_payment_intent_id',
        'ciudad_origen',
    ];

    public function estado_reservas()
    {
    return $this->belongsTo(EstadoReserva::class);
    }

    public function cliente()
{
    return $this->belongsTo(Cliente::class);
}

    public function taxista()
    {
        return $this->belongsTo(Taxista::class);
    }

    public function vehiculo()
    {
        return $this->hasOne(Vehiculo::class, 'id', 'vehiculo_id');
    }

    public function valoracion()
    {
        return $this->hasOne(Valoracion::class);
    }
    
}
