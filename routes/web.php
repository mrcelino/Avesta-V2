<?php

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'show'])->name('login');
    Route::get('/register/{role?}', [RegisterController::class, 'show'])->name('register');
    Route::post('/login', [LoginController::class, 'authenticate']);
    
});

Route::group([], function () {
    Route::get('/', fn () => Inertia::render('Welcome'));
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'));
    Route::get('/contact', fn () => Inertia::render('Guest/Contact'));
    Route::get('/about', fn () => Inertia::render('Guest/About'));
    Route::get('/product', fn () => Inertia::render('Guest/Product'));
});