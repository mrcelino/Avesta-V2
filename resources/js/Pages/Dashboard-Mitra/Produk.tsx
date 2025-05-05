import { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";
import AdminLayout from "./Components/AdminLayout";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";

interface Unggas {
    id_unggas: number;
    jenis_unggas: string;
    deskripsi: string;
    penjualan: number;
    harga_per_kg: string;
    stok: number;
    foto_unggas: string;
    created_at: string;
}

interface Warung {
    id_warung: number;
    nama_warung: string;
    unggas: Unggas[];
}

export default function Produk() {
    const [unggasList, setUnggasList] = useState<Unggas[]>([]);
    const [loading, setLoading] = useState(true);
    const [perPage, setPerPage] = useState<number | "all">(5); // Ubah tipe perPage
    const [showModal, setShowModal] = useState(false);
    const [selectedUnggas, setSelectedUnggas] = useState<Unggas | null>(null);
    const [showPerPageOptions, setShowPerPageOptions] = useState(false);

    const fetchUnggas = async () => { 
        try {
            await axios.get("/sanctum/csrf-cookie");
            const response = await axios.get<Warung[]>("/api/toko");
            const allUnggas = response.data.flatMap((warung) => warung.unggas);
            const sortedUnggas = allUnggas.sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
            setUnggasList(sortedUnggas);
        } catch (error: any) {
            console.error("Gagal fetch data unggas:", error);
            setUnggasList([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedUnggas) return;

        try {
            await axios.get("/sanctum/csrf-cookie");
            await axios.delete(`/api/unggas/${selectedUnggas.id_unggas}`);
            setUnggasList(unggasList.filter((unggas) => unggas.id_unggas !== selectedUnggas.id_unggas));
            setShowModal(false);
            setSelectedUnggas(null);
        } catch (error: any) {
            console.error("Gagal menghapus unggas:", error);
            alert("Gagal menghapus produk. Silakan coba lagi.");
        }
    };

    const openDeleteModal = (unggas: Unggas) => {
        setSelectedUnggas(unggas);
        setShowModal(true);
    };

    useEffect(() => {
        fetchUnggas();
    }, []);

    const formatRupiah = (harga: string) => {
        const num = parseFloat(harga);
        return "Rp." + num.toLocaleString("id-ID");
    };

    // Ubah logika displayedUnggas untuk handle "Semua"
    const displayedUnggas = perPage === "all" ? unggasList : unggasList.slice(0, perPage as number);

    const perPageOptions: (number | "all")[] = [5, 10, 20, 30, "all"]; // Tambah opsi "Semua"

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-1">Daftar Produk</h1>
                <Link
                    href="/admin/tambah-produk"
                    className="bg-pink text-white px-4 py-2 rounded-xl font-semibold transition duration-200 cursor-pointer"
                >
                    Tambah Produk
                </Link>
            </div>

            <div className="overflow-auto rounded-xl border">
                <table className="w-full text-left table-auto">
                    <thead className="bg-pink text-white">
                        <tr>
                            <th className="p-3 font-semibold">Foto</th>
                            <th className="p-3 font-semibold">Nama</th>
                            <th className="p-3 font-semibold">Harga</th>
                            <th className="p-3 font-semibold">Stok</th>
                            <th className="p-3 font-semibold">Penjualan</th>
                            <th className="p-3 font-semibold">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {loading ? (
                            <tr><td colSpan={7} className="p-3 text-center">Memuat data...</td></tr>
                        ) : unggasList.length === 0 ? (
                            <tr><td colSpan={7} className="p-3 text-center text-gray-500">Belum ada produk.</td></tr>
                        ) : (
                            displayedUnggas.map((unggas) => (
                                <tr key={unggas.id_unggas} className="border-t">
                                    <td className="p-3">
                                        <img
                                            src={`/storage/${unggas.foto_unggas}`}
                                            alt={unggas.jenis_unggas}
                                            className="rounded-xl size-32 object-cover"
                                        />
                                    </td>
                                    <td className="p-3 font-medium">{unggas.jenis_unggas}</td>
                                    <td className="p-3">{formatRupiah(unggas.harga_per_kg)}</td>
                                    <td className="p-3">{unggas.stok}</td>
                                    <td className="p-3">{unggas.penjualan}</td>
                                    <td className="p-3 space-x-2">
                                        <Link
                                            href={`/admin/edit-produk/${unggas.id_unggas}`}
                                            className="text-pink font-semibold inline-flex items-center space-x-1"
                                        >
                                            <Pencil size={16} />
                                            <span>Ubah</span>
                                        </Link>
                                        <button
                                            onClick={() => openDeleteModal(unggas)}
                                            className="text-red-600 font-semibold inline-flex items-center space-x-1 cursor-pointer"
                                        >
                                            <Trash2 size={16} />
                                            <span>Hapus</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className="p-4 text-sm border-t bg-white flex flex-col md:flex-row justify-between items-center gap-2">
                    <span>
                        Menampilkan 1 sampai {Math.min(perPage === "all" ? unggasList.length : perPage, unggasList.length)} dari {unggasList.length} hasil
                    </span>
                    <div className="relative flex justify-center w-full md:w-auto">
                        <button
                            onClick={() => setShowPerPageOptions(!showPerPageOptions)}
                            className="border min-w-44 rounded-md px-2 py-1 flex justify-between items-center"
                        >
                            {perPage === "all" ? "Semua" : `Per halaman - ${perPage}`}
                            <span>{showPerPageOptions ? "▲" : "▼"}</span>
                        </button>
                        {showPerPageOptions && (
                            <div className="absolute bottom-full mb-1 w-full bg-white border rounded-md shadow-lg">
                                {perPageOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            setPerPage(option);
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

            {showModal && selectedUnggas && (
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                    <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl p-6 w-full max-w-1/3">
                        <h2 className="text-lg font-semibold mb-6">Hapus Produk?</h2>
                        <p className="mb-5">
                            Apakah Anda yakin ingin melakukan ini?
                        </p>
                        <div className="flex w-full space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                className="w-1/2 px-4 py-2 bg-red-600 hover:bg-red-500 transition duration-300 text-white font-medium rounded-lg cursor-pointer"
                            >
                                Konfirmasi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}