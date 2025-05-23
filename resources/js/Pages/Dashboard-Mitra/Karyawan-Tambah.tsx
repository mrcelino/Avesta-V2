import AdminLayout from "./Components/AdminLayout";
import { useState } from "react";
import { router } from "@inertiajs/react";
import axios from "axios";

export default function KaryawanTambah() {
    const [formData, setFormData] = useState({
        nama_depan: "",
        nama_belakang: "",
        no_telepon: "",
        email: "",
    });
    const [foto, setFoto] = useState<File | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFoto(file);
            // Generate preview URL
            const previewUrl = URL.createObjectURL(file);
            setFotoPreview(previewUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
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

            console.log("Posting karyawan data:", formData);
            const response = await axios.post("/api/karyawan", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Accept": "application/json",
                },
                withCredentials: true,
            });

            console.log("Karyawan response:", response.data);
            router.visit("/admin/karyawan");
            setFormData({ nama_depan: "", nama_belakang: "", no_telepon: "", email: "" });
            setFoto(null);
            setFotoPreview(null); // Reset preview
        } catch (e: any) {
            setError(e.response?.data.message || e.response?.data.errors?.email?.[0] || "Gagal menambahkan karyawan");
            console.error("Error posting karyawan:", e.response?.data || e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Tambah Karyawan</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Form Data Karyawan */}
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

                {/* Upload Foto Profil */}
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
                        <label
                            htmlFor="fotoInput"
                            className="font-medium cursor-pointer"
                        >
                            Seret dan jatuhkan berkas anda atau{" "}
                            <span className="text-pink">Jelajahi</span>
                        </label>
                        {fotoPreview && (
                            <div className="mt-4">
                                <img
                                    src={fotoPreview}
                                    alt="Preview"
                                    className="w-full h-72 object-cover rounded-2xl mx-auto"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tombol Aksi */}
            <div className="mt-6 flex gap-2">
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-pink text-white px-4 py-2 rounded-lg font-semibold"
                    disabled={loading}
                >
                    {loading ? "Memproses..." : "Buat"}
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setFormData({ nama_depan: "", nama_belakang: "", no_telepon: "", email: "" });
                        setFoto(null);
                        setFotoPreview(null); // Reset preview
                        setError(null);
                    }}
                    className="bg-white border border-gray-300 text-gray-700 p-2 rounded-md font-semibold"
                >
                    Batal
                </button>
            </div>

            {error && <p className="text-center text-red-600 mt-4">{error}</p>}
        </AdminLayout>
    );
}