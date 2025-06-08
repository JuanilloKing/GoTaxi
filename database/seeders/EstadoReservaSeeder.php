<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EstadoReservaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('estado_reservas')->insert([
            ['estado'=> 'pendiente'],
            ['estado' => 'confirmada'],
            ['estado' => 'cancelada'],
            ['estado' => 'en curso'],
            ['estado' => 'finalizada']    
        ]);
    }
}
