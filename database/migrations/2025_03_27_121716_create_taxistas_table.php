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
        Schema::create('taxistas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vehiculo_id'); 
            $table->foreign('vehiculo_id')->references('id')->on('vehiculos');
            $table->timestamp('ultimo_viaje')->nullable();
            $table->foreignId('municipio_id')->constrained('municipios');
            $table->foreignId('estado_taxistas_id')->constrained('estado_taxistas')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taxistas');
    }
};
