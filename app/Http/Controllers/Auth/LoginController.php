<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;

class LoginController extends Controller
{
    public function show()
    {
        return Inertia::render('Auth/Login');
    }

    public function apiLogin(Request $request)
    {
        Log::info('Login attempt', $request->all());

        $credentials = $request->validate([
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:8',
        ]);

        Log::info('Credentials validated', $credentials);

        if (Auth::guard('web')->attempt($credentials)) {
            Log::info('Auth attempt successful');
            $request->session()->regenerate();
            $user = Auth::guard('web')->user();

            if (!$user) {
                Log::error('User is null after successful auth');
                return response()->json(['message' => 'User tidak ditemukan setelah login'], 500);
            }

            Log::info('User fetched', ['user' => json_encode($user)]);

            return response()->json([
                'message' => 'Login berhasil',
                'user' => $user,
            ], 200);
        }

        Log::info('Auth attempt failed');
        return response()->json([
            'message' => 'Email atau password salah',
            'errors' => ['email' => ['Email atau password salah']],
        ], 401);
    }

    public function apiLogout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logout berhasil'], 200);
    }
}