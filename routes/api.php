<?php

use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserCheckController;

Route::prefix('auth')->group(function () {
    Route::post('/login', [LoginController::class, 'apiLogin']);
    Route::post('/register', [RegisterController::class, 'apiRegister']);
});

Route::middleware('auth:sanctum')->post('/logout', [LoginController::class, 'apiLogout']);
Route::middleware('auth:sanctum')->get('/me', [UserCheckController::class, 'me']);

Route::get('/unggas', [ProductController::class, 'index']);