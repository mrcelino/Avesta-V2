import { Link, router } from "@inertiajs/react";
import AdminLayout from "./Components/AdminLayout";
import { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";

// State awal dan default values digabung
const initialData = {
    nama_warung: "",
    alamat_warung: "",
    foto_warung: null as File | null,
    kelurahan: "",
    deskripsi: "",
    nomor_hp: "",
    kecamatan: "Mlati",
    kode_pos: "55284",
    kota: "Kabupaten Sleman",
};

// Komponen InputField disederhanain
const InputField = ({
    label,
    name,
    value,
    onChange,
    error,
    type = "text",
    required,
    preview,
}: {
    label: string;
    name: string;
    value: string | File | null;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string[];
    type?: "text" | "file" | "number";
    required?: boolean;
    preview?: string | null;
}) => (
    <div className="space-y-1">
        <label className="block font-medium">{label}</label>
        {type === "file" ? (
            <div className="border-2 border-gray-200 rounded-xl p-4 text-center text-gray-500">
                <input
                    type="file"
                    name={name}
                    onChange={onChange}
                    className="hidden"
                    id={name}
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                />
                {preview ? (
                    <label htmlFor={name} className="relative block cursor-pointer">
                        <img src={preview} alt={`Preview ${label}`} className="w-full max-h-80 object-cover rounded-xl" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 rounded-xl">
                            <span className="text-white font-medium">Ganti Gambar</span>
                        </div>
                    </label>
                ) : (
                    <label htmlFor={name} className="cursor-pointer">
                        Seret atau <span className="text-pink font-medium">Jelajahi</span>
                    </label>
                )}
            </div>
        ) : (
            <input
                type={type}
                name={name}
                value={value as string}
                onChange={onChange}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2"
                required={required}
            />
        )}
        {error && <p className="text-red-500 text-sm">{error[0]}</p>}
    </div>
);

export default function TokoTambah() {
    const [formData, setFormData] = useState(initialData);
    const [preview, setPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        if (files) {
            const file = files[0] || null;
            setFormData((prev) => ({ ...prev, [name]: file }));
            setPreview(file ? URL.createObjectURL(file) : null);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        setErrors((prev) => ({ ...prev, [name]: [] }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) data.append(key, value as string | Blob);
        });

        try {
            await axios.get('/sanctum/csrf-cookie');
            await axios.post("/api/tambah-toko", data, {
                headers: { "Accept": "application/json" },
            });
            setFormData(initialData);
            setPreview(null);
            setErrors({});
            router.visit("/admin/toko");
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                alert("Gagal menambah toko. Silakan coba lagi.");
            }
        }
    };

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Tambah Toko</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
                    <h2 className="text-lg font-semibold">Data Toko</h2>
                    <InputField label="Nama" name="nama_warung" value={formData.nama_warung} onChange={handleChange} error={errors.nama_warung} required />
                    <InputField label="Deskripsi" name="deskripsi" value={formData.deskripsi} onChange={handleChange} error={errors.deskripsi} />
                    <InputField label="Nomor HP" name="nomor_hp" value={formData.nomor_hp} onChange={handleChange} error={errors.nomor_hp} type="number" />
                    <InputField label="Alamat" name="alamat_warung" value={formData.alamat_warung} onChange={handleChange} error={errors.alamat_warung} required />
                    <InputField label="Kelurahan" name="kelurahan" value={formData.kelurahan} onChange={handleChange} error={errors.kelurahan} />
                </div>

                <div className="bg-white rounded-lg shadow-md h-fit p-4">
                    <h2 className="text-lg font-semibold mb-2">Foto Toko</h2>
                    <InputField label="Foto" name="foto_warung" value={formData.foto_warung} onChange={handleChange} error={errors.foto_warung} type="file" preview={preview} />
                </div>

                <div className="col-span-1 md:col-span-2 flex gap-2">
                    <button type="submit" className="bg-pink text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition">
                        Buat
                    </button>
                    <Link href="/admin/toko" className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-semibold">
                        Batal
                    </Link>
                </div>
            </form>
        </AdminLayout>
    );
}