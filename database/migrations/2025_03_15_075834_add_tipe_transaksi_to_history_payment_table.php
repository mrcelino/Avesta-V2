<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('history_payment', function (Blueprint $table) {
            $table->enum('tipe_transaksi', ['top-up', 'pembayaran', 'penarikan', 'refund'])->after('status_history');
        });
    }

    public function down()
    {
        Schema::table('history_payment', function (Blueprint $table) {
            $table->dropColumn('tipe_transaksi');
        });
    }
};