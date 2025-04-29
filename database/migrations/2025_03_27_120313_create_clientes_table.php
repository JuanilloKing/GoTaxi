<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
        });

        $clienteId = DB::table('clientes')->insertGetId([
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Crear un usuario asociado al cliente
        DB::table('users')->insert([
            'nombre' => 'Admin',
            'apellidos' => 'Admin',
            'email' => 'admin@admin.com',
            'dni' => '12345678A',
            'telefono' => '123456789',
            'password' => Hash::make('adminadmin'), // Cambiar contraseña por defecto
            'is_admin' => true,
            'tipable_type' => 'App\Models\Cliente',
            'tipable_id' => $clienteId, // El ID del cliente recién insertado
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};
