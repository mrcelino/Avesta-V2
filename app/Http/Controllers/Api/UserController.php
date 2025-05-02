<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class UserController extends Controller
{
    public function updateProfile(Request $request, $id_user)
    {
        // Cari user berdasarkan ID
        $user = User::findOrFail($id_user);

        // Validasi data yang masuk
        $validatedData = $request->validate([
            'nama_depan' => 'required|string|max:255',
            'nama_belakang' => 'nullable|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id_user . ',id_user',
            'alamat' => 'nullable|string|max:500',
            'no_telepon' => 'nullable|string|max:15',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'nullable|in:Laki-laki,Perempuan',
            'saldo' => 'nullable|numeric|min:0',
            'role' => 'nullable|in:pemilik,karyawan,user',
            'foto' => 'nullable|image|max:10240', // Maksimum 10MB
        ]);

        try {
            DB::beginTransaction();

            // Jika ada file baru, hapus foto lama dan simpan yang baru
            if ($request->hasFile('foto')) {
                if ($user->foto) {
                    Storage::disk('public')->delete($user->foto);
                }
                $path = $request->file('foto')->store('profile_photos', 'public');
                $validatedData['foto'] = $path;
            }

            // Update user
            $user->update($validatedData);

            DB::commit();

            return response()->json([
                'message' => 'Data pengguna berhasil diperbarui',
                'user' => $user
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Terjadi kesalahan saat memperbarui data pengguna',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}