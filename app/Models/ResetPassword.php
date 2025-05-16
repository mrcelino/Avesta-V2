<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResetPassword extends Model
{
    protected $table = 'reset_password';
    protected $primaryKey = 'id_reset_password';
    public $timestamps = true;

    protected $fillable = [
        'token',
        'tanggal_kadaluarsa',
        'is_used',
        'id_user',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }
}
