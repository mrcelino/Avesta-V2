<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;
use App\Http\Controllers\Controller;

class LoginController extends Controller
{
    public function show()
    {
        return Inertia::render('Auth/Login');
    }

    public function apiLogin(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:8',
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
        
            if (!$user instanceof User) {
                return response()->json(['message' => 'User tidak valid setelah login'], 500);
            }
        
            if (!$user->id_user) {
                return response()->json(['message' => 'User ID null, token tidak bisa dibuat'], 500);
            }
        
            $token = $user->createToken('auth_token')->plainTextToken;
        
            return response()->json([
                'message' => 'Login berhasil',
                'user' => $user,
                'token' => $token,
            ], 200);
        }
        

        return response()->json([
            'message' => 'Email atau password salah',
            'errors' => ['email' => ['Email atau password salahhhhhh']],
        ], 401);
    }

    public function apiLogout(Request $request)
    {
    $user = $request->user();
    
    if ($user) {
        $user->tokens()->delete();
    }

    return response()->json(['message' => 'Logout berhasil'], 200);
}

}