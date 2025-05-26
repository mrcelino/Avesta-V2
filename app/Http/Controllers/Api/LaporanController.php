<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class LaporanController extends Controller
{
    public function penjualan(Request $request)
    {
        Carbon::setLocale('id');

        $id_warung = $request->user()->id_warung ?? $request->query('id_warung');
        $range = $request->query('range', 'minggu'); // default = minggu

        if (!$id_warung) {
            return response()->json(['message' => 'ID warung tidak ditemukan'], 400);
        }

        switch ($range) {
            case 'tahun':
                return $this->statistikTahunan($id_warung);
            case 'bulan':
                return $this->statistikBulanan($id_warung);
            case 'minggu':
            default:
                return $this->statistikMingguan($id_warung);
        }
    }

    private function statistikMingguan($id_warung)
    {
        $now = Carbon::now();
        $start = $now->copy()->subDays(6)->startOfDay();
        $end = $now->copy()->endOfDay();

        $orders = Order::where('id_warung', $id_warung)
            ->where('status_order', 'completed')
            ->whereBetween('updated_at', [$start, $end])
            ->get();

        $dailyStats = [];

        for ($date = $start->copy(); $date->lte($end); $date->addDay()) {
            $dailyStats[] = [
                'day' => $date->translatedFormat('l'),
                'date' => $date->translatedFormat('j F Y'),
                'order_count' => $orders->filter(fn($order) => Carbon::parse($order->updated_at)->isSameDay($date))->count(),
            ];
        }

        return response()->json($dailyStats);
    }

    private function statistikBulanan($id_warung)
    {
        $now = Carbon::now();
        $start = $now->copy()->subWeeks(3)->startOfWeek();
        $end = $now->copy()->endOfWeek();

        $orders = Order::where('id_warung', $id_warung)
            ->where('status_order', 'completed')
            ->whereBetween('updated_at', [$start, $end])
            ->get();

        $weeklyStats = [];

        for ($week = 0; $week < 4; $week++) {
            $weekStart = $start->copy()->addWeeks($week);
            $weekEnd = $weekStart->copy()->endOfWeek();

            $count = $orders->filter(function ($order) use ($weekStart, $weekEnd) {
                $date = Carbon::parse($order->updated_at);
                return $date->between($weekStart, $weekEnd);
            })->count();

            $weeklyStats[] = [
                'week' => "Minggu ke-" . ($week + 1),
                'start' => $weekStart->translatedFormat('j M'),
                'end' => $weekEnd->translatedFormat('j M'),
                'order_count' => $count,
            ];
        }

        return response()->json($weeklyStats);
    }

    private function statistikTahunan($id_warung)
    {
        $now = Carbon::now();
        $start = $now->copy()->startOfYear();
        $end = $now->copy()->endOfYear();

        $orders = Order::where('id_warung', $id_warung)
            ->where('status_order', 'completed')
            ->whereBetween('updated_at', [$start, $end])
            ->get();

        $monthlyStats = [];

        for ($month = 1; $month <= 12; $month++) {
            $monthStart = Carbon::create($now->year, $month, 1)->startOfMonth();
            $monthEnd = $monthStart->copy()->endOfMonth();

            $count = $orders->filter(function ($order) use ($monthStart, $monthEnd) {
                $date = Carbon::parse($order->updated_at);
                return $date->between($monthStart, $monthEnd);
            })->count();

            $monthlyStats[] = [
                'month' => $monthStart->translatedFormat('F'),
                'order_count' => $count,
            ];
        }

        return response()->json($monthlyStats);
    }

public function kategoriPenjualan(Request $request)
    {
        // Set bahasa Carbon ke Indo
        Carbon::setLocale('id');

        // Ambil id_warung dari user yang login atau dari query parameter
        $id_warung = $request->user()->id_warung ?? $request->query('id_warung');
        if (!$id_warung) {
            return response()->json(['message' => 'ID warung nggak ketemu, bro!'], 400);
        }

        // Tentuin rentang waktu berdasarkan parameter range (default: minggu)
        $range = $request->query('range', 'minggu');
        $startDate = match ($range) {
            'bulan' => Carbon::now()->startOfMonth(),
            'tahun' => Carbon::now()->startOfYear(),
            default => Carbon::now()->startOfWeek(),
        };

        // Query buat ngambil jumlah pesanan per kategori
        $data = DB::table('order_items')
            ->join('orders', 'order_items.id_order', '=', 'orders.id_order')
            ->join('unggas', 'order_items.id_unggas', '=', 'unggas.id_unggas')
            ->select(
                DB::raw("
                    CASE
                        WHEN unggas.jenis_unggas LIKE '%Ayam Utuh%' THEN 'Ayam Utuh'
                        WHEN unggas.jenis_unggas LIKE '%Dada Ayam%' THEN 'Dada'
                        WHEN unggas.jenis_unggas LIKE '%Ceker%' THEN 'Ceker'
                        WHEN unggas.jenis_unggas LIKE '%Fillet%' THEN 'Fillet'
                        WHEN unggas.jenis_unggas LIKE '%Jeroan%' THEN 'Jeroan'
                        ELSE 'Lainnya'
                    END AS kategori
                "),
                DB::raw('COUNT(*) as order_count')
            )
            ->where('orders.id_warung', $id_warung)
            ->where('orders.status_order', 'completed')
            ->whereDate('orders.updated_at', '>=', $startDate)
            ->groupBy('kategori')
            ->orderBy('kategori', 'asc')
            ->get();

        // Kalau nggak ada data, kasih pesan biar nggak kosong
        if ($data->isEmpty()) {
            return response()->json(['message' => 'Nggak ada data buat periode ini, bro!', 'data' => []], 200);
        }

        return response()->json($data);
    }
  }