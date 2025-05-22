<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ResetPassword;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Carbon;

class ResetPasswordController extends Controller
{
    // Step 1: Kirim token ke email
    public function sendToken(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Email tidak ditemukan'], 404);
        }

        $token = random_int(100000, 999999); // Token 6 digit
        $expire = Carbon::now()->addMinutes(15);

        ResetPassword::create([
            'id_user' => $user->id_user,
            'token' => $token,
            'tanggal_kadaluarsa' => $expire,
            'is_used' => 0,
        ]);

        // Kirim email
        Mail::raw("Token reset password Anda adalah: $token", function ($message) use ($user) {
            $message->to($user->email)->subject('Reset Password Token');
        });

        return response()->json(['message' => 'Token telah dikirim ke email Anda.']);
    }

    // Step 2: Verifikasi token
    public function verifyToken(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string'
        ]);

        $user = User::where('email', $request->email)->first();
        if (!$user) return response()->json(['message' => 'User tidak ditemukan'], 404);

        $reset = ResetPassword::where('id_user', $user->id_user)
            ->where('token', $request->token)
            ->where('is_used', 0)
            ->latest()
            ->first();

        if (!$reset || Carbon::now()->gt($reset->tanggal_kadaluarsa)) {
            return response()->json(['message' => 'Token tidak valid atau kadaluarsa'], 400);
        }

        return response()->json(['message' => 'Token valid.']);
    }

    // Step 3: Reset password
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|confirmed|min:8',
        ]);

        $user = User::where('email', $request->email)->first();
        if (!$user) return response()->json(['message' => 'User tidak ditemukan'], 404);

        $reset = ResetPassword::where('id_user', $user->id_user)
            ->where('token', $request->token)
            ->where('is_used', 0)
            ->latest()
            ->first();

        if (!$reset || Carbon::now()->gt($reset->tanggal_kadaluarsa)) {
            return response()->json(['message' => 'Token tidak valid atau kadaluarsa'], 400);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        $reset->is_used = 1;
        $reset->save();

        return response()->json(['message' => 'Password berhasil diubah. Silakan login.']);
    }
}