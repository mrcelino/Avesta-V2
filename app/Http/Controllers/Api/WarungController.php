<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Warung;
use App\Models\Unggas;
use App\Models\Order;
use App\Models\Karyawan;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
class WarungController extends Controller
{
    public function page($id)
    {
    return Inertia::render('Buyer/Toko', ['id' => $id]);
    }

    public function show($id)
    {
        // Mengambil data warung berdasarkan ID beserta relasi unggas dan orders
        $warung = Warung::with(['orders', 'unggas'])->find($id);
    
        // Memeriksa apakah warung ditemukan
        if (!$warung) {
            return response()->json(['message' => 'Warung not found'], 404);
        }
    
        // Mengembalikan data dalam format JSON
        return response()->json($warung);
    }

    public function all()
    {
        // Mendapatkan seluruh data warung
        $warungs = Warung::all();

        // Mengembalikan data dalam format JSON
        return response()->json($warungs);
    }

    public function getKelurahan()
    {
    // Mengambil data kelurahan yang unik (distinct)
    $kelurahans = Warung::select('kelurahan')->distinct()->get();

    // Mengembalikan data dalam format JSON
    return response()->json($kelurahans);
    }

    // GET Warung with Unggas
    public function getuserTokoUnggas(Request $request)
    {
        try {
            $userId = Auth::id();
            if (!$userId) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }
    
            $toko = Warung::with('unggas')
                ->where('id_user', $userId)
                ->get();
    
            if ($toko->isEmpty()) {
                return response()->json(['message' => 'Warung not found for this user'], 404);
            }
    
            return response()->json($toko, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Terjadi kesalahan di server'], 500);
        }
    }

    public function getWarungwithOrders(Request $request)
    {
        try {
            $userId = Auth::id();
            if (!$userId) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }
    
            $toko = Warung::with(['orders', 'orders.orderItems'])
            ->where('id_user', $userId)
            ->get();
    
            if ($toko->isEmpty()) {
                return response()->json(['message' => 'Warung not found for this user'], 404);
            }
    
            return response()->json($toko, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Terjadi kesalahan di server'], 500);
        }
    }
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nama_warung' => 'required|string|max:100',
                'alamat_warung' => 'required|string|max:255',
                'foto_warung' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10000',
                'kelurahan' => 'nullable|string|max:100',
                'deskripsi' => 'nullable|string',
                'nomor_hp' => 'nullable|string|max:20',
            ]);
    
            $data = $validated;
            $data['id_user'] = Auth::id();
            $data['kota'] = $request->input('kota', 'Kabupaten Sleman');
            $data['kecamatan'] = $request->input('kecamatan', 'Mlati');
            $data['kode_pos'] = $request->input('kode_pos', '55284');
    
            if ($request->hasFile('foto_warung')) {
                $path = $request->file('foto_warung')->store('warung', 'public');
                $data['foto_warung'] = $path;
            }
    
            Warung::create($data);
    
            return response()->json(['message' => 'Toko berhasil ditambahkan!'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Terjadi kesalahan di server'], 500);
        }
    }

    public function update(Request $request, $id_warung)
    {
        try {
            $warung = Warung::where('id_warung', $id_warung)
                ->where('id_user', Auth::id())
                ->firstOrFail();
    
            $data = $request->validate([
                'nama_warung'   => 'required|string|max:100',
                'alamat_warung'=> 'required|string|max:255',
                'foto_warung'   => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10000',
                'kelurahan'     => 'nullable|string|max:100',
                'deskripsi'     => 'nullable|string',
                'nomor_hp'      => 'nullable|string|max:20',
            ]) + [
                'kota'      => $request->input('kota', 'Kabupaten Sleman'),
                'kecamatan' => $request->input('kecamatan', 'Mlati'),
                'kode_pos'  => $request->input('kode_pos', '55284'),
            ];
    
            $data['foto_warung'] = $request->hasFile('foto_warung')
                ? tap($request->file('foto_warung'), fn($file) => $warung->foto_warung && Storage::disk('public')->delete($warung->foto_warung))
                    ->store('warung', 'public')
                : $warung->foto_warung;
    
            $warung->update($data);
            return response()->json(['message' => 'Warung berhasil diupdate!']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Terjadi kesalahan di server'], 500);
        }
    }
    
    

    public function destroy($id_warung)
    {
        try {
            $warung = Warung::where('id_warung', $id_warung)
                ->where('id_user', Auth::id())
                ->first();

            if (!$warung) {
                return response()->json(['error' => 'Warung tidak ditemukan atau Anda tidak memiliki akses.'], 404);
            }

            // Hapus file gambar dari storage kalo ada
            if ($warung->foto_warung) {
                Storage::disk('public')->delete($warung->foto_warung);
            }

            $warung->delete();

            return response()->json(['message' => 'Warung berhasil dihapus!'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Terjadi kesalahan di server'], 500);
        }
    }

    public function getStats(Request $request, $id_warung)
    {
        // Jumlah pesanan berhasil (status 'completed')
        $successfulOrders = Order::where('id_warung', $id_warung)
            ->where('status_order', 'completed')
            ->count();

        // Total unggas (sum stok unggas di warung)
        $totalUnggas = Unggas::where('id_warung', $id_warung)
            ->count('id_unggas');

        // // Jumlah karyawan di warung
        // $totalEmployees = Karyawan::where('id_warung', $id_warung)
        //     ->count();

        return response()->json([
            'successful_orders' => $successfulOrders,
            'total_unggas' => $totalUnggas,
            // 'total_employees' => $totalEmployees,
        ], 200);
    }
}