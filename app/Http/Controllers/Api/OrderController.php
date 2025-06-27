<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\Unggas;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    // POST BUAT ORDER
    public function store(Request $request)
    {
        // Pastikan user sudah login
        if (!Auth::check()) {
            Log::warning('Unauthorized access attempt to create order', ['request' => $request->all()]);
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: User not authenticated',
            ], 401);
        }

        // Validasi request
        try {
            $validated = $request->validate([
                'id_user' => 'required|exists:users,id_user',
                'id_warung' => 'required|exists:warung,id_warung',
                'tanggal_order' => 'required|date',
                'total_harga' => 'required|numeric|min:0',
                'status_order' => 'required|in:processed,completed,canceled',
                'order_items' => 'required|array|min:1',
                'order_items.*.id_unggas' => 'required|exists:unggas,id_unggas',
                'order_items.*.jumlah_kg' => 'required|numeric|min:0',
                'order_items.*.harga_total_per_item' => 'required|numeric|min:0',
                'order_items.*.catatan' => 'nullable|string|max:255',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed for create order', [
                'errors' => $e->errors(),
                'request' => $request->all(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        // Pastikan id_user dari request sama dengan user yang login
        if ($validated['id_user'] != Auth::id()) {
            Log::warning('ID user mismatch', [
                'id_user_request' => $validated['id_user'],
                'authenticated_user' => Auth::id(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: ID user does not match authenticated user',
            ], 403);
        }

        try {
            // Mulai transaksi
            DB::beginTransaction();

            // Ambil user untuk cek dan update saldo
            $user = User::findOrFail($validated['id_user']);
            if ($user->saldo < $validated['total_harga']) {
                Log::info('Insufficient saldo', [
                    'user_id' => $user->id_user,
                    'saldo' => $user->saldo,
                    'total_harga' => $validated['total_harga'],
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Saldo tidak cukup',
                ], 400);
            }

            // Buat order
            $order = new Order();
            $order->id_user = $validated['id_user'];
            $order->id_warung = $validated['id_warung'];
            $order->tanggal_order = $validated['tanggal_order'];
            $order->total_harga = $validated['total_harga'];
            $order->status_order = $validated['status_order'];
            $order->save();

            // Buat order items
            foreach ($validated['order_items'] as $index => $item) {
                // Ambil harga_per_kg dari tabel unggas
                $unggas = Unggas::find($item['id_unggas']);
                if (!$unggas) {
                    Log::error('Unggas not found', [
                        'id_unggas' => $item['id_unggas'],
                        'item_index' => $index,
                    ]);
                    throw new \Exception("Unggas with id {$item['id_unggas']} not found");
                }
                $hargaPerKg = $unggas->harga_per_kg;
                if (is_null($hargaPerKg)) {
                    Log::error('Harga per kg not set for unggas', [
                        'id_unggas' => $item['id_unggas'],
                        'item_index' => $index,
                    ]);
                    throw new \Exception("Harga per kg not set for unggas with id {$item['id_unggas']}");
                }

                $orderItem = new OrderItem();
                $orderItem->id_order = $order->id_order;
                $orderItem->id_unggas = $item['id_unggas'];
                $orderItem->jumlah_kg = $item['jumlah_kg'];
                $orderItem->harga_total_per_item = $item['harga_total_per_item'];
                $orderItem->catatan = $item['catatan'] ?? '';
                $orderItem->save();
            }

            // Update saldo user
            $user->saldo -= $validated['total_harga'];
            $user->save();

            // Commit transaksi
            DB::commit();
            
            // Load relasi payment untuk ambil id_payment
            $order->load('payment');
             
            Log::info('Order created successfully', [
                'id_order' => $order->id_order,
                'user_id' => $user->id_user,
                'id_payment' => $order->payment ? $order->payment->id_payment : null,
            ]);

            return response()->json([
                'success' => true,
                'id_order' => $order->id_order,
                'id_payment' => $order->payment ? $order->payment->id_payment : null, // Tambah id_payment di response
                'id_user' => $order->id_user,
                'wallet_payment' => $order->total_harga,
                'message' => 'Order and items created successfully',
            ], 201);

        } catch (\Exception $e) {
            // Rollback transaksi kalo gagal
            DB::rollBack();
            Log::error('Failed to create order', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage(),
            ], 500);
        }
    }

    // GET SEMUA ORDER
    public function index(Request $request)
    {
        // Pastikan user sudah login
        if (!Auth::check()) {
            Log::warning('Unauthorized access attempt to fetch orders', ['request' => $request->all()]);
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: User not authenticated',
            ], 401);
        }

        try {
            // Ambil user yang login
            $userId = Auth::id();

            // Ambil semua order user beserta order_items, unggas, dan warung
            $orders = Order::with(['orderItems', 'orderItems.unggas', 'warung', 'payment'])
                ->where('id_user', $userId)
                ->get();

            Log::info('Orders fetched successfully', [
                'user_id' => $userId,
                'order_count' => $orders->count(),
            ]);

            return response()->json([
                'success' => true,
                'data' => $orders->map(function ($order) {
                    return [
                        'id_order' => $order->id_order,
                        'id_user' => $order->id_user,
                        'id_warung' => $order->id_warung,
                        'id_payment' => $order->payment ? $order->payment->id_payment : null, // Tambah id_payment
                        'nama_warung' => $order->warung ? $order->warung->nama_warung : null,
                        'alamat_warung' => $order->warung ? $order->warung->alamat_warung : null,
                        'tanggal_order' => $order->tanggal_order,
                        'created_at' => $order->created_at,
                        'total_harga' => $order->total_harga,
                        'status_order' => $order->status_order,
                        'order_items' => $order->orderItems->map(function ($item) {
                            return [
                                'id_order_item' => $item->id_order_item,
                                'id_order' => $item->id_order,
                                'id_unggas' => $item->id_unggas,
                                'jenis_unggas' => $item->unggas ? $item->unggas->jenis_unggas : null,
                                'jumlah_kg' => $item->jumlah_kg,
                                'harga_per_kg' => $item->unggas ? $item->unggas->harga_per_kg : null,
                                'harga_total_per_item' => $item->harga_total_per_item,
                                'foto_unggas' => $item->unggas ? $item->unggas->foto_unggas : null, // Tambah foto_unggas
                                'catatan' => $item->catatan,
                            ];
                        }),
                    ];
                }),
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to fetch orders', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch orders: ' . $e->getMessage(),
            ], 500);
        }
    }

    // GET SPESIFIC ORDER
    public function show(Request $request, $id_order)
    {
        // Pastikan user sudah login
        if (!Auth::check()) {
            Log::warning('Unauthorized access attempt to fetch order', [
                'id_order' => $id_order,
                'request' => $request->all(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized: User not authenticated',
            ], 401);
        }

        try {
            // Ambil user yang login
            $userId = Auth::id();

            // Ambil order berdasarkan id_order beserta order_items, unggas, dan warung
            $order = Order::with(['orderItems', 'orderItems.unggas', 'warung'])
                ->where('id_user', $userId)
                ->where('id_order', $id_order)
                ->first();

            // Kalo order gak ditemukan atau bukan milik user
            if (!$order) {
                Log::warning('Order not found or unauthorized access', [
                    'id_order' => $id_order,
                    'user_id' => $userId,
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found or you do not have access to this order',
                ], 404);
            }

            Log::info('Order fetched successfully', [
                'id_order' => $order->id_order,
                'user_id' => $userId,
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'id_order' => $order->id_order,
                    'id_user' => $order->id_user,
                    'id_warung' => $order->id_warung,
                    'nama_warung' => $order->warung ? $order->warung->nama_warung : null,
                    'tanggal_order' => $order->tanggal_order,
                    'total_harga' => $order->total_harga,
                    'status_order' => $order->status_order,
                    'order_items' => $order->orderItems->map(function ($item) {
                        return [
                            'id_order_item' => $item->id_order_item,
                            'id_order' => $item->id_order,
                            'id_unggas' => $item->id_unggas,
                            'jenis_unggas' => $item->unggas ? $item->unggas->jenis_unggas : null,
                            'jumlah_kg' => $item->jumlah_kg,
                            'harga_per_kg' => $item->unggas ? $item->unggas->harga_per_kg : null,
                            'harga_total_per_item' => $item->harga_total_per_item,
                            'foto_unggas' => $item->unggas ? $item->unggas->foto_unggas : null, // Tambah foto_unggas
                            'catatan' => $item->catatan,
                        ];
                    }),
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Failed to fetch order', [
                'id_order' => $id_order,
                'error' => $e->getMessage(),
                'request' => $request->all(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch order: ' . $e->getMessage(),
            ], 500);
        }
    }


    public function cancelOrder(Request $request, $id)
    {
        try {
            $order = Order::findOrFail($id);

            // Cek kalo status order bukan 'processed'
            if ($order->status_order !== 'processed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Hanya order dengan status processed yang bisa dibatalkan',
                ], 400);
            }

            // Update status order jadi canceled
            $order->status_order = 'canceled';
            // $order->cancel_reason = $request->input('cancel_reason');
            $order->save();

            // Update saldo user (tambah sesuai total_harga)
            $user = User::findOrFail($order->id_user);
            $user->saldo += $order->total_harga; // Tambah saldo
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Order berhasil dibatalkan dan saldo telah dikembalikan',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membatalkan order: ' . $e->getMessage(),
            ], 500);
        }
    }
    // GET STATUS ORDER (BUAT PICKUP)
    public function confirmOrder($id_order)
    {
        try {
            // Ambil order berdasarkan id_order, pastikan milik user yang login
            $order = Order::where('id_order', $id_order)
                ->where('id_user', Auth::id())
                ->first();

            if (!$order) {
                return response()->json([
                    'success' => false,
                    'message' => 'Order not found or unauthorized',
                ], 404);
            }

            // Kembalikan status order
            return response()->json([
                'success' => true,
                'status_order' => $order->status_order,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching order status: ' . $e->getMessage(),
            ], 500);
        }
    }
}