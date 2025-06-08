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
    Schema::create('tarifas', function (Blueprint $table) {
        $table->id();
        $table->foreignId('provincia_id')->constrained();
        $table->decimal('precio_km', 8, 2)->default(1.50);
        $table->decimal('precio_hora', 8, 2)->default(0.20);
        $table->timestamps();
    });     
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tarifas');
    }
};
