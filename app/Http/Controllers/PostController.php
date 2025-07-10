<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {

        return Post::latest()->with('user')->get();
    }
    public function store(Request $request)
    {
        try {
            $userId = $request->input('user_id');
            $request['description'] = $request->input('description');
            if (isset($request['image']) && $request['image'] instanceof UploadedFile) {
                if ($request->hasFile('image')) {
                    $path = $request->file('image')->store('posts', 'public');
                }
            }
            // $userId2 = $request->user();
            $post = Post::create([
                'user_id' => $userId,
                'description' => $request['description'] ?? "",
                'image' => $path ?? null,
            ]);
            return response()->json([
                'error' => false,
                'data' => $post->with('user'),
                // 'userId' => $userId2,
                'message' => 'Created!'
            ], 201);
        } catch (\Exception $err) {
            return response()->json(['error' => true, 'data' => null, 'message' => $err->getMessage()], 400);
        }
    }

    public function update(int $id, Request $request){

    }

    public function destroy(int $id){

    }

}
