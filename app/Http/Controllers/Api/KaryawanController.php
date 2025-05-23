<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class KaryawanController extends Controller
{
    public function store(Request $request)
    {
        // Ambil user yang sedang login (harus pemilik)
        $owner = Auth::user();

        if (!$owner || $owner->role !== 'pemilik') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Validasi input
        $validator = Validator::make($request->all(), [
            'nama_depan' => 'required|string|max:255',
            'nama_belakang' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'no_telepon' => 'required|string|max:15',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Upload foto jika ada
        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('foto-karyawan', 'public');
        }


        // Buat user karyawan dengan id_warung milik owner
        $user = User::create([
            'nama_depan' => $request->nama_depan,
            'nama_belakang' => $request->nama_belakang,
            'email' => $request->email,
            'no_telepon' => $request->no_telepon,
            'foto' => $fotoPath,
            'role' => 'karyawan',
            'id_warung' => $owner->id_warung, // ⬅️ Tambahan penting
            'password' => Hash::make('password'), // default password
        ]);

        return response()->json([
            'message' => 'Karyawan berhasil ditambahkan',
            'data' => $user,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        // Cari berdasarkan id_user sebagai primary key
        $karyawan = User::where('role', 'karyawan')->where('id_user', $id)->firstOrFail();

        // Validasi dengan primary key id_user
        $validator = Validator::make($request->all(), [
            'nama_depan' => 'sometimes|required|string|max:255',
            'nama_belakang' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users', 'email')->ignore($karyawan->id_user, 'id_user')], // Eksplisit pakai id_user
            'no_telepon' => 'sometimes|required|string|max:15',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update data secara eksplisit
        if ($request->has('nama_depan')) {
            $karyawan->nama_depan = $request->input('nama_depan');
        }
        if ($request->has('nama_belakang')) {
            $karyawan->nama_belakang = $request->input('nama_belakang');
        }
        if ($request->has('email')) {
            $karyawan->email = $request->input('email');
        }
        if ($request->has('no_telepon')) {
            $karyawan->no_telepon = $request->input('no_telepon');
        }

        // Handle foto
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('foto-karyawan', 'public');
            $karyawan->foto = $fotoPath;
        }

        // Simpan dan refresh
        $karyawan->save();
        $karyawan->refresh();

        return response()->json(['message' => 'Karyawan berhasil diupdate', 'data' => $karyawan]);
    }

    public function destroy($id)
    {
        $karyawan = User::where('role', 'karyawan')->findOrFail($id);
        $karyawan->delete();

        return response()->json(['message' => 'Karyawan berhasil dihapus']);
    }

    public function getByWarung($id_warung)
    {
        $karyawans = User::where('role', 'karyawan')
            ->where('id_warung', $id_warung)
            ->get();

        return response()->json($karyawans);
    }

    // Tambahan untuk mendapatkan karyawan berdasarkan ID
    public function show($id)
    {
        $karyawan = User::where('role', 'karyawan')->findOrFail($id);

        // Pastikan karyawan hanya bisa diakses oleh pemilik warung yang sesuai
        $owner = Auth::user();
        if (!$owner || $owner->role !== 'pemilik' || $owner->id_warung !== $karyawan->id_warung) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($karyawan);
    }
}