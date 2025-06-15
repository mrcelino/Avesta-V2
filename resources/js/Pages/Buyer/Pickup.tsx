import AuthLayout from "@/Layouts/AuthLayout";
import { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import { useLocation } from "@/Layouts/AuthLayout";
import axios from "axios";

declare let L: any;

function PickupContent() {
  const { location } = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    // Ambil startTime dari localStorage
    const savedStartTime = localStorage.getItem("orderStartTime");
    if (savedStartTime) {
      const startTime = parseInt(savedStartTime, 10);
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = 3600 - elapsed;
      return remaining > 0 ? remaining : 0;
    }
    // Jika belum ada startTime, mulai dari 3600
    localStorage.setItem("orderStartTime", Date.now().toString());
    return 3600;
  });
  const [statusModal, setStatusModal] = useState<"success" | "pending" | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const namaWarung = location.nama_warung || "Nama Warung";
  const alamatWarung = location.alamat_warung || "Alamat Warung";
  const latitude = location.latitude ? parseFloat(location.latitude) : -6.2;
  const longitude = location.longitude ? parseFloat(location.longitude) : 106.816666;
  const idOrder = location.id_order;

  // Fungsi untuk cek status order
  const checkOrderStatus = async () => {
    if (!idOrder) {
      console.warn("No idOrder available");
      return;
    }

    setLoadingStatus(true);
    try {
      const response = await axios.get(`/api/order-status/${idOrder}`, {
        withCredentials: true,
      });
      const status = response.data.status_order;
      if (status === "completed") {
        setStatusModal("success");
      } else {
        setStatusModal("pending");
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching order status:", error);
      setStatusModal("pending");
      setIsModalOpen(true);
    } finally {
      setLoadingStatus(false);
    }
  };

  // Fungsi untuk cancel order
  const cancelOrder = async () => {
    if (!idOrder) {
      console.warn("No idOrder available for cancellation");
      return;
    }

    try {
      const response = await axios.patch(`/api/orders/${idOrder}/cancel`, {}, { withCredentials: true });
      console.log("Order cancelled:", response.data);
      localStorage.removeItem("orderStartTime"); 
      router.visit("/dashboard");
    } catch (error: any) {
      console.error("Error cancelling order:", error.response?.data || error);
    }
  };

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          if (idOrder) {
            cancelOrder();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [idOrder]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    if (!mapRef.current || (window as any).leafletMap) return;

    const map = L.map(mapRef.current).setView([latitude, longitude], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    map.attributionControl.setPrefix("");

    const redIcon = new L.Icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    L.marker([latitude, longitude], { icon: redIcon })
      .addTo(map)
      .bindPopup(namaWarung)
      .openPopup();

    (window as any).leafletMap = map;

    return () => {
      if ((window as any).leafletMap) {
        (window as any).leafletMap.remove();
        (window as any).leafletMap = null;
      }
    };
  }, [latitude, longitude, namaWarung]);

  const handleShopAgain = () => {
    router.visit("/dashboard");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStatusModal(null);
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <section className="items-center text-center pt-24">
        <h2 className="text-2xl font-medium mb-2">Ambil Pesanan dalam</h2>
        <div className="text-3xl text-pink font-semibold">{formatTime(timeLeft)}</div>
        <h2 className="text-lg font-medium">Batas Waktu Pengambilan</h2>
        <h2 className="text-lg font-semibold mb-2">
          {new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </h2>
      </section>

      <section className="bg-white p-4 max-w-2xl mx-auto rounded-3xl border-2 shadow-md mt-4">
        <h2 className="font-medium text-center text-lg mb-2">Alamat Pengambilan</h2>
        <div className="shadow-md border-2 rounded-xl p-4">
          <div ref={mapRef} className="w-full h-60 rounded-xl overflow-hidden z-0"></div>
          <div className="max-w-2xl mt-4">
            <h3 className="font-semibold">{namaWarung}</h3>
            <p className="font-medium">{alamatWarung}</p>
          </div>
        </div>
      </section>

      <section className="flex w-full max-w-2xl mx-auto rounded-xl mt-4 gap-2 mb-8">
        <button
          onClick={checkOrderStatus}
          className="btn border-2 border-pink bg-white hover:bg-pink hover:text-white w-1/2 text-pink font-semibold py-2 px-4 rounded-2xl"
          disabled={loadingStatus || !idOrder}
        >
          {loadingStatus ? "Memuat..." : "Cek Status Pengambilan"}
        </button>

        {isModalOpen && statusModal && (
          <dialog open className="modal bg-black/40">
            <div className={`modal-box ${statusModal === "success" ? "bg-pink" : "bg-white"}`}>
              <button
                onClick={closeModal}
                className={`btn btn-sm btn-circle btn-ghost absolute right-2 top-2 ${
                  statusModal === "success" ? "text-white" : "text-pink"
                }`}
              >
                ✕
              </button>
              <h3
                className={`text-center text-3xl font-bold mb-4 ${
                  statusModal === "success" ? "text-white" : "text-pink"
                }`}
              >
                {statusModal === "success" ? "Pengambilan Terkonfirmasi" : "Pengambilan Tertunda"}
              </h3>
              <img
                className="px-12 py-8 flex justify-center mx-auto"
                src={statusModal === "success" ? "/image/success.png" : "/image/gagal.png"}
                alt={statusModal === "success" ? "Success" : "Pending"}
              />
            </div>
          </dialog>
        )}

        <button
          onClick={handleShopAgain}
          className="btn w-1/2 bg-pink text-white hover:bg-pink hover:text-white font-semibold py-2 px-4 rounded-2xl"
        >
          Belanja Lagi
        </button>
      </section>
    </div>
  );
}

export default function Pickup() {
  return (
    <AuthLayout>
      <PickupContent />
    </AuthLayout>
  );
}