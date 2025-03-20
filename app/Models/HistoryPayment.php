<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoryPayment extends Model
{
    use HasFactory;

    protected $table = 'history_payment';
    protected $primaryKey = 'id_history_payment';
    public $timestamps = false;

    protected $fillable = [
        'id_user',
        'id_order',
        'id_payment',
        'tanggal_history',
        'wallet_payment',
        // 'status_history',
        'tipe_transaksi'
    ];

    protected $casts = [
        'tanggal_history' => 'datetime',
        'status_history' => 'string',
        'tipe_transaksi' => 'string'
    ];

    // Relasi ke User
    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    // Relasi ke Order (jika ada tabel orders)
    public function order()
    {
        return $this->belongsTo(Order::class, 'id_order');
    }

    // Relasi ke Payment (jika ada tabel payments)
    public function payment()
    {
        return $this->belongsTo(Payment::class, 'id_payment');
    }
}