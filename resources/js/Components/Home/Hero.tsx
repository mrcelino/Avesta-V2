import React from "react";

const Hero = () => {
    return (
        <section
            className="relative text-white overflow-hidden flex items-center justify-center bg-cover min-h-screen"
            style={{
                backgroundImage: "url('/image/bghero.png')",
            }}
        >
            <div className="hidden md:block absolute top-16 left-0 w-96">
                <img
                    src="/image/kiriatas.png"
                    alt="Kiri Atas"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="absolute top-16 right-0 w-96">
                <img
                    src="/image/kananatas.png"
                    alt="Kanan Atas"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="absolute bottom-0.5 left-0 w-[450px]">
                <img
                    src="/image/kiribawah.png"
                    alt="Kiri Bawah"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="hidden md:block absolute bottom-0 right-0 w-96">
                <img
                    src="/image/kananbawah.png"
                    alt="Kanan Bawah"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
                <div className="flex justify-center md:flex-row items-center">
                    <div className="w-full mb-12 md:mb-0 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mt-20 mb-6 leading-20">
                            Temukan Ayam Potong <br /> dengan Harga Terbaik di
                            Avesta
                        </h1>
                        <p className="text-lg md:text-xl mb-8 text-white leading-normal">
                            Avesta memudahkan Anda mencari ayam potong dengan
                            harga terbaik di desa <br />
                            Kami bermitra dengan penjual unggas terpilih untuk
                            menawarkan harga yang kompetitif setiap hari.
                        </p>
                    </div>
                </div>
            </div>
            <div className="hidden md:block absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[500px]">
                <img
                    src="/image/tengah.png"
                    alt="Gambar di Tengah"
                    className="w-full h-auto object-contain"
                />
            </div>
        </section>
    );
};

export default Hero;
