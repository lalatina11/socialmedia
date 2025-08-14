<?php

use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\V2\AuthController;
use \Illuminate\Http\Request;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/auth/login', [AuthController::class, 'showLogin'])->name('login');
Route::get('/auth/register', [AuthController::class, 'showRegister'])->name('register');

Route::get('/feed', function () {
    $currentUser = (new AuthController())->getUserForServer();
    if(!$currentUser) {
        return redirect()->route('login');
    }
    $posts = (new PostController())->index();
    return Inertia::render('feed', [
        'posts' => $posts,
        'currentUser' => $currentUser,
    ]);
})->name('feed');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
