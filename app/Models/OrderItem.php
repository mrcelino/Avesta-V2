<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_order_item';
    protected $fillable = [
        'id_order',
        'id_unggas',
        'jumlah_kg',
        'harga_total_per_item',
        'catatan',
    ];
    public function order()
    {
        return $this->belongsTo(Order::class, 'id_order', 'id_order');
    }

    public function unggas()
    {
        return $this->belongsTo(Unggas::class, 'id_unggas', 'id_unggas');
    }
}