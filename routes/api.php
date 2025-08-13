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

Route::post('/auth/register', [AuthController::class, 'register'])->name('auth.register');
// });
