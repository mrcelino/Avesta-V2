<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Warung extends Model
{
    use HasFactory;

    protected $table = 'warung'; 
    protected $primaryKey = 'id_warung';
    protected $fillable = [
        'nama_warung',
        'alamat_warung',
        'nomor_hp',
        'id_user',
        'deskripsi',
        'kecamatan',
        'kelurahan',
        'kota',
        'kode_pos',
        'foto_warung',
        'latitude',
        'longitude',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user', 'id_user');
    }
    
    public function orders()
    {
        return $this->hasMany(Order::class, 'id_warung', 'id_warung');
    }
    
    public function unggas()
    {
        return $this->hasMany(Unggas::class, 'id_warung', 'id_warung'); 
    }

    public function karyawans()
    {
        return $this->hasMany(User::class, 'id_warung', 'id_warung')->where('role', 'karyawan');
    }
}