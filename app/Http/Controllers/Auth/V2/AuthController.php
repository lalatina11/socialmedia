<?php

namespace App\Http\Controllers\Auth\V2;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function showLogin(): \Inertia\Response
    {
        return Inertia::render('auth/login');
    }

    public function showRegister(): \Inertia\Response
    {
        return Inertia::render('auth/register');
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'username'=>'string|min:4|max:32|unique:users',
            'email'=>'string|email|unique:users',
            'password'=>'string|min:8|regex:/^.*(?=.{3,})(?=.*[a-zA-Z])(?=.*[0-9]).*$/u|confirmed',
        ]);

        dd($validated);
    }

}
