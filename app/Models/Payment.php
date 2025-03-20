<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\HistoryPayment;
class Payment extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_payment';
    protected $fillable = [
        'id_order',
        'total_payment',
        'waktu_payment',
        // 'status_payment',
    ];

    // Relasi ke tabel orders
    public function order()
    {
        return $this->belongsTo(Order::class, 'id_order', 'id_order');
    }
    
    // Event listener untuk membuat history payment setelah payment dibuat
    protected static function boot()
    {
        parent::boot();

        static::created(function ($payment) {
            HistoryPayment::create([
                'id_user' => $payment->order->id_user,
                'id_order' => $payment->id_order,
                'id_payment' => $payment->id_payment,
                'tanggal_history' => now(),
                // 'status_history' => $payment->status_payment,
                'tipe_transaksi' => 'pembayaran', // Default tipe transaksi
                'wallet_payment' => $payment->total_payment,
            ]);
        });
    }
}