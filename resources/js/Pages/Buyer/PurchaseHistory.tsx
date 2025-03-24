import AuthLayout from "@/Layouts/AuthLayout";
import { useState, useEffect } from "react";
import axios from "axios";

// Interface untuk data dari API
interface OrderItem {
  id_order_item: number;
  id_order: number;
  id_unggas: number;
  jenis_unggas: string;
  jumlah_kg: string;
  harga_per_kg: string;
  harga_total_per_item: string;
  foto_unggas: string;
  catatan: string;
}

interface Order {
  id_order: number;
  id_user: number;
  id_warung: number;
  id_payment: number | null;
  nama_warung: string;
  alamat_warung: string;
  tanggal_order: string;
  total_harga: string;
  status_order: "processed" | "completed" | "canceled";
  order_items: OrderItem[];
}

function HistoryCard({
  order,
  onShowModal,
  onShowCancelModal,
}: {
  order: Order;
  onShowModal: (order: Order) => void;
  onShowCancelModal: (order: Order) => void;
}) {
  const firstItem = order.order_items[0];
  const additionalItemsCount = order.order_items.length - 1;

  return (
    <div className="bg-white rounded-2xl p-4 border shadow-md flex items-center w-full max-w-4xl">
      <img
        alt="Product Image"
        className="w-28 h-full rounded-md object-cover"
        src={`/storage/${firstItem.foto_unggas}`}
      />
      <div className="ml-4 flex-1">
        <h2 className="text-lg font-semibold">{firstItem.jenis_unggas}</h2>
        <p className="font-normal">
          {parseFloat(firstItem.jumlah_kg)} x Rp.{" "}
          {parseFloat(firstItem.harga_per_kg).toLocaleString("id-ID")}
        </p>
        <div className="flex flex-col gap-2">
          <p className="font-medium">{order.nama_warung}</p>
          {additionalItemsCount > 0 && (
            <p className="text-sm font-medium">
              +{additionalItemsCount} Produk lainnya
            </p>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className="mt-6">Total Pembelian</p>
        <p className="text-lg font-medium">
          Rp. {parseFloat(order.total_harga).toLocaleString("id-ID")}
        </p>
        <div className="mt-2 flex items-center">
          <button
            className="text-pink mr-4 cursor-pointer"
            onClick={() => onShowModal(order)}
          >
            Lihat Detail Transaksi
          </button>
          {order.status_order === "processed" ? (
            <button
              className="btn bg-pink text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition duration-300"
              onClick={() => onShowCancelModal(order)}
            >
              Batalkan
            </button>
          ) : (
            <button className="btn bg-pink text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition duration-300">
              Beli Lagi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TransactionModal({
  order,
  onClose,
}: {
  order: Order | null;
  onClose: () => void;
}) {
  if (!order) return null;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "processed":
        return "Transaksi sedang berlangsung";
      case "completed":
        return "Transaksi Berhasil";
      case "canceled":
        return "Transaksi Gagal";
      default:
        return status;
    }
  };

  return (
    <dialog open className="modal bg-black/40">
      <div className="modal-box max-w-5xl rounded-3xl">
        <button
          className="btn btn-lg btn-circle btn-ghost absolute right-1 top-1 text-pink text-2xl"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="text-xl font-bold mb-2">Detail Transaksi</h3>
        <div className="bg-[#FFE5E9] rounded-2xl min-h-44 p-4">
          <h3 className="text-lg font-semibold mb-2">
            {getStatusLabel(order.status_order)}
          </h3>
          <div className="flex bg-white border min-h-16 rounded-2xl mb-2 p-2">
            <div className="flex-1 text-left">
              <h3 className="font-medium">Nomor Invoice</h3>
              <h3 className="font-medium">Tanggal Pembelian</h3>
            </div>
            <div className="text-right">
              <p>INV{order.id_order.toString().padStart(6, "0")}</p>
              <p>{order.tanggal_order}</p>
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Detail Produk</h3>
          <div className="bg-white border rounded-2xl mb-2 max-h-40 overflow-y-scroll">
            {order.order_items.map((item) => (
              <div key={item.id_order_item} className="flex items-center p-2 border-b last:border-b-0">
                <img
                  src={`/storage/${item.foto_unggas}`}
                  className="w-28 h-full rounded-md object-cover"
                  alt={item.jenis_unggas}
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold">
                    {item.jenis_unggas} {parseFloat(item.jumlah_kg)}kg
                  </h3>
                  <p>
                    {parseFloat(item.jumlah_kg)} x Rp.{" "}
                    {parseFloat(item.harga_per_kg).toLocaleString("id-ID")}
                  </p>
                  <p>{order.nama_warung}</p>
                  {item.catatan && <p className="text-sm text-gray-600">Catatan: {item.catatan}</p>}
                </div>
                <div className="text-right flex flex-col items-end mr-2">
                  <p className="mt-4">Total</p>
                  <p className="text-lg font-semibold">
                    Rp. {parseFloat(item.harga_total_per_item).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <h3 className="text-lg font-semibold mb-2">Info Pengambilan</h3>
          <div className="bg-white border min-h-16 rounded-2xl mb-2 p-3">
            <h3 className="font-semibold mb-1">{order.nama_warung}</h3>
            <p className="text-base">{order.alamat_warung}</p>
          </div>
          <h3 className="text-lg font-semibold mb-2">Detail Pembayaran</h3>
          <div className="flex bg-white border min-h-16 rounded-2xl mb-2 p-2">
            <div className="flex-1 text-left">
              <h3 className="font-medium mb-1">Metode Pembayaran</h3>
              <h3 className="font-medium">Total Pembayaran</h3>
            </div>
            <div className="text-right">
              <p className="mb-1">AvestaPay</p>
              <p>Rp. {parseFloat(order.total_harga).toLocaleString("id-ID")}</p>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}

function CancelModal({
  order,
  onClose,
  onOrderUpdated,
}: {
  order: Order | null;
  onClose: () => void;
  onOrderUpdated: () => void;
}) {
  if (!order) return null;

  const [cancelReason, setCancelReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "processed":
        return "Berlangsung";
      case "completed":
        return "Berhasil";
      case "canceled":
        return "Tidak Berhasil";
      default:
        return status;
    }
  };

  const handleCancelOrder = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Update status order jadi canceled
      await axios.patch(
        `/api/orders/${order.id_order}/cancel`,
        {
          status_order: "canceled",
          cancel_reason: cancelReason || null,
        },
        {
          withCredentials: true,
        }
      );

      // 2. Buat record baru di HistoryPayment
      await axios.post(
        "/api/history",
        {
          id_user: order.id_user,
          id_order: order.id_order,
          id_payment: order.id_payment,
          tanggal_history: new Date().toISOString(),
          tipe_transaksi: "refund",
          wallet_payment: order.total_harga,
        },
        {
          withCredentials: true,
        }
      );

      // 3. Tampilkan modal konfirmasi
      setShowSuccessModal(true);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Terjadi kesalahan saat membatalkan order");
      } else {
        setError("Terjadi kesalahan saat membatalkan order");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onOrderUpdated(); // Refresh data
    onClose(); // Tutup CancelModal
  };

  return (
    <>
      {/* Modal Pembatalan - Hanya muncul kalo showSuccessModal false */}
      {!showSuccessModal && (
        <dialog open className="modal bg-black/40">
          <div className="modal-box max-w-5xl rounded-3xl">
            <button
              className="btn btn-lg btn-circle btn-ghost absolute right-1 top-1 text-pink text-2xl"
              onClick={onClose}
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-2">Pembatalan Transaksi</h3>
            <div className="bg-[#FFE5E9] rounded-2xl min-h-44 p-4">
              <h3 className="text-lg font-semibold mb-2">
                {getStatusLabel(order.status_order)}
              </h3>
              <div className="flex bg-white border min-h-16 rounded-2xl mb-2 p-2">
                <div className="flex-1 text-left">
                  <h3 className="font-medium">Nomor Invoice</h3>
                  <h3 className="font-medium">Tanggal Pembelian</h3>
                </div>
                <div className="text-right">
                  <p>INV{order.id_order.toString().padStart(6, "0")}</p>
                  <p>{order.tanggal_order}</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Detail Produk</h3>
              <div className="bg-white border rounded-2xl mb-2 max-h-40 overflow-y-scroll">
                {order.order_items.map((item) => (
                  <div key={item.id_order_item} className="flex items-center p-2 border-b last:border-b-0">
                    <img
                      src={`/storage/${item.foto_unggas}`}
                      className="w-28 h-full rounded-md object-cover"
                      alt={item.jenis_unggas}
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold">
                        {item.jenis_unggas} {parseFloat(item.jumlah_kg)}kg
                      </h3>
                      <p>
                        {parseFloat(item.jumlah_kg)} x Rp.{" "}
                        {parseFloat(item.harga_per_kg).toLocaleString("id-ID")}
                      </p>
                      <p>{order.nama_warung}</p>
                      {item.catatan && <p className="text-sm text-gray-600">Catatan: {item.catatan}</p>}
                    </div>
                    <div className="text-right flex flex-col items-end mr-2">
                      <p className="mt-4">Total</p>
                      <p className="text-lg font-semibold">
                        Rp. {parseFloat(item.harga_total_per_item).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <h3 className="text-lg font-semibold mb-2">Alasan Pembatalan</h3>
              <div className="bg-white border min-h-16 rounded-2xl mb-2 p-2">
                <textarea
                  className="w-full p-2 rounded-xl border-0 focus:border-pink focus:ring-2 focus:ring-pink outline-none resize-none"
                  placeholder="Masukkan alasan pembatalan..."
                  rows={3}
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 mb-2">{error}</p>}
              <div className="flex justify-end mt-4">
                <button
                  className="btn bg-pink text-white px-4 py-1 rounded-lg font-semibold hover:scale-105 transition duration-300"
                  onClick={handleCancelOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Memproses..." : "Ajukan Pembatalan"}
                </button>
              </div>
            </div>
          </div>
        </dialog>
      )}

      {/* Modal Konfirmasi Pembatalan Berhasil */}
      {showSuccessModal && (
        <dialog open className="modal bg-black/40">
          <div className="flex flex-col justify-center items-center modal-box max-w-xl bg-pink rounded-2xl p-6 text-center">
            <button
              onClick={handleSuccessModalClose} // Ganti jadi handleSuccessModalClose
              className="btn btn-md btn-circle btn-ghost text-white absolute right-2 top-2 hover:text-pink transition duration-300"
            >
              ✕
            </button>
            <h3 className="text-3xl text-white font-bold max-w-sm text-center">
              Pesanan Berhasil Dibatalkan
            </h3>
            <img className="mx-auto -mt-12 w-96 mb-10" src="/image/cancel.png" alt="Sukses" />
          </div>
        </dialog>
      )}
    </>
  );
}

const StatusFilter = ({ onFilterChange }: { onFilterChange: (status: string) => void }) => {
  const [filterStatus, setFilterStatus] = useState("semua");

  const handleFilterClick = (status: string) => {
    setFilterStatus(status);
    onFilterChange(status);
  };

  return (
    <div className="flex space-x-4 bg-[#9A9A9A29] w-full rounded-3xl p-2">
      <div className="px-4 py-2 text-lg font-semibold">Status:</div>
      {["semua", "berlangsung", "berhasil", "tidak berhasil"].map((status) => (
        <button
          key={status}
          className={`btn btn-md px-4 py-2 bg-white rounded-3xl font-medium shadow-md ${
            filterStatus === status ? "border-pink border-2" : ""
          }`}
          onClick={() => handleFilterClick(status)}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default function PurchaseHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelOrder, setCancelOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const result = await response.json();
      if (result.success) {
        setOrders(result.data);
        setFilteredOrders(result.data);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (err) {
      setError("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleFilterChange = (filterStatus: string) => {
    if (filterStatus === "semua") {
      setFilteredOrders(orders);
    } else {
      const statusMap: { [key: string]: string } = {
        berlangsung: "processed",
        berhasil: "completed",
        "tidak berhasil": "canceled",
      };
      const statusToFilter = statusMap[filterStatus];
      setFilteredOrders(orders.filter((order) => order.status_order === statusToFilter));
    }
  };

  if (loading) {
    return (
      <AuthLayout>
        <div className="flex flex-col gap-2 mx-10 mt-28 min-h-screen max-w-8xl">
          <h1 className="text-2xl font-semibold">Daftar Transaksi</h1>
          <p>Loading...</p>
        </div>
      </AuthLayout>
    );
  }

  if (error) {
    return (
      <AuthLayout>
        <div className="flex flex-col gap-2 mx-10 mt-28 min-h-screen max-w-8xl">
          <h1 className="text-2xl font-semibold">Daftar Transaksi</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-2 mx-10 mt-28 min-h-screen max-w-8xl">
        <h1 className="text-2xl font-semibold">Daftar Transaksi</h1>
        <StatusFilter onFilterChange={handleFilterChange} />
        <div className="grid grid-cols-2 border-2 rounded-2xl p-4 gap-4 mb-20">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <HistoryCard
                key={order.id_order}
                order={order}
                onShowModal={setSelectedOrder}
                onShowCancelModal={setCancelOrder}
              />
            ))
          ) : (
            <p>Tidak ada transaksi dengan status ini.</p>
          )}
        </div>
        <TransactionModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
        <CancelModal
          order={cancelOrder}
          onClose={() => setCancelOrder(null)}
          onOrderUpdated={fetchOrders}
        />
      </div>
    </AuthLayout>
  );
}