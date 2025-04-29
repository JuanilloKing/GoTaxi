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
            $table->timestamp('fecha_recogida');            //es la misma que fecha reserva si se pide para recoger en el momento
            $table->timestamp('fecha_entrega')->nullable();
            $table->foreignId('estado_reservas_id')->constrained('estado_reservas');
            $table->string('origen');
            $table->string('destino');
            $table->integer('num_pasajeros');
            $table->string('anotaciones')->nullable();
            $table->float('distancia');
            $table->decimal('precio', 6, 2);
            $table->integer('duracion');
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
