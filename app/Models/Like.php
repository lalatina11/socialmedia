<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Like extends Model
{
    use HasApiTokens, HasFactory;
    protected $fillable = ['user_id', 'post_id', 'comment_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
    public function comment()
    {
        return $this->belongsTo(Comment::class);
    }

}
