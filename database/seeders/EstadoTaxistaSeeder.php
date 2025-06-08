<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadoTaxistaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('estado_taxistas')->insert([
            ['estado' => 'disponible'],
            ['estado' => 'no disponible'],
            ['estado' => 'ocupado']        
        ]);
    }
}
