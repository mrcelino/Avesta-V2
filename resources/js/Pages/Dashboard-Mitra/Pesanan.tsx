import { useState, useEffect } from "react";
import AdminLayout from "./Components/AdminLayout";
import axios from "axios";

interface OrderItem {
    id_order_item: number;
    id_order: number;
    id_unggas: number;
    jumlah_kg: string;
    harga_total_per_item: string;
    catatan: string;
    created_at: string;
    updated_at: string;
    jenis_unggas?: string;
    foto_unggas?: string;
}

interface Order {
    id_order: number;
    id_user: number;
    id_warung: number;
    tanggal_order: string;
    total_harga: string;
    status_order: string;
    created_at: string;
    updated_at: string;
    order_items: OrderItem[];
    nama_warung?: string;
    alamat_warung?: string;
}

interface Warung {
    id_warung: number;
    nama_warung: string;
    alamat_warung: string;
    foto_warung: string;
    created_at: string;
    updated_at: string;
    id_user: number;
    kota: string;
    kecamatan: string;
    kelurahan: string;
    kode_pos: string;
    deskripsi: string;
    nomor_hp: string;
    orders: Order[];
}

export default function Pesanan() {
    const [tab, setTab] = useState("semua");
    const [warungData, setWarungData] = useState<Warung[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState<number | "all">(10);
    const [showPerPageOptions, setShowPerPageOptions] = useState(false);
    const perPageOptions: (number | "all")[] = [5, 10, 20, "all"];
    const [sortOrderAsc, setSortOrderAsc] = useState(false); // false = descending default


    const tabList = [
        { key: "semua", label: "Semua Pesanan" },
        { key: "berlangsung", label: "Sedang Berlangsung" },
        { key: "selesai", label: "Pesanan Selesai" },
        { key: "batal", label: "Pesanan Dibatalkan" },
    ];

    const fetchPesanan = async () => {
        try {
            await axios.get("/sanctum/csrf-cookie");
            const response = await axios.get<Warung[]>("/api/toko/pesanan");
            setWarungData(response.data);
        } catch (error: any) {
            console.error("Gagal fetch data pesanan:", error);
            setWarungData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPesanan();
    }, []);

    const handleToggleComplete = async (orderId: number) => {
        try {
            console.log("Sending request to complete order:", orderId);
            await axios.get("/sanctum/csrf-cookie");
            const response = await axios.post("/api/toko/pesanan/complete", { id_order: orderId });
            console.log("Response from server:", response.data);
            await fetchPesanan();
            // Dispatch custom event after successful completion
            const event = new Event("orderCompleted");
            window.dispatchEvent(event);
        } catch (error: any) {
            console.error("Gagal update status pesanan:", error.response ? error.response.data : error.message);
            alert("Gagal mengubah status pesanan. Silakan coba lagi.");
        }
    };

    const allOrders = warungData
        .flatMap((warung) =>
            warung.orders.map((order) => ({
                ...order,
                nama_warung: warung.nama_warung,
                alamat_warung: warung.alamat_warung,
            }))
        )
        .sort((a, b) => {
            const timeA = new Date(a.tanggal_order + "T00:00:00").getTime();
            const timeB = new Date(b.tanggal_order + "T00:00:00").getTime();

            // fallback to created_at if tanggal_order is the same
            if (timeA === timeB) {
                const createdA = new Date(a.created_at).getTime();
                const createdB = new Date(b.created_at).getTime();
                return sortOrderAsc ? createdA - createdB : createdB - createdA;
            }

            return sortOrderAsc ? timeA - timeB : timeB - timeA;
        });

    const filteredOrders = allOrders.filter((order) => {
        if (tab === "semua") return true;
        if (tab === "berlangsung") return order.status_order === "processed";
        if (tab === "selesai") return order.status_order === "completed";
        if (tab === "batal") return order.status_order === "canceled";
        return false;
    });

    const startIndex = (currentPage - 1) * (perPage === "all" ? filteredOrders.length : perPage);
    const endIndex = perPage === "all" ? filteredOrders.length : startIndex + perPage;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    const totalItems = filteredOrders.length;

    const formatRupiah = (harga: string) => {
        const num = parseFloat(harga);
        return "Rp." + num.toLocaleString("id-ID", { minimumFractionDigits: 0 });
    };

    const openModal = (order: Order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "processed":
                return "Sedang Berlangsung";
            case "completed":
                return "Pesanan Selesai";
            case "canceled":
                return "Pesanan Dibatalkan";
            default:
                return "Semua Pesanan";
        }
    };

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Daftar Pesanan</h1>

            <div className="flex justify-center items-center space-x-4 mb-4 bg-white p-2 w-fit mx-auto rounded-3xl">
                {tabList.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-2 rounded-2xl font-semibold cursor-pointer ${
                            tab === t.key
                                ? "bg-pink text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100 hover:text-pink"
                        } border ${
                            tab === t.key ? "border-pink" : "border-0"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="overflow-auto rounded-xl border">
                <table className="w-full text-left table-auto">
                    <thead className="bg-pink text-white">
                        <tr>
                            <th className="p-3 font-semibold">Foto</th>
                            <th className="p-3 font-semibold">Nama</th>
                            <th className="p-3 font-semibold">Total Harga</th>
                            <th className="p-3 font-semibold">
                                Jumlah Pesanan(kg)
                            </th>
                            <th className="p-3 font-semibold">Catatan</th>
                            <th
                                className="p-3 font-semibold cursor-pointer hover:scale-105 transition duration-300"
                                onClick={() => setSortOrderAsc(!sortOrderAsc)}
                            >
                                Tanggal Pesanan
                                <span className="ml-1">
                                    {sortOrderAsc ? "🔺" : "🔻"}
                                </span>
                            </th>
                            <th className="p-3 font-semibold">Sudah Diambil</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="p-3 text-center">
                                    Memuat data...
                                </td>
                            </tr>
                        ) : paginatedOrders.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-3 text-center text-gray-500">
                                    Belum ada pesanan.
                                </td>
                            </tr>
                        ) : (
                            paginatedOrders.map((order) => (
                                <tr key={order.id_order} className="border-t">
                                    <td className="p-3">
                                        <img
                                            src={order.order_items[0]?.foto_unggas ? `/storage/${order.order_items[0].foto_unggas}` : "/image/chicken.png"}
                                            alt="Pesanan"
                                            className="rounded-xl size-28 object-cover"
                                        />
                                    </td>
                                    <td className="p-3 font-medium">
                                        <button
                                            onClick={() => openModal(order)}
                                            className="text-pink hover:scale-105 font-semibold cursor-pointer"
                                        >
                                            Pesanan #{order.id_order}
                                        </button>
                                    </td>
                                    <td className="p-3">{formatRupiah(order.total_harga)}</td>
                                    <td className="p-3">
                                        {order.order_items
                                            .reduce((total, item) => total + parseFloat(item.jumlah_kg), 0)
                                            .toFixed(2)}
                                    </td>
                                    <td className="p-3">
                                        {order.order_items[0]?.catatan || "-"}
                                    </td>
                                    <td className="p-3">{order.tanggal_order}</td>
                                    <td className="p-3">
                                        {order.status_order !== "canceled" ? (
                                            <input
                                                type="checkbox"
                                                checked={order.status_order === "completed"}
                                                onChange={() => {
                                                    console.log("Checkbox clicked for order:", order.id_order, "Status:", order.status_order);
                                                    if (order.status_order !== "completed" && order.status_order !== "canceled") {
                                                        handleToggleComplete(order.id_order);
                                                    }
                                                }}
                                                className={`w-5 h-5 rounded-md cursor-pointer transition-colors duration-200 ${
                                                    order.status_order === "completed"
                                                        ? "bg-pink border-pink"
                                                        : "bg-white border-gray-300 border-2"
                                                }`}
                                            />
                                        ) : (
                                            <span></span> // Kolom kosong untuk status "canceled"
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className="p-4 text-sm border-t bg-white flex flex-col md:flex-row justify-between items-center gap-2">
                    <span>
                        Menampilkan {startIndex + 1} sampai{" "}
                        {Math.min(endIndex, totalItems)} dari {totalItems} hasil
                    </span>
                    <div className="flex justify-center w-full md:w-auto relative">
                        <button
                            onClick={() => setShowPerPageOptions(!showPerPageOptions)}
                            className="border min-w-44 rounded-md px-2 py-1 text-left"
                        >
                            {perPage === "all" ? "Semua" : `Per halaman - ${perPage}`}
                        </button>
                        {showPerPageOptions && (
                            <div className="absolute bottom-full mb-1 w-full bg-white border rounded-md shadow-lg">
                                {perPageOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            setPerPage(option);
                                            setCurrentPage(1);
                                            setShowPerPageOptions(false);
                                        }}
                                        className="w-full text-left px-3 py-1 hover:bg-gray-100 rounded-md"
                                    >
                                        {option === "all" ? "Semua" : `Per halaman - ${option}`}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal untuk Detail Pesanan */}
            {showModal && selectedOrder && (
                <dialog open className="modal bg-black/40">
                    <div className="modal-box max-w-5xl rounded-3xl">
                        <button
                            className="btn btn-lg btn-circle btn-ghost absolute right-1 top-1 text-pink text-2xl"
                            onClick={closeModal}
                        >
                            ✕
                        </button>
                        <h3 className="text-xl font-bold mb-2">Detail Pesanan</h3>
                        <div className="bg-[#FFE5E9] rounded-2xl min-h-44 p-4">
                            <h3 className="text-lg font-semibold mb-2">
                                {getStatusLabel(selectedOrder.status_order)}
                            </h3>
                            <div className="flex bg-white border min-h-16 rounded-2xl mb-2 p-2">
                                <div className="flex-1 text-left">
                                    <h3 className="font-medium">Nomor Invoice</h3>
                                    <h3 className="font-medium">Tanggal Pembelian</h3>
                                </div>
                                <div className="text-right">
                                    <p>INV{selectedOrder.id_order.toString().padStart(6, "0")}</p>
                                    <p>{selectedOrder.tanggal_order}</p>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Detail Produk</h3>
                            <div className="bg-white border rounded-2xl mb-2 max-h-40 overflow-y-scroll">
                                {selectedOrder.order_items.map((item) => (
                                    <div key={item.id_order_item} className="flex items-center p-2 border-b last:border-b-0">
                                        <img
                                            src={item.foto_unggas ? `/storage/${item.foto_unggas}` : "/image/chicken.png"}
                                            className="w-28 h-full rounded-md object-cover"
                                            alt={item.jenis_unggas || "Unggas"}
                                        />
                                        <div className="ml-4 flex-1">
                                            <h3 className="font-semibold">
                                                {item.jenis_unggas || "Nama Unggas"} {parseFloat(item.jumlah_kg)}kg
                                            </h3>
                                            <p>
                                                {parseFloat(item.jumlah_kg)} x {formatRupiah(item.harga_total_per_item)}
                                            </p>
                                            <p>{selectedOrder.nama_warung || "Warung Tidak Diketahui"}</p>
                                            {item.catatan && (
                                                <p className="text-sm text-gray-600">
                                                    Catatan: {item.catatan}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right flex flex-col items-end mr-2">
                                            <p className="mt-4">Total</p>
                                            <p className="text-lg font-semibold">
                                                {formatRupiah(item.harga_total_per_item)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Info Pengambilan</h3>
                            <div className="bg-white border min-h-16 rounded-2xl mb-2 p-3">
                                <h3 className="font-semibold mb-1">
                                    {selectedOrder.nama_warung || "Warung Tidak Diketahui"}
                                </h3>
                                <p className="text-base">
                                    {selectedOrder.alamat_warung || "Alamat Tidak Diketahui"}
                                </p>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Detail Pembayaran</h3>
                            <div className="flex bg-white border min-h-16 rounded-2xl mb-2 p-2">
                                <div className="flex-1 text-left">
                                    <h3 className="font-medium mb-1">Metode Pembayaran</h3>
                                    <h3 className="font-medium">Total Pembayaran</h3>
                                </div>
                                <div className="text-right">
                                    <p className="mb-1">AvestaPay</p>
                                    <p>{formatRupiah(selectedOrder.total_harga)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </dialog>
            )}
        </AdminLayout>
    );
}