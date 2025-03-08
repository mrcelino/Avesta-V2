<?php

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
    Route::get('/dashboard', fn () => Inertia::render('Buyer/Dashboard'));
    Route::get('/cariayam', fn () => Inertia::render('Buyer/CariAyam'));
    Route::get('/tes', fn () => Inertia::render('Buyer/Tes'));
});