import { Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "./Components/AdminLayout";
import { useState, useEffect } from "react";
import axios from "axios";

interface ProdukEditPageProps {
    id_unggas?: number;
    app_url?: string;
}

const InputField = ({ label, name, value, onChange, error, type = "text", required, preview }: {
    label: string;
    name: string;
    value: string | File | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string[];
    type?: string;
    required?: boolean;
    preview?: string | null;
}) => (
    <div className="space-y-1">
        <label className="block font-medium">{label}</label>
        {type === "file" ? (
            <div className="border-2 border-gray-200 rounded-xl p-4 text-center text-gray-500">
                <input type="file" name={name} onChange={onChange} className="hidden" id={name} accept="image/jpeg,image/png,image/jpg,image/webp" />
                <label htmlFor={name} className="cursor-pointer">
                    {preview ? (
                        <div className="relative block">
                            <img src={preview} alt={`Preview ${label}`} className="w-full max-h-80 object-cover rounded-xl" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 rounded-xl">
                                <span className="text-white font-medium">Ganti Gambar</span>
                            </div>
                        </div>
                    ) : (
                        <>Seret atau <span className="text-pink font-medium">Jelajahi</span></>
                    )}
                </label>
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

export default function ProdukEdit() {
    const { id_unggas} = usePage().props as ProdukEditPageProps;
    const [formData, setFormData] = useState({
        jenis_unggas: "",
        deskripsi: "",
        harga_per_kg: "",
        stok: "",
        foto_unggas: null as File | null,
    });
    const [preview, setPreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
    const [status, setStatus] = useState<"loading" | "error" | "success">("loading");

    useEffect(() => {
        if (!id_unggas) return setStatus("error");

        axios.get("/sanctum/csrf-cookie")
            .then(() => axios.get(`/api/unggas/${id_unggas}`))
            .then(({ data }) => {
                setFormData({
                    jenis_unggas: data.jenis_unggas || "",
                    deskripsi: data.deskripsi || "",
                    harga_per_kg: data.harga_per_kg || "",
                    stok: data.stok.toString() || "",
                    foto_unggas: null,
                });
                setPreview(data.foto_unggas ? `/storage/${data.foto_unggas}` : null);
                setStatus("success");
            })
            .catch((error) => {
                console.error("Error:", error);
                setStatus("error");
            });
    }, [id_unggas]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        const newValue = files ? files[0] : name === "stok" ? value.replace(/\D/g, "") : name === "harga_per_kg" ? value.replace(/[^0-9.]/g, "") : value;
        setFormData((prev) => ({ ...prev, [name]: newValue }));
        if (files) setPreview(URL.createObjectURL(files[0]));
        setErrors((prev) => ({ ...prev, [name]: [] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id_unggas) return setErrors({ form: ["ID unggas tidak ditemukan."] });

        const data = new FormData();
        Object.entries(formData).forEach(([key, val]) => val && data.append(key, val as string | Blob));
        try {
            await axios.get("/sanctum/csrf-cookie");
            await axios.post(`/api/update-produk/${id_unggas}`, data, { headers: { "Accept": "application/json" } });
            router.visit("/admin/produk");
        } catch (error: any) {
            setErrors(error.response?.data?.errors || {});
        }
    };

    const fields = [
        { key: "jenis_unggas", label: "Nama" },
        { key: "harga_per_kg", label: "Harga" },
        { key: "deskripsi", label: "Deskripsi" },
        { key: "stok", label: "Stok" },
    ];

    if (status !== "success") {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-screen">
                    <p className={status === "loading" ? "text-gray-500" : "text-red-500"}>
                        {status === "loading" ? "Memuat data..." : "Gagal memuat data produk."}
                    </p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="min-h-[610px]">
                <h1 className="text-2xl font-bold mb-4">Edit Produk</h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white h-fit rounded-lg shadow-md p-4 space-y-4">
                        <h2 className="text-lg font-semibold">Data Produk</h2>
                        {fields.map(({ key, label }) => (
                            <InputField
                                key={key}
                                label={label}
                                name={key}
                                value={formData[key as keyof typeof formData]}
                                onChange={handleChange}
                                error={errors[key]}
                                type={key === "stok" || key === "harga_per_kg" ? "number" : "text"}
                                required={key === "jenis_unggas" || key === "harga_per_kg" || key === "stok"}
                            />
                        ))}
                    </div>
                    <div className="bg-white rounded-lg shadow-md h-fit p-4">
                        <h2 className="text-lg font-semibold mb-2">Foto Produk</h2>
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
                        <button type="submit" className="bg-pink text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition">
                            Simpan
                        </button>
                        <Link href="/admin/produk" className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-semibold">
                            Batal
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}