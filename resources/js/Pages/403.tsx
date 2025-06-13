import React from "react";

export default function Forbidden() {
    return (
        <div
            className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center text-center px-4"
            style={{ backgroundImage: "url('/image/bghero.png')" }}
        >
            <h1 className="text-9xl font-extrabold text-white mb-6">403</h1>
            <h2 className="text-3xl font-semibold mb-4 text-white">
                Maaf, Anda Tidak Memiliki Akses
            </h2>
            <p className="text-white mt-2 max-w-md drop-shadow-sm">
                Halaman yang Anda coba akses tidak dapat dibuka karena Anda
                tidak memiliki izin.
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
