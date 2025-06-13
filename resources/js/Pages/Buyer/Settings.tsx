import { useEffect, useState } from "react";
import AuthLayout, { useAuth } from "@/Layouts/AuthLayout";
import axios from "axios";

interface FormData {
  nama_depan: string;
  nama_belakang: string;
  email: string;
  alamat: string;
  jenis_kelamin: string;
  no_telepon: string | null;
  tanggal_lahir: string | null;
  foto: File | null;
}

export default function Settings() {
  return (
    <AuthLayout>
      <SettingsContent />
    </AuthLayout>
  );
}

function SettingsContent() {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    nama_depan: "",
    nama_belakang: "",
    email: "",
    alamat: "",
    jenis_kelamin: "",
    no_telepon: null,
    tanggal_lahir: null,
    foto: null,
  });

  const [previewFoto, setPreviewFoto] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nama_depan: user.nama_depan || "",
        nama_belakang: user.nama_belakang || "",
        email: user.email || "",
        alamat: user.alamat || "",
        jenis_kelamin: user.jenis_kelamin || "",
        no_telepon: user.no_telepon || null,
        tanggal_lahir: user.tanggal_lahir || null,
        foto: null,
      });
      setPreviewFoto(user.foto ? `/storage/${user.foto}` : null);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value || null }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, foto: file }));
      setPreviewFoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdateLoading(true);
    setShowSuccessModal(false);
    setShowErrorModal(false);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });

    try {
      const response = await axios.post(`/api/settings/${user.id_user}`, data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = response.data.user;
      if (updatedUser) {
        setUser(updatedUser);
      }

      setShowSuccessModal(true);
    } catch (error: any) {
      setShowErrorModal(true);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  if (!user) {
    return (
      <div className="container min-h-screen pt-24 mx-36 mb-20 flex justify-center items-center">
        <p className="text-lg font-semibold text-red-600">
          Pengguna tidak ditemukan. Silakan login ulang.
        </p>
      </div>
    );
  }

  return (
    <div className="container min-h-screen pt-24 mx-36 mb-20">
      <h2 className="text-xl font-semibold mb-4">Pengaturan</h2>
      <div className="w-full min-h-96 border-2 rounded-2xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Biodata Diri</h2>
        <form onSubmit={handleSubmit} className="flex space-x-5">
          <div className="w-1/3 min-h-96 rounded-xl border-2 shadow-sm flex flex-col space-y-3 text-gray-400 p-4">
            <div className="h-3/4 border-2 w-full rounded-xl flex items-center justify-center">
              {previewFoto ? (
                <img src={previewFoto} alt="Preview" className="h-full w-full object-cover rounded-xl" />
              ) : (
                <span>Pilih foto untuk preview</span>
              )}
            </div>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange}
              className="hidden"
              id="fotoUpload"
            />
            <label
              htmlFor="fotoUpload"
              className="px-4 py-2 bg-pink text-white rounded-lg font-semibold text-center cursor-pointer"
            >
              Upload Foto
            </label>
            <h2 className="text-[#555555] text-sm">
              Besar file: maksimum 10.000.000 bytes (10 Megabytes). Ekstensi file yang diperbolehkan: .JPG .JPEG .PNG
            </h2>
          </div>

          <div className="w-full min-h-96 rounded-xl">
            <div className="flex flex-col space-y-4 text-sm">
              <div className="flex space-x-4">
                <label className="w-1/3 font-semibold items-center flex">Nama Depan</label>
                <input
                  type="text"
                  name="nama_depan"
                  value={formData.nama_depan}
                  onChange={handleChange}
                  className="w-2/3 border-[3px] border-pink rounded-lg px-2 py-1"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <label className="w-1/3 font-semibold items-center flex">Nama Belakang</label>
                <input
                  type="text"
                  name="nama_belakang"
                  value={formData.nama_belakang}
                  onChange={handleChange}
                  className="w-2/3 border-[3px] border-pink rounded-lg px-2 py-1"
                />
              </div>
              <div className="flex space-x-4">
                <label className="w-1/3 font-semibold items-center flex">Tanggal Lahir</label>
                <input
                  type="date"
                  name="tanggal_lahir"
                  value={formData.tanggal_lahir || ""}
                  onChange={handleChange}
                  className="w-2/3 border-[3px] border-pink rounded-lg px-2 py-1"
                />
              </div>
              <div className="flex space-x-4">
                <label className="w-1/3 font-semibold items-center flex">Jenis Kelamin</label>
                <select
                  name="jenis_kelamin"
                  value={formData.jenis_kelamin}
                  onChange={handleChange}
                  className="w-2/3 border-[3px] border-pink rounded-lg px-2 py-1"
                >
                  <option value="">Pilih</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div className="flex space-x-4">
                <label className="w-1/3 font-semibold items-center flex">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-2/3 border-[3px] border-pink rounded-lg px-2 py-1"
                  required
                />
              </div>
              <div className="flex space-x-4">
                <label className="w-1/3 font-semibold items-center flex">Nomor HP</label>
                <input
                  type="tel"
                  name="no_telepon"
                  value={formData.no_telepon || ""}
                  onChange={handleChange}
                  className="w-2/3 border-[3px] border-pink rounded-lg px-2 py-1"
                />
              </div>
              <div className="flex space-x-4">
                <label className="w-1/3 font-semibold items-center flex">Alamat</label>
                <input
                  type="text"
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                  className="w-2/3 border-[3px] border-pink rounded-lg px-2 py-1"
                />
              </div>
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-pink text-white rounded-lg font-semibold disabled:opacity-50"
                  disabled={updateLoading}
                >
                  {updateLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Modal sukses */}
        {showSuccessModal && (
          <dialog open className="modal bg-black/40">
            <div className="flex flex-col justify-center items-center modal-box max-w-xl bg-pink rounded-2xl p-6 text-center relative">
              <button
                onClick={handleSuccessModalClose}
                className="btn btn-md btn-circle btn-ghost text-white absolute right-2 top-2 hover:text-pink transition duration-300"
              >
                ✕
              </button>
              <h3 className="text-3xl text-white font-bold max-w-sm text-center">
                Perubahan berhasil disimpan
              </h3>
              <img className="mx-auto -mt-12 w-96 mb-10" src="/image/cancel.png" alt="Sukses" />
            </div>
          </dialog>
        )}

        {/* Modal error */}
        {showErrorModal && (
          <div className="modal modal-open">
            <div className="modal-box bg-pink relative">
              <button
                onClick={() => setShowErrorModal(false)}
                className="btn btn-sm btn-circle btn-ghost text-white absolute right-2 top-2 hover:text-pink transition duration-300"
              >
                ✕
              </button>
              <h3 className="text-3xl font-bold text-white mb-4 text-center">Perubahan gagal disimpan</h3>
              <img className="px-12 py-8 mx-auto" src="/image/gagal.png" alt="Gagal" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
