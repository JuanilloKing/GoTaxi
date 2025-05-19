<?php

namespace Database\Seeders;
    
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProvinciaSeeder extends Seeder
{
    public function run()
    {
        DB::table('provincias')->insert([
            ['id_provincia' => 2, 'provincia' => 'Albacete'],
            ['id_provincia' => 3, 'provincia' => 'Alicante/Alacant'],
            ['id_provincia' => 4, 'provincia' => 'Almería'],
            ['id_provincia' => 1, 'provincia' => 'Araba/Álava'],
            ['id_provincia' => 33, 'provincia' => 'Asturias'],
            ['id_provincia' => 5, 'provincia' => 'Ávila'],
            ['id_provincia' => 6, 'provincia' => 'Badajoz'],
            ['id_provincia' => 7, 'provincia' => 'Balears, Illes'],
            ['id_provincia' => 8, 'provincia' => 'Barcelona'],
            ['id_provincia' => 48, 'provincia' => 'Bizkaia'],
            ['id_provincia' => 9, 'provincia' => 'Burgos'],
            ['id_provincia' => 10, 'provincia' => 'Cáceres'],
            ['id_provincia' => 11, 'provincia' => 'Cádiz'],
            ['id_provincia' => 39, 'provincia' => 'Cantabria'],
            ['id_provincia' => 12, 'provincia' => 'Castellón/Castelló'],
            ['id_provincia' => 51, 'provincia' => 'Ceuta'],
            ['id_provincia' => 13, 'provincia' => 'Ciudad Real'],
            ['id_provincia' => 14, 'provincia' => 'Córdoba'],
            ['id_provincia' => 15, 'provincia' => 'Coruña, A'],
            ['id_provincia' => 16, 'provincia' => 'Cuenca'],
            ['id_provincia' => 20, 'provincia' => 'Gipuzkoa'],
            ['id_provincia' => 17, 'provincia' => 'Girona'],
            ['id_provincia' => 18, 'provincia' => 'Granada'],
            ['id_provincia' => 19, 'provincia' => 'Guadalajara'],
            ['id_provincia' => 21, 'provincia' => 'Huelva'],
            ['id_provincia' => 22, 'provincia' => 'Huesca'],
            ['id_provincia' => 23, 'provincia' => 'Jaén'],
            ['id_provincia' => 24, 'provincia' => 'León'],
            ['id_provincia' => 27, 'provincia' => 'Lugo'],
            ['id_provincia' => 25, 'provincia' => 'Lleida'],
            ['id_provincia' => 28, 'provincia' => 'Madrid'],
            ['id_provincia' => 29, 'provincia' => 'Málaga'],
            ['id_provincia' => 52, 'provincia' => 'Melilla'],
            ['id_provincia' => 30, 'provincia' => 'Murcia'],
            ['id_provincia' => 31, 'provincia' => 'Navarra'],
            ['id_provincia' => 32, 'provincia' => 'Ourense'],
            ['id_provincia' => 34, 'provincia' => 'Palencia'],
            ['id_provincia' => 35, 'provincia' => 'Palmas, Las'],
            ['id_provincia' => 36, 'provincia' => 'Pontevedra'],
            ['id_provincia' => 26, 'provincia' => 'Rioja, La'],
            ['id_provincia' => 37, 'provincia' => 'Salamanca'],
            ['id_provincia' => 38, 'provincia' => 'Santa Cruz de Tenerife'],
            ['id_provincia' => 40, 'provincia' => 'Segovia'],
            ['id_provincia' => 41, 'provincia' => 'Sevilla'],
            ['id_provincia' => 42, 'provincia' => 'Soria'],
            ['id_provincia' => 43, 'provincia' => 'Tarragona'],
            ['id_provincia' => 44, 'provincia' => 'Teruel'],
            ['id_provincia' => 45, 'provincia' => 'Toledo'],
            ['id_provincia' => 46, 'provincia' => 'Valencia/València'],
            ['id_provincia' => 47, 'provincia' => 'Valladolid'],
            ['id_provincia' => 49, 'provincia' => 'Zamora'],
            ['id_provincia' => 50, 'provincia' => 'Zaragoza'],
        ]);
    }
}

