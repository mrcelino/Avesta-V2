<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HistoryPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class HistoryPaymentController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $idUser = $user->id_user; // Sesuaikan dengan nama kolom id user di tabel users
        $history = HistoryPayment::where('id_user', $idUser)->orderBy('tanggal_history', 'desc')->get();

        Log::info('History payment fetched', ['user_id' => $idUser, 'count' => $history->count()]);

        return response()->json([
            'message' => 'History payment fetched successfully',
            'data' => $history,
        ], 200);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'id_user' => 'required|exists:users,id_user',
                'id_order' => 'required|exists:orders,id_order',
                'id_payment' => 'nullable|exists:payments,id_payment',
                'tanggal_history' => 'required|date',
                'tipe_transaksi' => 'required|in:pembayaran,refund',
                'wallet_payment' => 'required|numeric|min:0',
            ]);

            $history = HistoryPayment::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'History payment created successfully',
                'data' => $history,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create history payment: ' . $e->getMessage(),
            ], 500);
        }
    }
}