<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

   public function up()
   {
       Schema::create('payments', function (Blueprint $table) {
           $table->id('id_payment');
           $table->unsignedBigInteger('id_order');
           $table->decimal('total_payment', 10, 2);
           $table->timestamp('waktu_payment');
           $table->timestamps();

           // Foreign key constraint
           $table->foreign('id_order')->references('id_order')->on('orders')->onDelete('cascade');
       });
   }

   /**
    * Reverse the migrations.
    *
    * @return void
    */
   public function down()
   {
       Schema::dropIfExists('payments');
   }
};