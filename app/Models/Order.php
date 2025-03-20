<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_user', 'tanggal_order', 'total_harga', 'status_order', 'product_name', 'catatan', 'jumlah_kg', 'id_warung', 'foto_order'
    ];

    protected $primaryKey = 'id_order';

    // Jika primary key bukan auto-increment, tambahkan ini
    public $incrementing = true;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class, 'id_order', 'id_order');
    }
    public function warung()
    {
        return $this->belongsTo(Warung::class, 'id_warung', 'id_warung');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class, 'id_order', 'id_order');
    }
    

    protected static function boot()
    {
        parent::boot();

        static::created(function ($order) {
            // Buat payment otomatis
            Payment::create([
                'id_order' => $order->id_order,
                'total_payment' => $order->total_harga,
                'waktu_payment' => now(),
            ]);
        });
    }
}