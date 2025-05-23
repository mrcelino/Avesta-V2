import AdminLayout from "./Components/AdminLayout";
import { useState, useEffect } from "react";
import axios from "axios";
import { usePage, router } from "@inertiajs/react";

export default function KaryawanEdit() {
    const { props } = usePage();
    const id = props.id_user;
    const [formData, setFormData] = useState({
        nama_depan: "",
        nama_belakang: "",
        no_telepon: "",
        email: "",
    });
    const [foto, setFoto] = useState<File | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | undefined>(undefined);
    const [initialFoto, setInitialFoto] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchKaryawan = async () => {
            if (!id) {
                setError("Karyawan ID tidak ditemukan");
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                console.log(`Fetching karyawan with id: ${id}`);
                await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
                const response = await axios.get(`/api/karyawan/${id}`, {
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    withCredentials: true,
                });
                console.log("Karyawan data:", response.data);

                const karyawan = response.data;
                setFormData({
                    nama_depan: karyawan.nama_depan,
                    nama_belakang: karyawan.nama_belakang || "",
                    no_telepon: karyawan.no_telepon,
                    email: karyawan.email,
                });
                setInitialFoto(karyawan.foto || "https://i.pravatar.cc/40?img=1");
            } catch (e: any) {
                setError(e.response?.data.message || "Gagal memuat data karyawan");
                console.error("Error fetching karyawan:", e.response?.data || e);
            } finally {
                setLoading(false);
            }
        };

        fetchKaryawan();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFoto(file);
            const previewUrl = URL.createObjectURL(file);
            setFotoPreview(previewUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateLoading(true);
        setError(null);

        try {
            console.log("Fetching CSRF cookie...");
            await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
            console.log("CSRF cookie fetched");

            const data = new FormData();
            data.append("nama_depan", formData.nama_depan);
            data.append("nama_belakang", formData.nama_belakang);
            data.append("no_telepon", formData.no_telepon);
            data.append("email", formData.email);
            if (foto) {
                data.append("foto", foto);
            }

            console.log("Data yang dikirim:", {
                nama_depan: formData.nama_depan,
                nama_belakang: formData.nama_belakang,
                no_telepon: formData.no_telepon,
                email: formData.email,
                foto: foto ? foto.name : null,
            });

            console.log(`Updating karyawan with id: ${id}`);
            const response = await axios.post(`/api/karyawan/${id}`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Accept": "application/json",
                },
                withCredentials: true,
            });

            console.log("Update response:", response.data);
            router.visit('/admin/karyawan');
        } catch (e: any) {
            setError(e.response?.data.message || e.response?.data.errors?.email?.[0] || "Gagal mengupdate karyawan");
            console.error("Error updating karyawan:", e.response?.data || e);
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleCancel = () => {
        router.visit('/admin/karyawan');
    };

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Edit Karyawan</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4 h-fit">
                    <h2 className="text-lg font-semibold mb-4">Data Karyawan</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block font-medium mb-2">Nama Depan</label>
                            <input
                                type="text"
                                name="nama_depan"
                                value={formData.nama_depan}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-2">Nama Belakang</label>
                            <input
                                type="text"
                                name="nama_belakang"
                                value={formData.nama_belakang}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-2">Nomor HP</label>
                            <input
                                type="text"
                                name="no_telepon"
                                value={formData.no_telepon}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2"
                                required
                            />
                        </div>
                    </form>
                </div>

                <div className="bg-white h-fit rounded-lg shadow-md p-4">
                    <h2 className="text-lg font-semibold mb-4">Foto Profil</h2>
                    <label className="block font-medium mb-2">Foto Profil</label>
                    <div className="border-2 border-gray-200 rounded-xl p-4 text-center text-gray-500 relative">
                        <input
                            type="file"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={handleFotoChange}
                            className="hidden"
                            id="fotoInput"
                        />
                        <div
                            className="relative"
                            onClick={() => document.getElementById("fotoInput")?.click()}
                        >
                            {(fotoPreview || initialFoto) && (
                                <div className="relative">
                                    <img
                                        src={fotoPreview || initialFoto}
                                        alt="Foto Profil"
                                        className="w-full h-72 object-cover rounded-xl cursor-pointer"
                                    />
                                    <div
                                        className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium rounded-xl"
                                    >
                                        Ganti Gambar
                                    </div>
                                </div>
                            )}
                        </div>
                        {!fotoPreview && !initialFoto && (
                            <label
                                htmlFor="fotoInput"
                                className="font-medium cursor-pointer"
                            >
                                Seret dan jatuhkan berkas anda atau{" "}
                                <span className="text-pink">Jelajahi</span>
                            </label>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6 flex gap-2">
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-pink text-white px-4 py-2 rounded-lg font-semibold"
                    disabled={updateLoading}
                >
                    {updateLoading ? "Memproses..." : "Simpan"}
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-white border border-gray-300 text-gray-700 p-2 rounded-md font-semibold"
                >
                    Batal
                </button>
            </div>

            {error && <p className="text-center text-red-600 mt-4">{error}</p>}
        </AdminLayout>
    );
}