<?php

namespace Database\Seeders;

use App\Models\Taxista;
use App\Models\User;
use App\Models\Vehiculo;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TaxistaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
public function run(): void
{
    DB::beginTransaction();

    try {
        $this->crearTaxista([
            'email' => 'juan@example.com',
            'dni' => '12345678Z',
            'telefono' => '600111111',
            'municipio_id' => 1779,
            'matricula' => '1111ABC',
            'licencia' => 'LIC-001',
            'nombre' => 'Juan',
            'apellidos' => 'Pérez',
            'marca' => 'Toyota',
            'modelo' => 'Prius',
            'color' => 'Blanco',
            'capacidad' => 4,
        ]);

        $this->crearTaxista([
            'email' => 'maria@example.com',
            'dni' => '87654321B',
            'telefono' => '600222222',
            'municipio_id' => 1798,
            'matricula' => '2222DEF',
            'licencia' => 'LIC-002',
            'nombre' => 'María',
            'apellidos' => 'Gómez',
            'marca' => 'Ford',
            'modelo' => 'Focus',
            'color' => 'Rojo',
            'capacidad' => 5,
        ]);

        $this->crearTaxista([
            'email' => 'pedro@example.com',
            'dni' => '11223344C',
            'telefono' => '600333333',
            'municipio_id' => 1798,
            'matricula' => '3333GHI',
            'licencia' => 'LIC-003',
            'nombre' => 'Pedro',
            'apellidos' => 'Ramírez',
            'marca' => 'Volkswagen',
            'modelo' => 'Golf',
            'color' => 'Azul',
            'capacidad' => 4,
        ]);
        DB::commit();
    } catch (\Exception $e) {
        DB::rollBack();
        dump('Error: ' . $e->getMessage());
    }
}

private function crearTaxista(array $data): void
{
    $vehiculo = Vehiculo::create([
        'licencia_taxi' => $data['licencia'],
        'matricula' => $data['matricula'],
        'marca' => $data['marca'],
        'modelo' => $data['modelo'],
        'color' => $data['color'],
        'minusvalido' => false,
        'capacidad' => $data['capacidad'],
    ]);

    $taxista = Taxista::create([
        'municipio_id' => $data['municipio_id'],
        'vehiculo_id' => $vehiculo->id,
        'estado_taxistas_id' => 1,
    ]);

    $user = new User();
    $user->nombre = $data['nombre'];
    $user->apellidos = $data['apellidos'];
    $user->dni = $data['dni'];
    $user->telefono = $data['telefono'];
    $user->email = $data['email'];
    $user->password = Hash::make('password');
    $user->tipable()->associate($taxista);
    $user->save();
}


}
