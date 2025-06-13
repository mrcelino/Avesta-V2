import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import axios from 'axios';

type Errors = {
  nama_depan?: string;
  nama_belakang?: string;
  email?: string;
  no_telepon?: string;
  password?: string;
};

const Register = () => {
  const { url } = usePage();
  const [form, setForm] = useState({
    nama_depan: '',
    nama_belakang: '',
    email: '',
    no_telepon: '',
    password: '',
    password_confirmation: '',
    role: 'user', // Default role
  });
  const [errors, setErrors] = useState<Errors>({});
  const [processing, setProcessing] = useState(false);

  // Ambil role dari query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mitraParam = urlParams.has('mitra');
    if (mitraParam) {
      setForm((prev) => ({ ...prev, role: 'mitra' }));
    } else {
      setForm((prev) => ({ ...prev, role: 'user' }));
    }
  }, [url]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});

    try {
      await axios.post('/api/auth/register', form);
      window.location.href = '/login';
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      }
      console.error('Error saat registrasi:', error.response?.data || error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen text-black p-4 md:p-0"
      style={{ backgroundImage: `url('/image/bghero.png')` }}
    >
      <div className="bg-white rounded-3xl shadow-lg md:p-12 flex" style={{ width: '1000px' }}>
        <div className="w-5/12 hidden md:flex items-center justify-center rounded-3xl bg-[#F99BA9]">
          <img
            alt="Illustration of two people shaking hands with documents flying around"
            className="rounded-lg p-10"
            height={400}
            src="/image/register.png"
            width={400}
          />
        </div>
        <div className="w-full md:w-7/12 md:pl-16 p-3">
          <img
            alt="Avesta logo"
            className="mb-4 mx-auto"
            height={40}
            src="/image/avesta.png"
            width={100}
          />
          <h1 className="text-sm md:text-2xl font-bold mb-2 text-center">Yuk, Gabung dengan Avesta!</h1>
          <p className="text-xs md:text-base mb-6 font-medium text-center">
            Dapatkan harga ayam potong paling oke dan rasakan mudahnya pesan online setiap hari!
          </p>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  className="border border-gray-300 rounded-2xl text-xs md:text-base p-3 pl-4 bg-cInput w-full"
                  placeholder="Nama Depan"
                  type="text"
                  value={form.nama_depan}
                  onChange={(e) => setForm({ ...form, nama_depan: e.target.value })}
                  required
                />
                {errors.nama_depan && <span className="text-red-500 text-sm">{errors.nama_depan}</span>}
              </div>
              <div>
                <input
                  className="border border-gray-300 rounded-2xl text-xs md:text-base p-3 pl-4 bg-cInput w-full"
                  placeholder="Nama Belakang"
                  type="text"
                  value={form.nama_belakang}
                  onChange={(e) => setForm({ ...form, nama_belakang: e.target.value })}
                  required
                />
                {errors.nama_belakang && <span className="text-red-500 text-sm">{errors.nama_belakang}</span>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  className="border border-gray-300 rounded-2xl text-xs md:text-base p-3 pl-4 bg-cInput w-full"
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
              </div>
              <div>
                <input
                  className="border border-gray-300 rounded-2xl text-xs md:text-base p-3 pl-4 bg-cInput w-full"
                  placeholder="Nomor HP"
                  type="text"
                  value={form.no_telepon}
                  onChange={(e) => setForm({ ...form, no_telepon: e.target.value })}
                  required
                />
                {errors.no_telepon && <span className="text-red-500 text-sm">{errors.no_telepon}</span>}
              </div>
            </div>
            <div className="mb-4">
              <input
                className="border border-gray-300 rounded-2xl text-xs md:text-base p-3 pl-4 bg-cInput w-full"
                placeholder="Sandi"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
            </div>
            <div className="mb-4">
              <input
                className="border border-gray-300 rounded-2xl text-xs md:text-base p-3 pl-4 bg-cInput w-full"
                placeholder="Konfirmasi Kata Sandi"
                type="password"
                value={form.password_confirmation}
                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                required
              />
            </div>
            <div className="mb-4 flex items-center">
              <input id="terms" type="checkbox" className="mr-2 rounded-full" required />
              <label htmlFor="terms" className="text-xs md:text-sm  font-medium md:font-semibold">
                Saya setuju dengan semua ketentuan dan kebijakan privasi
              </label>
            </div>
            <button
              type="submit"
              className="bg-pink text-white rounded-2xl p-2 text-sm md:text-base w-full font-medium"
              disabled={processing}
            >
              {processing ? 'Memproses...' : 'Buat Akun'}
            </button>
          </form>
          <p className="text-center text-xs md:text-sm mt-4 md:mt-10">
            Sudah punya akun?{' '}
            <Link href="/login" className="text-heading">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;