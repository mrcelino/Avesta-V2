import React from "react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-no-repeat bg-center bg-cover flex flex-col items-center justify-center text-center px-4"
      style={{ backgroundImage: "url('/image/bghero.png')" }}
    >
      <h1 className="text-9xl font-extrabold text-white drop-shadow-lg">404</h1>
      <h2 className="text-3xl md:text-4xl font-semibold text-white mt-4 drop-shadow-md">
        Halaman Tidak Ditemukan
      </h2>
      <p className="text-white mt-2 max-w-md drop-shadow-sm">
        Maaf, halaman yang kamu cari tidak tersedia
      </p>
      <a
        href="/"
        className="mt-6 inline-block bg-white text-pink px-6 py-3 rounded-full font-semibold hover:bg-pink-dark transition"
      >
        Kembali ke Beranda
      </a>
    </div>
  );
}
