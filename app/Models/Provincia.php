<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Provincia extends Model
{
    protected $primaryKey = 'id_provincia';
    protected $table = 'provincias';        
    public $timestamps = false;           

    public function municipios(): HasMany
    {
        return $this->hasMany(Municipio::class, 'provincia_id');
    }
}
