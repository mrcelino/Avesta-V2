import React from "react";

const Hero = () => {
  return (
    <section
      className="relative text-white overflow-hidden flex items-center justify-center bg-cover"
      style={{ backgroundImage: "url('/image/bghero.png')", height: "820px" }}
    >
      {/* Gambar di sudut */}
      <img
        data-aos="fade-down-right"
        data-aos-duration="3000"
        src="/image/hero1.png"
        alt="Kiri Atas"
        className="absolute top-0 left-0 w-56 object-cover"
      />
      <img
        data-aos="fade-down-left"
        data-aos-duration="3000"
        src="/image/hero2.png"
        alt="Kanan Atas"
        className="absolute top-16 right-0 w-72 object-cover"
      />
      <img
        data-aos="fade-up-right"
        data-aos-duration="3000"
        src="/image/hero3.png"
        alt="Kiri Bawah"
        className="absolute bottom-0.5 left-0 w-56 object-cover"
      />
      <img
        data-aos="fade-up-left"
        data-aos-duration="3000"
        src="/image/hero4.png"
        alt="Kanan Bawah"
        className="absolute bottom-0 right-0 w-56 object-cover"
      />

      {/* Konten utama */}
      <div className="container mx-auto px-4 py-24 md:py-32 relative z-10 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mt-20 mb-6 leading-10">
          Temukan Ayam Potong <br />dengan Harga Terbaik di Avesta
        </h1>
        <p className="text-xl mb-8 text-white leading-normal">
          Avesta memudahkan Anda mencari ayam potong dengan harga terbaik di desa <br />
          Kami bermitra dengan penjual unggas terpilih untuk menawarkan harga yang
          kompetitif setiap hari.
        </p>

        {/* Form Pencarian */}
        <div className="bg-white mx-auto rounded-3xl border-2 shadow-xl p-8 w-full max-w-md">
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

      {/* Gambar di Tengah */}
      <img
        data-aos="fade-up"
        data-aos-duration="3000"
        src="/image/hero5.png"
        alt="Gambar di Tengah"
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-auto object-contain"
      />
    </section>
  );
};

export default Hero;
