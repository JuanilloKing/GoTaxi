<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ImportarMunicipiosSeeder extends Seeder
{
    public function run()
    {
        $sql = file_get_contents(database_path('sql/spain_municipios.sql'));
        DB::unprepared($sql);
    }
}
