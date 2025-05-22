import { Link, router } from "@inertiajs/react";
import AdminLayout from "./Components/AdminLayout";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import axios from "axios";

// Deklarasi Leaflet
declare let L: any;

// State awal dengan tambahan latitude dan longitude
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
    latitude: "",
    longitude: "",
};

// Komponen InputField (sesuai dengan TokoEdit.tsx)
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
    const [isMapOpen, setIsMapOpen] = useState(false);

    useEffect(() => {
        if (!isMapOpen) return;

        const lat = parseFloat(formData.latitude) || -6.2;
        const lng = parseFloat(formData.longitude) || 106.816666;

        const redIcon = new L.Icon({
            iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
        });

        const map = L.map("map").setView([lat, lng], 15);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

        const marker = L.marker([lat, lng], { icon: redIcon, draggable: true }).addTo(map);

        marker.on("dragend", () => {
            const { lat, lng } = marker.getLatLng();
            setFormData((prev) => ({
                ...prev,
                latitude: lat.toFixed(8),
                longitude: lng.toFixed(8),
            }));
        });

        map.on("click", (e: any) => {
            const { lat, lng } = e.latlng;
            marker.setLatLng([lat, lng]);
            setFormData((prev) => ({
                ...prev,
                latitude: lat.toFixed(8),
                longitude: lng.toFixed(8),
            }));
        });

        return () => {
            map.remove();
        };
    }, [isMapOpen]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, files } = e.target;
        const newValue = files ? files[0] : name === "nomor_hp" ? value.replace(/\D/g, "") : value;
        setFormData((prev) => ({ ...prev, [name]: newValue }));
        if (files) setPreview(files[0] ? URL.createObjectURL(files[0]) : null);
        setErrors((prev) => ({ ...prev, [name]: [] }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== "") data.append(key, value as string | Blob);
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

    const fields = ["nama_warung", "deskripsi", "nomor_hp", "alamat_warung", "kelurahan"];

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Tambah Toko</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
                    <h2 className="text-lg font-semibold">Data Toko</h2>
                    {fields.map((field) => (
                        <InputField
                            key={field}
                            label={field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                            name={field}
                            value={formData[field as keyof typeof formData]}
                            onChange={handleChange}
                            error={errors[field]}
                            required={field === "nama_warung" || field === "alamat_warung"}
                        />
                    ))}
                </div>

                <div className="bg-white h-fit rounded-lg shadow-md p-4">
                    <h2 className="text-lg font-semibold mb-2">Foto & Lokasi Toko</h2>
                    <InputField
                        label="Foto"
                        name="foto_warung"
                        value={formData.foto_warung}
                        onChange={handleChange}
                        error={errors.foto_warung}
                        type="file"
                        preview={preview}
                    />
                    <button
                        type="button"
                        onClick={() => setIsMapOpen(true)}
                        className="text-center mt-4 bg-pink w-full p-2 rounded-xl font-bold text-white"
                    >
                        Pilih Lokasi Toko
                    </button>
                    {formData.latitude && formData.longitude && (
                        <p className="mt-2 text-sm text-gray-600 hidden">
                            Koordinat: {formData.latitude}, {formData.longitude}
                        </p>
                    )}
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

            {isMapOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-4 w-full max-w-3xl">
                        <div id="map" className="w-full h-[450px] rounded-xl mb-4" />
                        <div className="flex justify-center gap-6">
                            <button
                                onClick={() => setIsMapOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg font-semibold w-52"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => setIsMapOpen(false)}
                                className="px-4 py-2 bg-pink text-white rounded-lg font-semibold w-52"
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