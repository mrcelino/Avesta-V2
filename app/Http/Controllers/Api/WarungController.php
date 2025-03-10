<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Warung;
use Inertia\Inertia;
use Illuminate\Http\Request;

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
}