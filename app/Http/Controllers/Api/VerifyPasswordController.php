<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class VerifyPasswordController extends Controller
{
    public function verify(Request $request)
    {
        // Pastikan user sudah login
        if (!Auth::check()) {
            Log::warning('Unauthorized access attempt to verify-password', ['request' => $request->all()]);
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: User not authenticated',
            ], 401);
        }

        // Validasi request
        $request->validate([
            'password' => 'required|string|max:255',
        ]);

        $user = Auth::user();
        $password = $request->input('password');

        // Verifikasi password
        if (Hash::check($password, $user->password)) {
            Log::info('Password verified successfully', ['user_id' => $user->id_user]);
            return response()->json([
                'success' => true,
                'message' => 'Password verified successfully',
            ], 200);
        }

        Log::info('Password verification failed', ['user_id' => $user->id_user]);
        return response()->json([
            'success' => false,
            'message' => 'Password salah',
        ], 400);
    }
}