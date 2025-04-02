<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehiculos', function (Blueprint $table) {
            $table->id();
            $table->string('licencia_taxi')->unique();
            $table->string('matricula')->unique();
            $table->string('marca');
            $table->string('estado')->default('no disponible');
            $table->string('modelo');
            $table->string('color');
            $table->boolean('minusvalido');
            $table->string('capacidad');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehiculos');
    }
};
