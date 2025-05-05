<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Unggas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
class ProductController extends Controller
{
    // GET UNGGAS (USER)
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

    // POST UNGGAS
    public function store(Request $request)
    {
        try {
            // Validasi input
            $validated = $request->validate([
                'jenis_unggas' => 'required|string|max:255',
                'deskripsi' => 'nullable|string',
                'harga_per_kg' => 'required|numeric|min:0',
                'stok' => 'required|integer|min:0',
                'foto_unggas' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10000',
                'id_warung' => 'required|exists:warung,id_warung',
            ]);

            // Log data yang diterima
            Log::info('Validated data:', $validated);

            $unggas = new Unggas();
            $unggas->jenis_unggas = $validated['jenis_unggas'];
            $unggas->deskripsi = $validated['deskripsi'];
            $unggas->harga_per_kg = $validated['harga_per_kg'];
            $unggas->stok = $validated['stok'];
            $unggas->penjualan = 0;
            $unggas->id_warung = $validated['id_warung'];

            if ($request->hasFile('foto_unggas')) {
                $path = $request->file('foto_unggas')->store('uploads/fotos', 'public');
                $unggas->foto_unggas = $path;
                Log::info('Foto uploaded to:', ['path' => $path]);
            }

            $unggas->save();
            Log::info('Unggas saved successfully:', ['id' => $unggas->id_unggas]);

            return response()->json(['message' => 'Unggas added successfully'], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Kalo validasi gagal
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Log error untuk debug
            Log::error('Error in store unggas:', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['message' => 'Failed to add unggas'], 500);
        }
    }
    // GET UNGGAS BY ID
    public function show($id)
    {
        // Ambil data unggas berdasarkan id_unggas
        $unggas = Unggas::findOrFail($id);

        return response()->json($unggas);
    }

    // UPDATE UNGGAS
    public function update(Request $request, $id)
    {
        // Validasi input
        $validated = $request->validate([
            'jenis_unggas' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'harga_per_kg' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
            'foto_unggas' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        // Ambil data unggas
        $unggas = Unggas::findOrFail($id);

        // Update data
        $unggas->jenis_unggas = $validated['jenis_unggas'];
        $unggas->deskripsi = $validated['deskripsi'];
        $unggas->harga_per_kg = $validated['harga_per_kg'];
        $unggas->stok = $validated['stok'];

        // Handle upload foto kalo ada
        if ($request->hasFile('foto_unggas')) {
            // Hapus foto lama kalo ada
            if ($unggas->foto_unggas) {
                Storage::disk('public')->delete($unggas->foto_unggas);
            }
            // Simpan foto baru
            $path = $request->file('foto_unggas')->store('uploads/fotos', 'public');
            $unggas->foto_unggas = $path;
        }

        $unggas->save();

        return response()->json(['message' => 'Unggas updated successfully']);
    }

    // DELETE UNGGAS
    public function destroy($id)
    {
        $unggas = Unggas::findOrFail($id);

        // Hapus foto dari storage jika ada
        if ($unggas->foto_unggas) {
            Storage::disk('public')->delete($unggas->foto_unggas);
        }

        // Hapus data unggas dari database
        $unggas->delete();

        return response()->json(['message' => 'Unggas deleted successfully'], 200);
    }
}