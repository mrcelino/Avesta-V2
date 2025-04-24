import { Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "./Components/AdminLayout";
import { useState, useEffect } from "react";
import axios from "axios";

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

export default function TokoEdit() {
  const { id_warung, app_url } = usePage().props;
  const baseUrl = `${app_url}/storage/`;
  const [formData, setFormData] = useState({
    nama_warung: "",
    alamat_warung: "",
    foto_warung: null as File | null,
    kelurahan: "",
    deskripsi: "",
    nomor_hp: "",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    axios.get("/sanctum/csrf-cookie").then(() =>
      axios.get(`/api/warungs/${id_warung}`).then(({ data }) => {
        setFormData({
          nama_warung: data.nama_warung || "",
          alamat_warung: data.alamat_warung || "",
          foto_warung: null,
          kelurahan: data.kelurahan || "",
          deskripsi: data.deskripsi || "",
          nomor_hp: data.nomor_hp || "",
        });
        setPreview(data.foto_warung ? `${baseUrl}${data.foto_warung}` : null);
      })
    );
  }, [id_warung]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    const newValue = files ? files[0] : name === "nomor_hp" ? value.replace(/\D/g, "") : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (files) setPreview(URL.createObjectURL(files[0]));
    setErrors((prev) => ({ ...prev, [name]: [] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => val && data.append(key, val as string | Blob));
    try {
      await axios.get("/sanctum/csrf-cookie");
      await axios.post(`/api/update-toko/${id_warung}`, data, { headers: { "Accept": "application/json" } });
      router.visit("/admin/toko");
    } catch (error: any) {
      setErrors(error.response?.data?.errors || {});
    }
  };

  const fields = ["nama_warung", "deskripsi", "nomor_hp", "alamat_warung", "kelurahan"];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Edit Toko</h1>
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
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-2">Foto Toko</h2>
          <InputField
            label="Foto"
            name="foto_warung"
            value={formData.foto_warung}
            onChange={handleChange}
            error={errors.foto_warung}
            type="file"
            preview={preview}
          />
        </div>
        <div className="col-span-1 md:col-span-2 flex gap-2">
          <button type="submit" className="bg-pink text-white px-4 py-2 rounded-lg font-semibold hover:scale-105 transition">
            Simpan
          </button>
          <Link href="/admin/toko" className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-semibold">
            Batal
          </Link>
        </div>
      </form>
    </AdminLayout>
  );
}