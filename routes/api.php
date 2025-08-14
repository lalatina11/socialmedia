<?php

use App\Http\Controllers\Auth\V2\AuthController;
use App\Http\Controllers\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    dd($request->auth()->user());
})->middleware('auth:sanctum');
// Route::middleware('auth')->group(function () {
Route::post('/posts', [PostController::class, 'store'])->name('posts');
Route::get('/posts', function () {
    dd(Auth::user());
});

Route::post('/v2/auth/register', [AuthController::class, 'register'])->name('auth.register');
Route::post('/v2/auth/login', [AuthController::class, 'login'])->name('auth.login');
Route::get('/v2/auth/current-user', [AuthController::class, 'getUserForClient'])->name('auth.get-user-for-client');
// });
