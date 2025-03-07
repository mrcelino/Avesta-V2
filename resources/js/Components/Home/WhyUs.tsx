import React from "react";

const Whyus = () => {
  const features = [
    {
      img: "/vector/Price.png",
      title: "Harga kompetitif",
      desc: "Dapatkan informasi harga ayam potong dari berbagai penjual secara real-time."
    },
    {
      img: "/vector/Secure.png",
      title: "Pembayaran Aman",
      desc: "Gunakan Avesta Coin untuk transaksi yang praktis dan terjamin."
    },
    {
      img: "/vector/Quality.png",
      title: "Kualitas Terjamin",
      desc: "Kami hanya bekerja sama dengan penjual unggas terpilih dan terpercaya."
    },
    {
      img: "/vector/Easily.png",
      title: "Kemudahan Pemesanan",
      desc: "Pesan langsung dari website kami dengan proses yang cepat dan mudah."
    },
    {
      img: "/vector/Pickup.png",
      title: "Pengambilan Mandiri",
      desc: "Ambil pesanan Anda langsung di toko penjual pilihan Anda."
    },
    {
      img: "/vector/Feedback.png",
      title: "Ulasan Pelanggan",
      desc: "Bantu komunitas dengan memberikan ulasan setelah setiap transaksi."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-pink p-6 rounded-3xl shadow-md flex items-center"
        >
          <div className="hidden md:flex bg-white p-4 rounded-2xl mr-4 items-center w-36 h-24">
            <img className="text-4xl mx-auto object-cover" src={feature.img} alt={feature.title} />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-semibold text-white mb-2">{feature.title}</h2>
            <p className="text-white">{feature.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Whyus;
