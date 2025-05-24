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
            $table->timestamp('fecha_recogida');            //fecha en la que se recoge al cliente
            $table->timestamp('fecha_entrega')->nullable();
            $table->foreignId('estado_reservas_id')->constrained('estado_reservas');
            $table->string('origen');
            $table->string('destino');
            $table->integer('num_pasajeros');
            $table->string('anotaciones')->nullable();
            $table->float('distancia');
            $table->decimal('precio', 6, 2);
            $table->boolean('pagado')->default(false);
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
