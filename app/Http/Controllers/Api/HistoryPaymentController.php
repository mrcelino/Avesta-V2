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
}