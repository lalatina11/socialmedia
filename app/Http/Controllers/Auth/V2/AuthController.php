<?php

namespace App\Http\Controllers\Auth\V2;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Hash;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    protected function secretKey()
    {
        return config('app.jwt_secret');
    }

    protected function guestGuard()
    {
        return !!(new AuthController())->getUserForServer();
    }

    /**
     * Display a listing of the resource.
     */
    public function showLogin(): \Inertia\Response|\Illuminate\Http\RedirectResponse
    {
        if ($this->guestGuard()) {
            return redirect()->route('feed');
        }
        return Inertia::render('auth/login');
    }

    public function showRegister(): \Inertia\Response|\Illuminate\Http\RedirectResponse
    {
        if ($this->guestGuard()) {
            return redirect()->route('feed');
        }
        return Inertia::render('auth/register');
    }

    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'username' => 'string|min:4|max:32|unique:users',
                'email' => 'string|email|unique:users',
                'password' => 'string|min:8|regex:/^.*(?=.{3,})(?=.*[a-zA-Z])(?=.*[0-9]).*$/u|confirmed',
            ]);
            $user = User::create($validated);
            $token = $user->createToken('user_token')->plainTextToken;
            $jwtToken = JWT::encode([
                'iss' => 'lumen-jwt',
                'sub' => $token,
                'iat' => time(),
                'exp' => time() + (60 * 60 * 24 * 5),
            ], $this->secretKey(), 'HS256');
            $response = [
                'error' => false,
                'message' => 'success',
                'jwtToken' => $jwtToken,
                'plainTextToken' => $token
            ];
            return response($response, 201)->withCookie('user_token', $jwtToken, time() + (3 * 24 * 60 * 60), '/', null, config('app.env') === 'production', true);
        } catch (Exception $err) {
            $response = [
                'error' => true,
                'message' => $err->getMessage()];
            return response($response, 201)->withCookie('user_token', null)->withCookie('user_token', null);
        }
    }

    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'string|email',
                'password' => 'string|min:8|regex:/^.*(?=.{3,})(?=.*[a-zA-Z])(?=.*[0-9]).*$/u',
            ]);
            if (auth()->attempt($validated)) {
                $token = auth()->user()->createToken('user_token')->plainTextToken;
                $jwtToken = JWT::encode([
                    'iss' => 'lumen-jwt',
                    'sub' => $token,
                    'iat' => time(),
                    'exp' => time() + (60 * 60 * 24 * 5),
                ], $this->secretKey(), 'HS256');
                return response(['error' => false, 'message' => 'success', 'plainTextToken' => $token, 'jwtToken' => $jwtToken], 201)->withCookie('user_token', $jwtToken, time() + (3 * 24 * 60 * 60), '/', null, config('app.env') === 'production', true);
            }
            throw new Exception('Invalid Credentials');
        } catch (Exception $err) {
            return response(['error' => true, 'message' => $err->getMessage()], 400)->withCookie('user_token', null);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        return response()->json(['error' => false, 'message' => 'success'], 200)->withCookie('user_token', null);
    }

    public function getUserForClient()
    {
        try {
            $token = request()->cookie('user_token');
            if (!$token) {
                throw new Exception('Not Authorized');
            }
            $secretKey = $this->secretKey(); // keep it consistent!
            $payload = JWT::decode($token, new Key($secretKey, 'HS256'));
            $userAccessToken = PersonalAccessToken::findToken($payload->sub);
            $user = $userAccessToken->tokenable;
            return response([
                'error' => false,
                'message' => 'success',
                'user' => $user,]);
        } catch (\Exception $e) {
            return response([
                'error' => true,
                'message' => $e->getMessage(),
                'payload' => null
            ], 400)->withCookie('user_token', null);
        }
    }

    public function getUserForServer()
    {
        try {
            $token = request()->cookie('user_token');
            if (!$token) {
                throw new Exception('Not Authorized');
            }
            $secretKey = $this->secretKey();
            $payload = JWT::decode($token, new Key($secretKey, 'HS256'));
            $userAccessToken = PersonalAccessToken::findToken($payload->sub);
            return $userAccessToken->tokenable;
        } catch (\Exception) {
            return null;
        }
    }
}
