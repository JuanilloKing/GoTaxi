<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Provincia;
use App\Models\Tarifa; 

class TarifaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $provincias = Provincia::all();

        foreach ($provincias as $provincia) {
            // Solo crear si no existe ya una tarifa para esta provincia
            Tarifa::firstOrCreate(
                ['provincia_id' => $provincia->id]
            );
        }
    }
}
