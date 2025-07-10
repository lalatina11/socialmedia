<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;

class Story extends Model
{
    use HasApiTokens, HasFactory;
    protected $fillable = ['user_id', 'image'];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getImageAttribute(string $value)
    {
        if (!$value)
            return null;
        return url(Storage::url($value));
    }
}
