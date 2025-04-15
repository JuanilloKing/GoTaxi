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
        'origen',
        'destino',
        'num_pasajeros',
        'distancia',
        'anotaciones',
        'precio',
        'estado_reservas_id',
        'minusvalido',
    ];

    public function estado_reservas()
    {
    return $this->belongsTo(EstadoReserva::class);
    }

    
}
