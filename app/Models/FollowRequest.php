<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $sender_id
 * @property int $receiver_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $receiver
 * @property-read \App\Models\User $sender
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FollowRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FollowRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FollowRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FollowRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FollowRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FollowRequest whereReceiverId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FollowRequest whereSenderId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|FollowRequest whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class FollowRequest extends Model
{
    protected $fillable = ['sender_id', 'receiver_id'];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

}
