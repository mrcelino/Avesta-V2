<?php

use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UserCheckController;
use App\Http\Controllers\Api\WarungController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\KaryawanController; 


Route::prefix('auth')->group(function () {
    Route::post('/login', [LoginController::class, 'apiLogin']);
    Route::post('/register', [RegisterController::class, 'apiRegister']);
});

Route::middleware('auth:sanctum')->post('/logout', [LoginController::class, 'apiLogout']);
Route::middleware('auth:sanctum')->get('/me', [UserCheckController::class, 'me']);

Route::middleware('auth:sanctum')->post('/karyawan', [KaryawanController::class, 'store']);

Route::get('/unggas', [ProductController::class, 'index']);
Route::get('/warungs', [WarungController::class, 'all']);
Route::get('/warungs/kelurahan', [WarungController::class, 'getKelurahan']);
Route::get('/warungs/{id}', [WarungController::class, 'show']);

// Route::middleware('auth:sanctum')->post('/user/update-profile', [UserController::class, 'updateProfile']);
Route::put('/user/{id_user}', [UserController::class, 'updateProfile']);