<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Unggas;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $sortBy = $request->query('sortBy', 'asc');
        $query = $request->query('q', '');
        $kelurahan = $request->query('kelurahan', '');
        $perPage = 12;

        $productsQuery = Unggas::with('warung');

        if ($query) {
            $productsQuery->where('jenis_unggas', 'like', '%' . $query . '%');
        }

        

        if ($kelurahan && $kelurahan !== 'Semua') {
            $productsQuery->whereHas('warung', function ($q) use ($kelurahan) {
                $q->where('kelurahan', $kelurahan);
            });
        }


        switch ($sortBy) {
            case 'terbaru':
                $productsQuery->orderBy('created_at', 'desc');
                break;
            case 'terlaris':
                $productsQuery->orderBy('penjualan', 'desc');
                break;
            case 'asc':
                $productsQuery->orderBy('harga_per_kg', 'asc');
                break;
            case 'desc':
                $productsQuery->orderBy('harga_per_kg', 'desc');
                break;
            default:
                $productsQuery->orderBy('harga_per_kg', 'asc');
                break;
        }

        $products = $productsQuery->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $products
        ]);
    }
}