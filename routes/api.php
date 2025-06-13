<?php

use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;

use App\Http\Controllers\Api\UserCheckController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\WarungController;
use App\Http\Controllers\Api\TopupController;
use App\Http\Controllers\Api\WithdrawController;
use App\Http\Controllers\Api\HistoryPaymentController;
use App\Http\Controllers\Api\VerifyPasswordController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\KaryawanController;
use App\Http\Controllers\Api\LaporanController;

// Ambil CSRF cookie (untuk Sanctum di Inertia)
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

// Public routes untuk auth & reset password
Route::middleware(['web'])->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/login', [LoginController::class, 'apiLogin']);
        Route::post('/register', [RegisterController::class, 'apiRegister']);
    });

    Route::post('/forgot-password', [ResetPasswordController::class, 'sendToken']);
    Route::post('/verify-token', [ResetPasswordController::class, 'verifyToken']);
    Route::post('/reset-password', [ResetPasswordController::class, 'resetPassword']);
});

// Semua route lain butuh auth:sanctum
Route::middleware(['web', 'auth:sanctum'])->group(function () {
    // Authenticated session
    Route::post('/logout', [LoginController::class, 'apiLogout']);
    Route::get('/me', [UserCheckController::class, 'me']);

    // User
    Route::post('/settings/{id_user}', [UserController::class, 'updateProfile']);

    // Produk (Unggas)
    Route::get('/unggas', [ProductController::class, 'index']);
    Route::get('/unggas/{id}', [ProductController::class, 'show']);
    Route::post('/tambah-unggas', [ProductController::class, 'store']);
    Route::delete('/unggas/{id}', [ProductController::class, 'destroy']);
    Route::post('/update-produk/{id}', [ProductController::class, 'update']);

    // Warung (Toko)
    Route::get('/warungs', [WarungController::class, 'all']);
    Route::get('/warungs/kelurahan', [WarungController::class, 'getKelurahan']);
    Route::get('/warungs/{id}', [WarungController::class, 'show']);
    Route::get('/toko', [WarungController::class, 'getuserTokoUnggas']);
    Route::get('/toko/pesanan', [WarungController::class, 'getWarungwithOrders']);
    Route::post('/toko/pesanan/complete', [WarungController::class, 'completeOrder']);
    Route::post('/tambah-toko', [WarungController::class, 'store']);
    Route::delete('/toko/{id}', [WarungController::class, 'destroy']);
    Route::post('/update-toko/{id}', [WarungController::class, 'update']);
    Route::get('/warung-stats/{id_warung}', [WarungController::class, 'getStats']);

    // Order
    Route::post('/create-order', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id_order}', [OrderController::class, 'show']);
    Route::patch('/orders/{id}/cancel', [OrderController::class, 'cancelOrder']);
    Route::get('/order-status/{id}', [OrderController::class, 'confirmOrder']);

    // Transaksi
    Route::post('/topup', [TopupController::class, 'store']);
    Route::post('/withdraw', [WithdrawController::class, 'store']);
    Route::get('/history', [HistoryPaymentController::class, 'index']);
    Route::post('/history', [HistoryPaymentController::class, 'store']);
    Route::post('/verify-password', [VerifyPasswordController::class, 'verify']);

    // Karyawan
    Route::post('/karyawan', [KaryawanController::class, 'store']);
    Route::post('/karyawan/{id}', [KaryawanController::class, 'update']);
    Route::delete('/karyawan/{id}', [KaryawanController::class, 'destroy']);
    Route::get('/karyawan/{id}', [KaryawanController::class, 'show']);
    Route::get('/karyawan/warung/{id_warung}', [KaryawanController::class, 'getByWarung']);

    // Laporan
    Route::get('/laporan-penjualan', [LaporanController::class, 'penjualan']);
    Route::get('/laporan-kategori', [LaporanController::class, 'kategoriPenjualan']);
});