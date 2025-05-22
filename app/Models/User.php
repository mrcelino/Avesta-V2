<?php

namespace App\Models;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory, Notifiable;
    public $primaryKey = 'id_user';

    protected $fillable = [
        'nama_depan',
        'nama_belakang',
        'email',
        'alamat',
        'foto',
        'jenis_kelamin',
        'tanggal_lahir',
        'no_telepon',
        'password',
        'role',
        'saldo',
        'id_warung',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function warung()
    {
        return $this->belongsTo(Warung::class, 'id_warung', 'id_warung');
    }
}