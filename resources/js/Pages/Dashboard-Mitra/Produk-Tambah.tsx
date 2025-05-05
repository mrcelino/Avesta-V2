import { Link, router } from "@inertiajs/react";
import AdminLayout from "./Components/AdminLayout";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import axios from "axios";

// State awal untuk form data
const initialData = {
    jenis_unggas: "",
    deskripsi: "",
    harga_per_kg: "",
    stok: "",
    foto_unggas: null as File | null,
    id_warung: "", 
};

// Komponen InputField 
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
                    <label
                        htmlFor={name}
                        className="relative block cursor-pointer"
                    >
                        <img
                            src={preview}
                            alt={`Preview ${label}`}
                            className="w-full max-h-80 object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 rounded-xl">
                            <span className="text-white font-medium">
                                Ganti Gambar
                            </span>
                        </div>
                    </label>
                ) : (
                    <label htmlFor={name} className="cursor-pointer">
                        Seret atau{" "}
                        <span className="text-pink font-medium">Jelajahi</span>
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

interface Warung {
    id_warung: number;
    nama_warung: string;
}

export default function TambahUnggas() {
    const [formData, setFormData] = useState(initialData);
    const [preview, setPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const [warungList, setWarungList] = useState<Warung[]>([]); 

    useEffect(() => {
        const fetchWarung = async () => {
            try {
                await axios.get("/sanctum/csrf-cookie");
                const response = await axios.get<Warung[]>("/api/toko");
                setWarungList(response.data);
            } catch (error: any) {
                console.error("Gagal fetch data warung:", error);
                setWarungList([]);
            }
        };

        fetchWarung();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        const newValue = files
            ? files[0] || null
            : name === "stok"
            ? value.replace(/\D/g, "")
            : name === "harga_per_kg"
            ? value.replace(/[^0-9.]/g, "")
            : value;

        setFormData((prev) => ({ ...prev, [name]: newValue }));
        if (files)
            setPreview(
                newValue instanceof File ? URL.createObjectURL(newValue) : null
            );
        setErrors((prev) => ({ ...prev, [name]: [] }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null) data.append(key, value as string | Blob);
        });

        // Ambil id_warung dari hasil fetch (misalnya ambil yang pertama)
        const id_warung = warungList.length > 0 ? warungList[0].id_warung.toString() : "";
        data.append("id_warung", id_warung);

        try {
            await axios.get("/sanctum/csrf-cookie");
            await axios.post("/api/tambah-unggas", data, {
                headers: { Accept: "application/json" },
            });
            setFormData(initialData);
            setPreview(null);
            setErrors({});
            router.visit("/admin/produk");
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                alert("Gagal menambah unggas. Silakan coba lagi.");
            }
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-[610px]">
                <h1 className="text-2xl font-bold mb-4">Tambah Produk</h1>
                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
                        <h2 className="text-lg font-semibold">Data Produk</h2>
                        <InputField
                            label="Nama"
                            name="jenis_unggas"
                            value={formData.jenis_unggas}
                            onChange={handleChange}
                            error={errors.jenis_unggas}
                            required
                        />
                        <InputField
                            label="Harga"
                            name="harga_per_kg"
                            value={formData.harga_per_kg}
                            onChange={handleChange}
                            error={errors.harga_per_kg}
                            type="number"
                            required
                        />
                        <InputField
                            label="Deskripsi"
                            name="deskripsi"
                            value={formData.deskripsi}
                            onChange={handleChange}
                            error={errors.deskripsi}
                        />
                        <InputField
                            label="Stok"
                            name="stok"
                            value={formData.stok}
                            onChange={handleChange}
                            error={errors.stok}
                            type="number"
                            required
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow-md h-fit p-4">
                        <h2 className="text-lg font-semibold mb-2">
                            Foto Unggas
                        </h2>
                        <InputField
                            label="Foto"
                            name="foto_unggas"
                            value={formData.foto_unggas}
                            onChange={handleChange}
                            error={errors.foto_unggas}
                            type="file"
                            preview={preview}
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2 flex gap-2">
                        <button
                            type="submit"
                            className="bg-pink text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition"
                        >
                            Buat
                        </button>
                        <Link
                            href="/admin/produk"
                            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-semibold"
                        >
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}