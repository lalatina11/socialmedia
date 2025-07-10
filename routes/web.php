<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('dashboard', function () {
    //     return Inertia::render('dashboard');
    // })->name('dashboard');
    Route::get('/feed', function () {
        $posts = (new PostController())->index();
        $userId = Auth::guard('sanctum')->id();
        return Inertia::render('feed', [
            'posts' => $posts,
            'userId' => $userId
        ]);
    })->name('feed');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
