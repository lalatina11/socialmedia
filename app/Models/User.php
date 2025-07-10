<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'firstname',
        'lastname',
        'bio',
        'avatar',
        'cover',
        'city',
        'school',
        'work',
        'website',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function getAvatarAttribute($value)
    {
        if (!$value) {
            return null;
        }
        return url(Storage::url($value));
    }
    public function getCoverAttribute($value)
    {
        if (!$value) {
            return null;
        }
        return url(Storage::url($value));
    }
    public function likes()
    {
        return $this->hasMany(Like::class);
    }
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    public function blocks()
    {
        return $this->hasMany(Block::class, 'blocker_id');
    }
    public function blockedBy()
    {
        return $this->hasMany(Block::class, 'blocked_id');
    }
    public function stories()
    {
        return $this->hasMany(Story::class);
    }

    public function followers()
    {
        return $this->hasMany(Follower::class, 'follower_id');
    }
    public function followings()
    {
        return $this->hasMany(Follower::class, 'following_id');
    }
    public function followRequestsSent()
    {
        return $this->hasMany(FollowRequest::class, 'sender_id');
    }
    public function followRequestReceiver()
    {
        return $this->hasMany(Follower::class, 'receiver');
    }

}
