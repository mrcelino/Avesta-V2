import React from "react";
import GuestLayout from "../../Layouts/GuestLayout";

const Product = () => {
    return (
        <GuestLayout>
            <div className="flex items-center justify-center bg-hero-bg min-h-screen pt-20">
                <div className="bg-white rounded-3xl shadow-lg p-12 min-w-[1000px]">
                    <div className="justify-center items-center">
                        <h1 className="text-center text-pink text-3xl font-bold text-pink-600 mb-4">
                            Temukan Ayam Terbaik di Sekitar Anda
                        </h1>
                        <p className="text-center text-pink mb-8 font-medium leading-7">
                            Telusuri berbagai pilihan daging ayam dari mitra
                            terbaik kami di daerah Anda. <br />
                            Dengan harga yang kompetitif dan kualitas terjamin,
                            temukan ayam potong segar <br />
                            setiap hari. Pilih produk yang sesuai kebutuhan
                            Anda, langsung dari toko terdekat.
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { img: "/image/ayam1.png", name: "Ayam Utuh" },
                                { img: "/image/ayam2.png", name: "Dada Ayam" },
                                { img: "/image/ayam3.png", name: "Ceker Ayam" },
                                { img: "/image/ayam4.png", name: "Sayap Ayam" },
                                {
                                    img: "/image/ayam5.png",
                                    name: "Ayam Fillet",
                                },
                                { img: "/image/ayam6.png", name: "Jeroan" },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col items-center bg-white rounded-2xl border-2 shadow-md p-4 transition duration-300 hover:scale-110 cursor-pointer"
                                >
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        className="w-24 h-24 mb-2"
                                    />
                                    <p className="text-heading font-bold text-lg">
                                        {item.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
};

export default Product;
