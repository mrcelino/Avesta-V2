<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$allowedRoles)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login');
        }

        $allowedRoles = array_map('trim', $allowedRoles);

        if (!in_array($user->role, $allowedRoles)) {
            // Redirect ke halaman 404 via Inertia
            return Inertia::render('403')->toResponse($request)->setStatusCode(403);
        }

        return $next($request);
    }
}