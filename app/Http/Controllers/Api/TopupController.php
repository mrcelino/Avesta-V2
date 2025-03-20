<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\HistoryPayment; // Tambah model

class TopupController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1000', // Minimal topup 1000
        ]);

        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        // Tambah saldo
        $user->saldo = (float) $user->saldo + $request->amount;
        $user->save();

        // Buat entri di history_payment
        HistoryPayment::create([
            'tanggal_history' => now(), // Waktu sekarang
            // 'status_history' => 'completed', // Otomatis completed
            'tipe_transaksi' => 'top-up', // Tipe top-up
            'wallet_payment' => $request->amount, // Jumlah top-up
            'id_user' => $user->id_user, // ID user dari request (sesuaikan nama kolom)
            'id_order' => null, // Kosong untuk topup
            'id_payment' => null, // Kosong untuk topup
        ]);

        Log::info('Topup successful', ['user_id' => $user->id_user, 'amount' => $request->amount]);

        return response()->json([
            'message' => 'Topup berhasil',
            'user' => $user,
        ], 200);
    }
}