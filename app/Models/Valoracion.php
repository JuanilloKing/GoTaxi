<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Valoracion extends Model
{
    /** @use HasFactory<\Database\Factories\ValoracionFactory> */
    use HasFactory;

    protected $table = 'valoraciones';

    protected $fillable = [
        'reserva_id',
        'puntuacion',
        'comentario',
    ];

    public function taxista()
    {
        return $this->belongsTo(Taxista::class);
    }
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }
    public function reserva()
    {
        return $this->belongsTo(Reserva::class);
    }
}
