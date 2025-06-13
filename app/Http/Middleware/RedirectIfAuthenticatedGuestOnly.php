<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticatedGuestOnly
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            $user = Auth::user();

            return match ($user->role) {
                'user' => redirect('/dashboard'),
                'pemilik', 'karyawan' => redirect('/mitra'),
                default => redirect('/'),
            };
        }

        return $next($request);
    }
}