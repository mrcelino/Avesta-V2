<?php

use App\Http\Controllers\Api\WarungController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rute untuk tamu (hanya bisa diakses jika belum login)
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'show'])->name('login');
    Route::get('/register/{role?}', [RegisterController::class, 'show'])->name('register');
});

Route::group([], function () {
    Route::get('/', fn () => Inertia::render('Welcome'));
    Route::get('/contact', fn () => Inertia::render('Guest/Contact'));
    Route::get('/about', fn () => Inertia::render('Guest/About'));
    Route::get('/product', fn () => Inertia::render('Guest/Product'));
    // Route::get('/wallet', fn () => Inertia::render('Buyer/Wallet'));
    // Route::get('/dashboard', fn () => Inertia::render('Buyer/Dashboard'));
    // Route::get('/cariayam', fn () => Inertia::render('Buyer/CariAyam'));
    // Route::get('/checkout', fn () => Inertia::render('Buyer/Checkout'));
    // Route::get('/payment', fn () => Inertia::render('Buyer/Payment'));
    // Route::get('/paymentconfirm', fn () => Inertia::render('Buyer/PaymentConfirm'));
    // Route::get('/tes', fn () => Inertia::render('Buyer/Tes'));
    // Route::get('/withdraw', fn () => Inertia::render('Buyer/Withdraw'));
    // Route::get('/topup', fn () => Inertia::render('Buyer/Topup'));
    // Route::get('/warungs/{id}', [WarungController::class, 'page'])->name('warungs.show');
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/wallet', fn () => Inertia::render('Buyer/Wallet'));
    Route::get('/dashboard', fn () => Inertia::render('Buyer/Dashboard'));
    Route::get('/cariayam', fn () => Inertia::render('Buyer/CariAyam'));
    Route::get('/checkout', fn () => Inertia::render('Buyer/Checkout'));
    Route::get('/payment', fn () => Inertia::render('Buyer/Payment'));
    Route::get('/paymentconfirm', fn () => Inertia::render('Buyer/PaymentConfirm'));
    Route::get('/tes', fn () => Inertia::render('Buyer/Tes'));
    Route::get('/withdraw', fn () => Inertia::render('Buyer/Withdraw'));
    Route::get('/topup', fn () => Inertia::render('Buyer/Topup'));
    Route::get('/warungs/{id}', [WarungController::class, 'page'])->name('warungs.show');
    Route::get('/purchasehistory', fn() => Inertia::render('Buyer/PurchaseHistory'));
});