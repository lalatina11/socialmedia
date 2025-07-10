<?php

use App\Http\Controllers\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return dd($request->user());
})->middleware('auth:sanctum');
// Route::middleware('auth')->group(function () {
Route::post('/posts', [PostController::class, 'store'])->name('posts');
Route::get('/posts', function () {
    dd(Auth::user());
});
// });
