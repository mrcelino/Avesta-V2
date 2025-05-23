<?php

use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserCheckController;
use App\Http\Controllers\Api\WarungController;
use App\Http\Controllers\Api\TopupController;
use App\Http\Controllers\Api\WithdrawController;
use App\Http\Controllers\Api\HistoryPaymentController;
use App\Http\Controllers\Api\VerifyPasswordController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Api\KaryawanController; 
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);
// Grouping route yang butuh session
Route::middleware(['web'])->group(function () { // Tambah 'web' middleware
    Route::prefix('auth')->group(function () {
        Route::post('/login', [LoginController::class, 'apiLogin']);
        Route::post('/register', [RegisterController::class, 'apiRegister']); 
    });
    Route::post('/forgot-password', [ResetPasswordController::class, 'sendToken']);
    Route::post('/verify-token', [ResetPasswordController::class, 'verifyToken']);
    Route::post('/reset-password', [ResetPasswordController::class, 'resetPassword']);
    Route::middleware('auth:sanctum')->post('/logout', [LoginController::class, 'apiLogout']);
    Route::middleware('auth:sanctum')->get('/me', [UserCheckController::class, 'me']);
    Route::middleware('auth:sanctum')->get('/history', [HistoryPaymentController::class, 'index']);
    Route::middleware('auth:sanctum')->post('/topup', [TopupController::class, 'store']);
    Route::middleware('auth:sanctum')->post('/withdraw', [WithdrawController::class, 'store']);
    Route::middleware('auth:sanctum')->post('/verify-password', [VerifyPasswordController::class, 'verify']);
    Route::post('/create-order', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id_order}', [OrderController::class, 'show']); // Ambil order spesifik
    Route::patch('/orders/{id}/cancel', [OrderController::class, 'cancelOrder']);
    Route::middleware('auth:sanctum')->post('/history', [HistoryPaymentController::class, 'store']);

    // Karyawan
    Route::middleware('auth:sanctum')->post('/karyawan', [KaryawanController::class, 'store']);
    Route::middleware('auth:sanctum')->post('/karyawan/{id}', [KaryawanController::class, 'update']);
    Route::middleware('auth:sanctum')->delete('/karyawan/{id}', [KaryawanController::class, 'destroy']);
    Route::middleware('auth:sanctum')->get('/karyawan/warung/{id_warung}', [KaryawanController::class, 'getByWarung']);
    Route::middleware('auth:sanctum')->get('/karyawan/{id}', [KaryawanController::class, 'show']);
    
    // Admin - Toko
    Route::middleware('auth:sanctum')->get('/toko', [WarungController::class, 'getuserTokoUnggas']);
    Route::middleware('auth:sanctum')->get('/toko/pesanan', [WarungController::class, 'getWarungwithOrders']);
    Route::middleware('auth:sanctum')->post('/toko/pesanan/complete', [WarungController::class, 'completeOrder']);
    Route::middleware('auth:sanctum')->post('/tambah-toko', [WarungController::class, 'store']);
    Route::middleware('auth:sanctum')->delete('/toko/{id}', [WarungController::class, 'destroy']);
    Route::middleware('auth:sanctum')->post('/update-toko/{id}', [WarungController::class, 'update']);
    Route::middleware('auth:sanctum')->post('/update-produk/{id}', [ProductController::class, 'update']);
    Route::middleware('auth:sanctum')->get('/warung-stats/{id_warung}', [WarungController::class, 'getStats']);
});

Route::get('/unggas', [ProductController::class, 'index']);
Route::get('/unggas/{id}', [ProductController::class, 'show']);
Route::delete('/unggas/{id}', [ProductController::class, 'destroy']);
Route::post('/tambah-unggas', [ProductController::class, 'store']);
Route::get('/warungs', [WarungController::class, 'all']);
Route::get('/warungs/kelurahan', [WarungController::class, 'getKelurahan']);
Route::get('/warungs/{id}', [WarungController::class, 'show']);