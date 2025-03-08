<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserCheckController extends Controller
{
    public function me(Request $request)
{
    return response()->json([
        'user' => $request->user()
    ]);
}
}