import React, { useEffect, useState } from "react";
import AdminLayout from "./Components/AdminLayout";
import { Pencil, Trash2 } from "lucide-react";
import { Link, usePage, router } from "@inertiajs/react";
import axios from "axios";

interface Toko {
    id_warung: number;
    nama_warung: string;
    alamat_warung: string;
    foto_warung: string | null;
    kelurahan: string;
    nomor_hp: string;
    kota: string;
}

export default function DaftarToko() {
    const [tokoList, setTokoList] = useState<Toko[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedToko, setSelectedToko] = useState<Toko | null>(null);

    const { app_url } = usePage().props;
    const baseUrl = `${app_url}/storage/`;

    const fetchToko = async () => {
        try {
            await axios.get("/sanctum/csrf-cookie");
            const response = await axios.get("/api/toko");
            setTokoList(response.data);
        } catch (error: any) {
            if (error.response?.status === 401) {
                router.visit("/login");
            }
            setTokoList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchToko();
    }, []);

    const handleDelete = async () => {
        if (!selectedToko) return;
        try {
            await axios.get("/sanctum/csrf-cookie");
            await axios.delete(`/api/toko/${selectedToko.id_warung}`);
            setTokoList((prev) => prev.filter((toko) => toko.id_warung !== selectedToko.id_warung));
            setShowModal(false);
        } catch (error: any) {
        }
    };

    return (
        <AdminLayout>
            <div className="h-[610px]">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Daftar Toko</h1>
                    {tokoList.length === 0 && (
                        <Link href="/admin/tambah-toko" className="bg-pink text-white px-4 py-2 rounded-xl font-semibold">
                            Tambah Toko
                        </Link>
                    )}
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="w-full table-auto text-left">
                        <thead className="bg-pink text-white">
                            <tr>
                                <th className="px-4 py-3">Foto</th>
                                <th className="px-4 py-3">Nama</th>
                                <th className="px-4 py-3">Alamat</th>
                                <th className="px-4 py-3">Kelurahan</th>
                                <th className="px-4 py-3">Nomor HP</th>
                                <th className="px-4 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-black">
                            {loading ? (
                                <tr><td colSpan={6} className="px-4 py-3 text-center">Memuat data...</td></tr>
                            ) : tokoList.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-3 text-center text-gray-500">Belum ada toko.</td></tr>
                            ) : (
                                tokoList.map((toko) => (
                                    <tr key={toko.id_warung} className="border-t">
                                        <td className="px-4 py-3">
                                            {toko.foto_warung ? (
                                                <img src={`${baseUrl}${toko.foto_warung}`} alt={`Foto ${toko.nama_warung}`} className="size-48 rounded-2xl object-cover" />
                                            ) : (
                                                <div className="size-32 rounded-full bg-gray-200 text-center text-gray-500">No Image</div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-semibold">{toko.nama_warung}</td>
                                        <td className="px-4 py-3">{toko.alamat_warung}</td>
                                        <td className="px-4 py-3">{toko.kelurahan}</td>
                                        <td className="px-4 py-3">{toko.nomor_hp}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center items-center space-x-2">
                                                <Link href={`/admin/edit-toko/${toko.id_warung}`} className="flex items-center text-pink hover:scale-105 gap-1">
                                                    <Pencil size={16} /> Ubah
                                                </Link>
                                                <button onClick={() => { setSelectedToko(toko); setShowModal(true); }} className="flex items-center text-red-600 hover:scale-105 gap-1 cursor-pointer">
                                                    <Trash2 size={16} /> Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && selectedToko && (
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-1/3">
                        <h2 className="text-lg font-semibold mb-6">Hapus Toko?</h2>
                        <p className="mb-5">Apakah Anda yakin ingin menghapus <strong>{selectedToko.nama_warung}</strong>?</p>
                        <div className="flex w-full space-x-3">
                            <button onClick={() => setShowModal(false)} className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg">Batal</button>
                            <button onClick={handleDelete} className="w-1/2 px-4 py-2 bg-red-600 text-white rounded-lg">Konfirmasi</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}