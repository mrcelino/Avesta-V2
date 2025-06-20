<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Http\Controllers\Controller;

class RegisterController extends Controller
{
    public function show($role = 'user')
    {
        return Inertia::render('Auth/Register', ['role' => $role]);
    }

    public function apiRegister(Request $request)
    {
        $data = $request->validate([
            'nama_depan' => 'required|string|max:255',
            'nama_belakang' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'no_telepon' => 'required|string|max:15',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:user,mitra',
        ]);

        $data['password'] = Hash::make($data['password']);
        $data['alamat'] = $request->alamat ?? '';

        // Mapping role: mitra dari frontend jadi pemilik di backend
        $data['role'] = $request->role === 'mitra' ? 'pemilik' : 'user';

        $user = User::create($data);

        return response()->json([
            'message' => 'Registrasi berhasil',
            'user' => $user,
        ], 201);
    }
}