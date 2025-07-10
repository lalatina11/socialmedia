<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Follower extends Model
{
    use HasApiTokens, HasFactory;
    protected $fillable = ['follower_id', 'following_id'];
    public function following()
    {
        return $this->belongsTo(User::class, 'following_id');
    }
    public function follower()
    {
        return $this->belongsTo(User::class, 'follower_id');
    }
}
