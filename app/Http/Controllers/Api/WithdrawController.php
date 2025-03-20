<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HistoryPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WithdrawController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1000', // Minimal withdraw 1000
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $amount = (float) $request->amount;
        $currentSaldo = (float) $user->saldo;

        // Cek saldo cukup
        if ($currentSaldo <= 0) {
            return response()->json(['message' => 'Saldo Anda 0, tidak bisa withdraw'], 400);
        }
        if ($currentSaldo < $amount) {
            return response()->json(['message' => 'Saldo tidak cukup untuk withdraw'], 400);
        }

        // Kurangi saldo
        $user->saldo = $currentSaldo - $amount;
        $user->save();

        // Buat entri di history_payment
        HistoryPayment::create([
          'tanggal_history' => now(), // Waktu sekarang
        //   'status_history' => 'completed', // Otomatis completed
          'tipe_transaksi' => 'penarikan', // Tipe withdraw
          'id_user' => $user->id_user, // Sesuaikan nama kolom id user
          'wallet_payment' => $amount, // Nominal yang ditarik
          'id_order' => null, // Kosong untuk withdraw
          'id_payment' => null, // Kosong untuk withdraw
      ]);

        Log::info('Withdraw successful', ['user_id' => $user->id, 'amount' => $request->amount]);

        return response()->json([
            'message' => 'Withdraw berhasil',
            'user' => $user,
        ], 200);
    }
}