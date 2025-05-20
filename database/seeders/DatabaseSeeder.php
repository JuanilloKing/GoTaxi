<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Database\Seeders\ImportarMunicipiosSeeder;
use Database\Seeders\ProvinciaSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            EstadoTaxistaSeeder::class,
            EstadoReservaSeeder::class,
            ProvinciaSeeder::class,
            ImportarMunicipiosSeeder::class,
            TarifaSeeder::class,
        ]);
    }
}
