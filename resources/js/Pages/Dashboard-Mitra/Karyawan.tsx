import AdminLayout from "./Components/AdminLayout";
import { Link } from "@inertiajs/react";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Karyawan() {
    const [karyawan, setKaryawan] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState<number | "all">(10);
    const [showPerPageOptions, setShowPerPageOptions] = useState(false);
    const [showModal, setShowModal] = useState(false); // State untuk modal
    const [selectedKaryawanId, setSelectedKaryawanId] = useState<number | null>(
        null
    );
    const perPageOptions = [5, 10, 20, "all"] as const;

    const warungId = localStorage.getItem("warungId");

    useEffect(() => {
        const fetchKaryawan = async () => {
            if (!warungId) {
                setError("Warung ID tidak ditemukan di localStorage");
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                console.log(`Fetching karyawan for warungId: ${warungId}`);
                await axios.get("/sanctum/csrf-cookie", {
                    withCredentials: true,
                });
                const response = await axios.get(
                    `/api/karyawan/warung/${warungId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        withCredentials: true,
                    }
                );
                console.log("Karyawan data:", response.data);

                const filteredKaryawan = response.data.map((k: any) => ({
                    id: k.id_user,
                    nama: `${k.nama_depan} ${k.nama_belakang || ""}`.trim(),
                    noHp: k.no_telepon,
                    email: k.email,
                    foto: k.foto || "https://i.pravatar.cc/40?img=1",
                }));
                setKaryawan(filteredKaryawan);
            } catch (e: any) {
                setError(
                    e.response?.data.message || "Gagal memuat data karyawan"
                );
                console.error(
                    "Error fetching karyawan:",
                    e.response?.data || e
                );
            } finally {
                setLoading(false);
            }
        };

        fetchKaryawan();
    }, [warungId]);

    const handleDelete = async (id: number) => {
        setDeleteLoading(id);
        setError(null);

        try {
            console.log(`Deleting karyawan with id: ${id}`);
            await axios.get("/sanctum/csrf-cookie", { withCredentials: true });
            const response = await axios.delete(`/api/karyawan/${id}`, {
                headers: {
                    Accept: "application/json",
                },
                withCredentials: true,
            });

            console.log("Delete response:", response.data);
            setKaryawan((prev) => prev.filter((k: any) => k.id !== id));
            setShowModal(false);
        } catch (e: any) {
            setError(e.response?.data.message || "Gagal menghapus karyawan");
            console.error("Error deleting karyawan:", e.response?.data || e);
        } finally {
            setDeleteLoading(null);
        }
    };

    const openModal = (id: number) => {
        setSelectedKaryawanId(id);
        setShowModal(true);
    };

    const isAll = perPage === "all";
    const itemsPerPage = isAll ? karyawan.length : (perPage as number);
    const indexOfLastItem = isAll
        ? karyawan.length
        : currentPage * itemsPerPage;
    const indexOfFirstItem = isAll ? 0 : indexOfLastItem - itemsPerPage;
    const currentKaryawan = isAll
        ? karyawan
        : karyawan.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = isAll
        ? 1
        : Math.ceil(karyawan.length / (perPage as number));

    return (
        <AdminLayout>
            <div className="min-h-screen">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold mb-1">Daftar Karyawan</h1>
                    <Link
                        href="/admin/tambah-karyawan"
                        className="bg-pink text-white px-4 py-2 rounded-xl font-semibold transition duration-200 cursor-pointer"
                    >
                        Tambah Karyawan
                    </Link>
                </div>

                {loading && <p className="text-center">Memuat...</p>}
                {error && <p className="text-center text-red-600">{error}</p>}
                {!loading && !error && (
                    <div className="overflow-auto rounded-xl border">
                        <table className="w-full text-left table-auto">
                            <thead className="bg-pink text-white">
                                <tr>
                                    <th className="p-3 font-semibold">Foto</th>
                                    <th className="p-3 font-semibold">Nama</th>
                                    <th className="p-3 font-semibold">
                                        Nomor HP
                                    </th>
                                    <th className="p-3 font-semibold">Email</th>
                                    <th className="p-3 font-semibold">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {currentKaryawan.map((k: any) => (
                                    <tr key={k.id} className="border-t">
                                        <td className="p-3">
                                            <img
                                                src={
                                                    k.foto
                                                        ? `/storage/${k.foto}`
                                                        : "https://i.pravatar.cc/40?img=1"
                                                }
                                                alt={k.nama}
                                                className="rounded-full size-16"
                                            />
                                        </td>
                                        <td className="p-3 font-medium">
                                            {k.nama}
                                        </td>
                                        <td className="p-3">{k.noHp}</td>
                                        <td className="p-3">{k.email}</td>
                                        <td className="p-3 space-x-2">
                                            <Link
                                                href={`/admin/edit-karyawan/${k.id}`}
                                                className="text-pink font-semibold inline-flex items-center space-x-1 cursor-pointer hover:scale-105 transition duration-300"
                                            >
                                                <Pencil size={16} />
                                                <span>Ubah</span>
                                            </Link>
                                            <button
                                                onClick={() => openModal(k.id)}
                                                disabled={
                                                    deleteLoading === k.id
                                                }
                                                className="text-red-600 font-semibold inline-flex items-center space-x-1 cursor-pointer hover:scale-105 transition duration-300"
                                            >
                                                <Trash2 size={16} />
                                                <span>
                                                    {deleteLoading === k.id
                                                        ? "Menghapus..."
                                                        : "Hapus"}
                                                </span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="p-4 text-sm border-t bg-white flex flex-col md:flex-row justify-between items-center gap-2">
                            <span>
                                Menampilkan {indexOfFirstItem + 1} sampai{" "}
                                {Math.min(indexOfLastItem, karyawan.length)}{" "}
                                dari {karyawan.length} hasil
                            </span>
                            <div className="relative flex justify-center w-full md:w-auto">
                                <button
                                    onClick={() =>
                                        setShowPerPageOptions(
                                            !showPerPageOptions
                                        )
                                    }
                                    className="border min-w-44 rounded-md px-2 py-1 flex items-center justify-between"
                                >
                                    {perPage === "all"
                                        ? "Semua"
                                        : `Per halaman - ${perPage}`}
                                    <span>
                                        {showPerPageOptions ? "▲" : "▼"}
                                    </span>
                                </button>
                                {showPerPageOptions && (
                                    <div className="absolute bottom-full mb-1 w-full bg-white border rounded-md shadow-lg">
                                        {perPageOptions.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => {
                                                    setPerPage(option);
                                                    setCurrentPage(1);
                                                    setShowPerPageOptions(
                                                        false
                                                    );
                                                }}
                                                className="w-full text-left px-3 py-1 hover:bg-gray-100 rounded-md"
                                            >
                                                {option === "all"
                                                    ? "Semua"
                                                    : `Per halaman - ${option}`}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {showModal && selectedKaryawanId && (
                    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                        <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl p-6 w-full max-w-1/3">
                            <h2 className="text-lg font-semibold mb-6">
                                Hapus Karyawan?
                            </h2>
                            <p className="mb-5">
                                Apakah Anda yakin ingin menghapus karyawan ini?
                            </p>
                            <div className="flex w-full space-x-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() =>
                                        handleDelete(selectedKaryawanId)
                                    }
                                    className="w-1/2 px-4 py-2 bg-red-600 hover:bg-red-500 transition duration-300 text-white font-medium rounded-lg cursor-pointer"
                                >
                                    Konfirmasi
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
