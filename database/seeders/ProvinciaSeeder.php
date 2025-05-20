<?php

namespace Database\Seeders;
    
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProvinciaSeeder extends Seeder
{
    public function run()
    {
        DB::table('provincias')->insert([
            ['id' => 2, 'provincia' => 'Albacete'],
            ['id' => 3, 'provincia' => 'Alicante/Alacant'],
            ['id' => 4, 'provincia' => 'Almería'],
            ['id' => 1, 'provincia' => 'Araba/Álava'],
            ['id' => 33, 'provincia' => 'Asturias'],
            ['id' => 5, 'provincia' => 'Ávila'],
            ['id' => 6, 'provincia' => 'Badajoz'],
            ['id' => 7, 'provincia' => 'Balears, Illes'],
            ['id' => 8, 'provincia' => 'Barcelona'],
            ['id' => 48, 'provincia' => 'Bizkaia'],
            ['id' => 9, 'provincia' => 'Burgos'],
            ['id' => 10, 'provincia' => 'Cáceres'],
            ['id' => 11, 'provincia' => 'Cádiz'],
            ['id' => 39, 'provincia' => 'Cantabria'],
            ['id' => 12, 'provincia' => 'Castellón/Castelló'],
            ['id' => 51, 'provincia' => 'Ceuta'],
            ['id' => 13, 'provincia' => 'Ciudad Real'],
            ['id' => 14, 'provincia' => 'Córdoba'],
            ['id' => 15, 'provincia' => 'Coruña, A'],
            ['id' => 16, 'provincia' => 'Cuenca'],
            ['id' => 20, 'provincia' => 'Gipuzkoa'],
            ['id' => 17, 'provincia' => 'Girona'],
            ['id' => 18, 'provincia' => 'Granada'],
            ['id' => 19, 'provincia' => 'Guadalajara'],
            ['id' => 21, 'provincia' => 'Huelva'],
            ['id' => 22, 'provincia' => 'Huesca'],
            ['id' => 23, 'provincia' => 'Jaén'],
            ['id' => 24, 'provincia' => 'León'],
            ['id' => 27, 'provincia' => 'Lugo'],
            ['id' => 25, 'provincia' => 'Lleida'],
            ['id' => 28, 'provincia' => 'Madrid'],
            ['id' => 29, 'provincia' => 'Málaga'],
            ['id' => 52, 'provincia' => 'Melilla'],
            ['id' => 30, 'provincia' => 'Murcia'],
            ['id' => 31, 'provincia' => 'Navarra'],
            ['id' => 32, 'provincia' => 'Ourense'],
            ['id' => 34, 'provincia' => 'Palencia'],
            ['id' => 35, 'provincia' => 'Palmas, Las'],
            ['id' => 36, 'provincia' => 'Pontevedra'],
            ['id' => 26, 'provincia' => 'Rioja, La'],
            ['id' => 37, 'provincia' => 'Salamanca'],
            ['id' => 38, 'provincia' => 'Santa Cruz de Tenerife'],
            ['id' => 40, 'provincia' => 'Segovia'],
            ['id' => 41, 'provincia' => 'Sevilla'],
            ['id' => 42, 'provincia' => 'Soria'],
            ['id' => 43, 'provincia' => 'Tarragona'],
            ['id' => 44, 'provincia' => 'Teruel'],
            ['id' => 45, 'provincia' => 'Toledo'],
            ['id' => 46, 'provincia' => 'Valencia/València'],
            ['id' => 47, 'provincia' => 'Valladolid'],
            ['id' => 49, 'provincia' => 'Zamora'],
            ['id' => 50, 'provincia' => 'Zaragoza'],
        ]);
    }
}

