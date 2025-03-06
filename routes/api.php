<?php

use App\Http\Controllers\Auth\RegisterController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;


Route::prefix('auth')->group(function () {
    Route::post('/login', [LoginController::class, 'apiLogin']);
    Route::post('/register', [RegisterController::class, 'apiRegister']);
});