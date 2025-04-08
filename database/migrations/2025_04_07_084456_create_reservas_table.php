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
        Schema::create('reservas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained();
            $table->foreignId('taxista_id')->constrained();
            $table->timestamp('fecha_reserva');
            $table->timestamp('fecha_recogida');
            $table->timestamp('fecha_entrega')->nullable();
            $table->foreignId('estado_id')->constrained();
            $table->string('origen');
            $table->string('destino');
            $table->string('num_pasajeros');
            $table->string('distancia');
            $table->string('precio');
            $table->boolean('minusvalido');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservas');
    }
};
