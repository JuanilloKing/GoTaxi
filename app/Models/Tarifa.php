<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarifa extends Model
{
    protected $fillable = ['provincia_id', 'precio'];

    public function provincia()
    {
        return $this->belongsTo(Provincia::class);
    }
}
