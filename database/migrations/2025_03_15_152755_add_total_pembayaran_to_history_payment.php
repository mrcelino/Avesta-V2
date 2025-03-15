<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('history_payment', function (Blueprint $table) {
            $table->decimal('wallet_payment', 15, 2)->after('tipe_transaksi')->default(0);
        });
    }

    public function down()
    {
        Schema::table('history_payment', function (Blueprint $table) {
            $table->dropColumn('wallet_payment');
        });
    }
};