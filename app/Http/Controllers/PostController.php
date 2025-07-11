<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

class PostController extends Controller
{
    public function index()
    {

        return Post::latest()->with('user')->get()->load([
            'likes:id,user_id,post_id',
            'comments:id,description,user_id,post_id',
            'comments.user:id,username,firstname,lastname,avatar'
        ]);
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
            $post = Post::create([
                'user_id' => $userId,
                'description' => $request['description'] ?? "",
                'image' => $path ?? null,
            ]);

            return response()->json([
                'error' => false,
                'data' => $post->load([
                    'user:id,username,avatar',
                    'likes:id,user_id,post_id',
                    'comments:id,description,user_id,post_id',
                    'comments.user:id,username,firstname,lastname,avatar'
                ]),
                'message' => 'Created!'
            ], 201);
        } catch (\Exception $err) {
            return response()->json(['error' => true, 'data' => null, 'message' => $err->getMessage()], 400);
        }
    }

    public function update(int $id, Request $request)
    {

    }

    public function destroy(int $id)
    {

    }

}
