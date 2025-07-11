<?php

use App\Http\Controllers\Api\WarungController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Middleware\RedirectIfAuthenticatedGuestOnly;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rute untuk tamu (hanya bisa diakses jika belum login)
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'show'])->name('login');
    Route::get('/register/{role?}', [RegisterController::class, 'show'])->name('register');
});

Route::middleware(RedirectIfAuthenticatedGuestOnly::class)->group(function () {
    Route::get('/', fn () => Inertia::render('Welcome'));
    Route::get('/contact', fn () => Inertia::render('Guest/Contact'));
    Route::get('/about', fn () => Inertia::render('Guest/About'));
    Route::get('/product', fn () => Inertia::render('Guest/Product'));
});

Route::group([], function () {
    Route::get('/forgotpassword', fn () => Inertia::render('Guest/ForgotPassword'));
    Route::get('/mitra', fn () => Inertia::render('Guest-Mitra/Home'));
    Route::get('/mitra/about', fn () => Inertia::render('Guest-Mitra/About'));
    Route::get('/mitra/contact', fn () => Inertia::render('Guest-Mitra/Contact'));
});

// Rute untuk Dashboard-Mitra (hanya untuk role pemilik)
Route::middleware(['auth:sanctum', 'App\Http\Middleware\RoleMiddleware:pemilik'])->group(function () {
    Route::get('/admin', fn () => Inertia::render('Dashboard-Mitra/Dashboard'));
    Route::get('/admin/data', fn () => Inertia::render('Dashboard-Mitra/Data'));
    Route::get('/admin/karyawan', fn () => Inertia::render('Dashboard-Mitra/Karyawan'));
    Route::get('/admin/tambah-karyawan', fn () => Inertia::render('Dashboard-Mitra/Karyawan-Tambah'));
    Route::get('/admin/edit-karyawan/{id_user}', fn ($id_user) => Inertia::render('Dashboard-Mitra/Karyawan-Edit', [
        'id_user' => (int) $id_user,
    ]));
    Route::get('/admin/pesanan', fn () => Inertia::render('Dashboard-Mitra/Pesanan'));
    Route::get('/admin/produk', fn () => Inertia::render('Dashboard-Mitra/Produk'));
    Route::get('/admin/tambah-produk', fn () => Inertia::render('Dashboard-Mitra/Produk-Tambah'));
    Route::get('/admin/edit-produk/{id_unggas}', fn ($id_unggas) => Inertia::render('Dashboard-Mitra/Produk-Edit', [
        'id_unggas' => (int) $id_unggas,
    ]));
    Route::get('/admin/toko', fn () => Inertia::render('Dashboard-Mitra/Toko'));
    Route::get('/admin/tambah-toko', fn () => Inertia::render('Dashboard-Mitra/Toko-Tambah'));
    Route::get('/admin/edit-toko/{id_warung}', fn ($id_warung) => Inertia::render('Dashboard-Mitra/Toko-Edit', [
        'id_warung' => (int) $id_warung,
    ]));
    Route::get('/admin/wallet', fn () => Inertia::render('Dashboard-Mitra/Admin-Wallet'));
    Route::get('/admin/withdraw', fn () => Inertia::render('Dashboard-Mitra/Admin-Withdraw'));
});

Route::middleware(['auth:sanctum', 'App\Http\Middleware\RoleMiddleware:karyawan, pemilik'])->group(function () {
    Route::get('/admin', fn () => Inertia::render('Dashboard-Mitra/Dashboard'));
    Route::get('/admin/produk', fn () => Inertia::render('Dashboard-Mitra/Produk'));
    Route::get('/admin/tambah-produk', fn () => Inertia::render('Dashboard-Mitra/Produk-Tambah'));
    Route::get('/admin/edit-produk/{id_unggas}', fn ($id_unggas) => Inertia::render('Dashboard-Mitra/Produk-Edit', [
        'id_unggas' => (int) $id_unggas,
    ]));
    Route::get('/admin/pesanan', fn () => Inertia::render('Dashboard-Mitra/Pesanan'));
});

// Rute untuk Buyer (hanya untuk role user)
Route::middleware(['auth:sanctum', 'App\Http\Middleware\RoleMiddleware:user'])->group(function () {
    Route::get('/wallet', fn () => Inertia::render('Buyer/Wallet'));
    Route::get('/dashboard', fn () => Inertia::render('Buyer/Dashboard'));
    Route::get('/cariayam', fn () => Inertia::render('Buyer/CariAyam'));
    Route::get('/settings', fn () => Inertia::render('Buyer/Settings'));
    Route::get('/checkout', fn () => Inertia::render('Buyer/Checkout'));
    Route::get('/payment', fn () => Inertia::render('Buyer/Payment'));
    Route::get('/paymentconfirm', fn () => Inertia::render('Buyer/PaymentConfirm'));
    Route::get('/tes', fn () => Inertia::render('Buyer/Tes'));
    Route::get('/withdraw', fn () => Inertia::render('Buyer/Withdraw'));
    Route::get('/topup', fn () => Inertia::render('Buyer/Topup'));
    Route::get('/warungs/{id}', [WarungController::class, 'page'])->name('warungs.show');
    Route::get('/purchasehistory', fn() => Inertia::render('Buyer/PurchaseHistory'));
    Route::get('/pickup', fn () => Inertia::render('Buyer/Pickup'));
});


Route::fallback(function () {
    return Inertia::render('404');  // nama komponen React kamu di resources/js/Pages/404.tsx
});