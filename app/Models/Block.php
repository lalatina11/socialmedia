<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;

class Block extends Model
{
    use HasApiTokens, HasFactory;
    protected $fillable = ['blocker_id', 'blocked_id'];

    public function blocker()
    {
        return $this->belongsTo(User::class, 'blocker_id');
    }
    public function blocked()
    {
        return $this->belongsTo(User::class, 'blocked_id');
    }
}
