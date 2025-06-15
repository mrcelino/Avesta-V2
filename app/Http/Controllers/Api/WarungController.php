<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Warung;
use App\Models\Unggas;
use App\Models\Order;
use App\Models\User;
use App\Models\HistoryPayment;
use Illuminate\Support\Carbon;
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

            // Langkah 1: Cek apakah user ini pemilik warung (id_user sama) (Pemilik)
            $toko = Warung::with('unggas')
                ->where('id_user', $userId)
                ->get();

            // Langkah 2: Kalo tidak ada warung yang dimiliki user ini (Karyawan)
            if ($toko->isEmpty()) {
                // Ambil data user untuk cek apakah punya id_warung
                $user = User::find($userId);

                if (!$user || !$user->id_warung) {
                    return response()->json(['message' => 'Warung not found for this user'], 404);
                }

                // Langkah 3: Ambil warung berdasarkan id_warung dari user
                $toko = Warung::with('unggas')
                    ->where('id_warung', $user->id_warung)
                    ->get();

                if ($toko->isEmpty()) {
                    return response()->json(['message' => 'Warung not found for this user'], 404);
                }
            }

            return response()->json($toko, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Terjadi kesalahan di server: ' . $e->getMessage()], 500);
        }
    }

    public function getWarungwithOrders(Request $request)
    {
        try {
            $userId = Auth::id();
            if (!$userId) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            // Langkah 1: Cek apakah user ini pemilik warung (id_user sama) (pemilik)
            $toko = Warung::with(['orders', 'orders.orderItems'])
                ->where('id_user', $userId)
                ->get();

            // Langkah 2: Kalo tidak ada warung yang dimiliki user ini (karyawan)
            if ($toko->isEmpty()) {
                // Ambil data user untuk cek apakah punya id_warung
                $user = User::find($userId);

                if (!$user || !$user->id_warung) {
                    return response()->json(['message' => 'Warung not found for this user'], 404);
                }

                // Langkah 3: Ambil warung berdasarkan id_warung dari user
                $toko = Warung::with(['orders', 'orders.orderItems'])
                    ->where('id_warung', $user->id_warung)
                    ->get();

                if ($toko->isEmpty()) {
                    return response()->json(['message' => 'Warung not found for this user'], 404);
                }
            }

            // Tambahkan jenis_unggas ke order_items dengan join (logika ini tetap)
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
                'latitude' => 'nullable|numeric|between:-90,90',
                'longitude' => 'nullable|numeric|between:-180,180',
                'kota' => 'nullable|string|max:100',
                'kecamatan' => 'nullable|string|max:100',
                'kode_pos' => 'nullable|string|max:10',
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

            // Buat warung dan ambil instance yang baru dibuat
            $warung = Warung::create($data);

            // Update kolom id_warung di tabel users untuk user yang sedang login
            $user = User::find($data['id_user']);
            if ($user) {
                $user->id_warung = $warung->id_warung;
                $user->save();
            } else {
                return response()->json(['error' => 'User tidak ditemukan'], 404);
            }

            return response()->json([
                'message' => 'Toko berhasil ditambahkan!',
                'id_warung' => $warung->id_warung,
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Terjadi kesalahan di server: ' . $e->getMessage()], 500);
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
                'latitude'      => 'nullable|numeric|between:-90,90',
                'longitude'     => 'nullable|numeric|between:-180,180',
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
        // Cek autentikasi user
        $userId = Auth::id();
        if (!$userId) {
            Log::warning('Unauthorized access attempt to complete order', ['request' => $request->all()]);
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        // Validasi request
        $request->validate([
            'id_order' => 'required|integer|exists:orders,id_order',
        ]);

        // Mulai transaksi
        DB::beginTransaction();

        // Ambil order beserta orderItems
        $order = Order::with('orderItems')->findOrFail($request->id_order);

        // Pastikan order milik warung pemilik atau karyawan
        $warung = Warung::where('id_warung', $order->id_warung)
            ->where(function ($query) use ($userId) {
                $query->where('id_user', $userId)
                      ->orWhereHas('karyawans', fn($q) => $q->where('id_user', $userId));
            })
            ->first();

        if (!$warung) {
            Log::warning('Unauthorized attempt to complete order', [
                'id_order' => $order->id_order,
                'user_id' => $userId,
            ]);
            return response()->json(['error' => 'Order not found or unauthorized'], 403);
        }

        // Cek status order
        if ($order->status_order === 'completed') {
            Log::info('Order already completed', ['id_order' => $order->id_order]);
            return response()->json(['message' => 'Order already completed'], 400);
        }
        if ($order->status_order === 'canceled') {
            Log::info('Cannot complete canceled order', ['id_order' => $order->id_order]);
            return response()->json(['message' => 'Cannot complete a canceled order'], 400);
        }

        // Validasi stok untuk setiap order item
        foreach ($order->orderItems as $item) {
            $unggas = Unggas::findOrFail($item->id_unggas);
            if ($unggas->stok < $item->jumlah_kg) {
                Log::error('Insufficient stock for unggas', [
                    'id_unggas' => $item->id_unggas,
                    'stok_kg' => $unggas->stok,
                    'jumlah_kg' => $item->jumlah_kg,
                ]);
                throw new \Exception("Stok unggas {$unggas->jenis_unggas} tidak cukup. Tersedia: {$unggas->stok_kg} kg, diminta: {$item->jumlah_kg} kg");
            }
        }

        // Kurangi stok dan tambah penjualan untuk setiap order item
        foreach ($order->orderItems as $item) {
            $unggas = Unggas::findOrFail($item->id_unggas);
            $unggas->stok -= $item->jumlah_kg;
            $unggas->penjualan += $item->jumlah_kg;
            $unggas->save();
            Log::info('Stock and sales updated for unggas', [
                'id_unggas' => $unggas->id_unggas,
                'stok_kg' => $unggas->stok,
                'penjualan' => $unggas->penjualan,
                'jumlah_kg' => $item->jumlah_kg,
            ]);
        }

        // Ubah status order jadi completed
        $order->status_order = 'completed';
        $order->updated_at = now();
        $order->save();

        // Tambah saldo ke user (pemilik warung)
        $user = User::findOrFail($warung->id_user); // Gunakan id_user dari warung
        $totalHarga = (float) $order->total_harga;
        $user->saldo = ($user->saldo ?? 0) + $totalHarga;
        $user->save();

        // Buat entri di history_payment
        HistoryPayment::create([
            'tanggal_history' => now(),
            'tipe_transaksi' => 'pembayaran',
            'id_user' => $user->id_user,
            'wallet_payment' => $totalHarga,
            'id_order' => $order->id_order,
            'id_payment' => null,
        ]);

        // Commit transaksi
        DB::commit();

        Log::info('Order completed successfully', [
            'id_order' => $order->id_order,
            'user_id' => $userId,
            'total_harga' => $totalHarga,
        ]);

        return response()->json([
            'message' => 'Order completed, stock reduced, sales updated, and saldo added'
        ], 200);

    } catch (\Exception $e) {
        // Rollback transaksi jika gagal
        DB::rollBack();
        Log::error('Failed to complete order', [
            'id_order' => $request->id_order,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);
        return response()->json([
            'error' => 'Terjadi kesalahan di server: ' . $e->getMessage()
        ], 500);
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
    $successfulOrders = Order::where('id_warung', $id_warung)
        ->where('status_order', 'completed')
        ->count();

    $totalUnggas = Unggas::where('id_warung', $id_warung)->count();
    $totalEmployees = User::where('role', 'karyawan')
        ->where('id_warung', $id_warung)
        ->count();

    // Set bahasa Indonesia
    Carbon::setLocale('id');

    // Ambil 7 hari terakhir dari hari ini (mundur)
    $start = Carbon::now()->subDays(6)->startOfDay();
    $end = Carbon::now()->endOfDay();

    // Ambil semua order completed dalam rentang 7 hari terakhir
    $orders = Order::where('id_warung', $id_warung)
        ->where('status_order', 'completed')
        ->whereBetween('updated_at', [$start, $end])
        ->get();

    // Siapkan array harian (Senin–Minggu dengan tanggal)
    $dailyStats = [];

    for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
        $formattedDate = $date->translatedFormat('j F Y'); // Contoh: "20 Mei 2025"
        $dayName = $date->translatedFormat('l'); // "Senin", "Selasa", dst.

        // Hitung pesanan untuk tanggal ini
        $countForDay = $orders->filter(function ($order) use ($date) {
            return Carbon::parse($order->updated_at)->isSameDay($date);
        })->count();

        $dailyStats[] = [
            'day' => $dayName,
            'date' => $formattedDate,
            'order_count' => $countForDay,
        ];
    }

    return response()->json([
        'successful_orders' => $successfulOrders,
        'total_unggas' => $totalUnggas,
        'total_employees' => $totalEmployees,
        'recent_orders_by_day' => $dailyStats,
    ], 200);
}
}