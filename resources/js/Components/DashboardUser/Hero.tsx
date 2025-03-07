import React from "react";

const Hero = () => {
  return (
    <section
      className="relative text-white flex items-center justify-center bg-cover"
      style={{ backgroundImage: "url('/image/bghero.png')" }}
    >
      {/* Gambar di sudut */}
      <img
        src="/image/kiriatas.png"
        alt="Kiri Atas"
        className="absolute top-16 left-0 w-96 object-cover"
      />
      <img
        src="/image/kananatas.png"
        alt="Kanan Atas"
        className="absolute top-16 right-0 w-96 object-cover"
      />
      <img
        src="/image/kiribawah.png"
        alt="Kiri Bawah"
        className="absolute bottom-0.5 left-0 w-96 object-cover"
      />
      <img
        src="/image/kananbawah.png"
        alt="Kanan Bawah"
        className="absolute bottom-0 right-0 w-96 object-cover"
      />

      {/* Konten utama */}
      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mt-20 mb-6 leading-20">
          Temukan Ayam Potong <br /> dengan Harga Terbaik di Avesta
        </h1>
        <p className="text-xl mb-8 text-white leading-normal">
          Avesta memudahkan Anda mencari ayam potong dengan harga terbaik di desa <br />
          Kami bermitra dengan penjual unggas terpilih untuk menawarkan harga yang
          kompetitif setiap hari.
        </p>

        {/* Form Pencarian */}
        <div className="absolute left-1/2 -bottom-12 z-50 bg-white rounded-3xl border-2 shadow-xl p-8 w-full max-w-md transform -translate-x-1/2">

          <h1 className="text-center text-pink text-2xl font-bold mb-6">
            Cari Daging Sekarang
          </h1>
          <form method="GET" action="/cariayam">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                name="q"
                placeholder="Daging ayam"
                className="bg-gray-100 rounded-full px-4 py-2 text-gray-400 focus:outline-hidden grow shadow-inner"
              />
              <button
                type="submit"
                className="bg-pink text-white rounded-full px-6 py-2 shadow-lg"
              >
                Cari
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;
