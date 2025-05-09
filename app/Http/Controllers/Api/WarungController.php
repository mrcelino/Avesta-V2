<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Warung;
use App\Models\Unggas;
use App\Models\Order;
use App\Models\User;
use App\Models\HistoryPayment;
use App\Models\Karyawan;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
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

            // Tambahkan jenis_unggas ke order_items dengan join
            $toko = $toko->map(function ($warung) {
                $warung->orders = $warung->orders->map(function ($order) {
                    if ($order->orderItems) {
                        $order->order_items = $order->orderItems->map(function ($item) {
                            // Ambil jenis_unggas dari tabel unggas berdasarkan id_unggas
                            $jenisUnggas = DB::table('unggas')
                                ->where('id_unggas', $item->id_unggas)
                                ->value('jenis_unggas');
                            $item->jenis_unggas = $jenisUnggas ?? 'Nama Unggas Tidak Diketahui';
                            return $item;
                        });
                    }
                    return $order;
                });
                return $warung;
            });

            return response()->json($toko, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Terjadi kesalahan di server: ' . $e->getMessage()], 500);
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
    
    public function completeOrder(Request $request)
    {
        try {
            $userId = Auth::id();
            if (!$userId) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            $request->validate([
                'id_order' => 'required|integer|exists:orders,id_order',
            ]);

            $order = Order::find($request->id_order);

            // Pastikan order milik user yang login
            $warung = Warung::where('id_user', $userId)
                ->where('id_warung', $order->id_warung)
                ->first();
            if (!$warung) {
                return response()->json(['error' => 'Order not found or unauthorized'], 403);
            }

            // Cek status order
            if ($order->status_order === 'completed') {
                return response()->json(['message' => 'Order already completed'], 400);
            }
            if ($order->status_order === 'canceled') {
                return response()->json(['message' => 'Cannot complete a canceled order'], 400);
            }

            // Mulai transaksi
            DB::beginTransaction();

            // Ubah status order jadi completed
            $order->status_order = 'completed';
            $order->updated_at = now();
            $order->save();

            // Tambah saldo ke user (pemilik warung)
            $user = User::find($userId);
            if (!$user) {
                DB::rollBack();
                return response()->json(['error' => 'User not found'], 404);
            }

            $totalHarga = (float) $order->total_harga;
            $user->saldo = ($user->saldo ?? 0) + $totalHarga;
            $user->save();

            // Buat entri di history_payment
            HistoryPayment::create([
                'tanggal_history' => now(), // Waktu sekarang
            //   'status_history' => 'completed', // Otomatis completed
                'tipe_transaksi' => 'pembayaran', // Tipe withdraw
                'id_user' => $user->id_user, // Sesuaikan nama kolom id user
                'wallet_payment' => $totalHarga, // Nominal yang ditarik
                'id_order' => null, // Kosong untuk withdraw
                'id_payment' => null, // Kosong untuk withdraw
            ]);

            DB::commit();

            return response()->json(['message' => 'Order completed and saldo updated'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Terjadi kesalahan di server: ' . $e->getMessage()], 500);
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