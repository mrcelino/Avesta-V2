import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import { useCart, CartItem } from "@/Layouts/AuthLayout";
import { Link } from "@inertiajs/react";

const PaymentContent: React.FC = () => {
  const { cart } = useCart();
  console.log("PaymentContent rendered with cart:", cart);

  const totalBelanja = cart.reduce(
    (total, item) => total + parseFloat(item.harga_per_kg) * item.quantity,
    0
  );

  const warung = cart.length > 0 ? cart[0].warung : null;

  return (
    <main className="p-8 pt-28 flex space-x-8 min-h-screen">
      <div className="w-2/3">
        <h2 className="text-2xl font-bold mb-4">Pembayaran</h2>

        {warung && <WarungCard warung={warung} />}

        <div className="bg-white p-4 rounded-xl shadow-md border mt-4">
          <div className="space-y-4">
            {cart.length === 0 ? (
              <p>Keranjang kosong</p>
            ) : (
              cart.map((item) => <ProdukItem key={item.id_unggas} item={item} />)
            )}
          </div>
        </div>
      </div>

      <RingkasanBelanja totalBelanja={totalBelanja} />
    </main>
  );
};

const PaymentPage: React.FC = () => {
  return (
    <AuthLayout>
      <PaymentContent />
    </AuthLayout>
  );
};

// Tipe untuk WarungCard (sesuai warung di CartItem)
interface Warung {
  id_warung: number;
  nama_warung: string;
  alamat_warung: string;
  kelurahan: string;
  foto_warung: string;
}

function WarungCard({ warung }: { warung: Warung }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md border">
      <h2 className="font-medium">ALAMAT PENGAMBILAN</h2>
      <div className="flex items-center shadow-md border border-gray-200 rounded-xl p-4 mt-5">
        <img
          className="size-20 rounded-lg mr-4"
          src={`/storage/${warung.foto_warung}`}
          alt={warung.nama_warung}
        />
        <div>
          <h3 className="text-lg font-semibold mb-2">{warung.nama_warung}</h3>
          <p className="font-medium">{warung.alamat_warung}</p>
        </div>
      </div>
    </div>
  );
}

interface ProdukItemProps {
  item: CartItem;
}

function ProdukItem({ item }: ProdukItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <img
        src={`/storage/${item.foto_unggas}`}
        alt={item.jenis_unggas}
        className="size-24 rounded-lg"
      />
      <div className="flex-1 ml-4">
        <h3 className="font-bold">{item.jenis_unggas}</h3>
        <p>{item.warung.nama_warung}</p>
        <div className="flex items-center mt-2 border rounded-xl font-medium max-w-56 p-1">
          <img src="/image/note.png" alt="Note Icon" className="mr-2" />
          <p>{item.catatan || "Tanpa catatan"}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold">
          {item.quantity} x Rp. {parseFloat(item.harga_per_kg).toLocaleString("id-ID")}
        </p>
      </div>
    </div>
  );
}

function RingkasanBelanja({ totalBelanja }: { totalBelanja: number }) {
  return (
    <div className="flex flex-col gap-4 w-1/3">
      <div className="bg-white p-4 rounded-lg shadow mt-12">
        <h3 className="text-xl font-semibold mb-4">Ringkasan Belanja</h3>
        <div className="flex justify-between mb-4">
          <span>Total Belanja</span>
          <span className="font-bold">Rp. {totalBelanja.toLocaleString("id-ID")}</span>
        </div>
      </div>
      <Link
        href="/paymentconfirm"
        className="bg-pink text-white rounded-2xl btn w-full"
      >
        Bayar dengan AvestaPay
      </Link>
    </div>
    
  );
}

export default PaymentPage;