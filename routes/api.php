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
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);
// Grouping route yang butuh session
Route::middleware(['web'])->group(function () { // Tambah 'web' middleware
    Route::prefix('auth')->group(function () {
        Route::post('/login', [LoginController::class, 'apiLogin']);
        Route::post('/register', [RegisterController::class, 'apiRegister']); 
    });
    Route::middleware('auth:sanctum')->post('/logout', [LoginController::class, 'apiLogout']);
    Route::middleware('auth:sanctum')->get('/me', [UserCheckController::class, 'me']);
    Route::middleware('auth:sanctum')->get('/history', [HistoryPaymentController::class, 'index']);
    Route::middleware('auth:sanctum')->post('/topup', [TopupController::class, 'store']);
    Route::middleware('auth:sanctum')->post('/withdraw', [WithdrawController::class, 'store']);
    
});

Route::get('/unggas', [ProductController::class, 'index']);
Route::get('/warungs', [WarungController::class, 'all']);
Route::get('/warungs/kelurahan', [WarungController::class, 'getKelurahan']);
Route::get('/warungs/{id}', [WarungController::class, 'show']);