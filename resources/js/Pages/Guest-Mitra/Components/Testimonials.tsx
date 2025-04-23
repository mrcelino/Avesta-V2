import { useState, useEffect } from "react";

const testimonialsData = [
  [
    {
      image: "image/mitra1.png",
      review:
        "Avesta benar-benar mempermudah hidup saya! Saya bisa mendapatkan ayam potong dengan harga terbaik tanpa harus keliling pasar.",
      name: "Mila Suryani",
      job: "Ibu Rumah Tangga",
    },
    {
      image: "image/mitra2.png",
      review:
        "Dengan Avesta, saya tidak perlu lagi repot-repot menawar. Semua harga transparan, proses pesan cepat, dan tinggal ambil di penjual.",
      name: "Rudi Santoso",
      job: "Karyawan Swasta",
    },
  ],
  [
    {
      image: "image/mitra3.png",
      review:
        "Avesta sangat membantu dalam keseharian saya. Dulu harus berkeliling, sekarang semua mudah dalam satu aplikasi.",
      name: "Ratna Pratiwi",
      job: "Pekerja Kantoran",
    },
    {
      image: "image/mitra4.png",
      review:
        "Dengan Avesta, saya bisa pesan ayam potong dengan cepat tanpa perlu tawar-menawar di pasar. Sangat praktis!",
      name: "Agus Wijaya",
      job: "Pengemudi Ojek Online",
    },
  ],
  [
    {
      image: "image/mitra5.png",
      review:
        "Harga yang transparan di Avesta membuat saya tenang berbelanja, tanpa khawatir ada tambahan biaya tak terduga.",
      name: "Budi Hartono",
      job: "Wiraswasta",
    },
    {
      image: "image/mitra6.png",
      review:
        "Sebagai ibu rumah tangga, Avesta sangat membantu saya menghemat waktu berbelanja. Harga jelas dan prosesnya cepat!",
      name: "Siti Aminah",
      job: "Ibu Rumah Tangga",
    },
  ],
  [
    {
      image: "image/mitra7.png",
      review:
        "Waktu saya lebih efisien dengan Avesta. Tak perlu keluar kantor untuk belanja bahan masak. Semua tinggal pesan dan ambil!",
      name: "Andini Putri",
      job: "Aparatur Sipil Negara",
    },
    {
      image: "image/mitra8.png",
      review:
        "Avesta memudahkan saya untuk mendapatkan ayam segar dengan harga yang pasti. Tak perlu lagi repot di pasar.",
      name: "Sri Mulyani",
      job: "Ibu Rumah Tangga",
    },
  ],
];
export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState(testimonialsData[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % testimonialsData.length;
        setCards(testimonialsData[newIndex]);
        return newIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="opacity-100 transition-opacity duration-1000">
        <div className="hidden md:flex w-full gap-4 mx-auto mt-20 h-[415px] justify-center">
          {cards.map((card, index) => (
            <div
              key={index}
              className="border-2 rounded-3xl shadow-md overflow-hidden flex w-1/2 h-full transition-all duration-500 ease-in-out transform"
            >
              <div className="w-1/3">
                <img
                  className="h-full w-full object-cover transition-transform duration-500 ease-in-out"
                  src={card.image}
                  alt="Gambar Toko"
                />
              </div>
              <div className="w-2/3 p-8 flex flex-col py-2">
                <p className="text-heading mt-12 text-xl">{card.review}</p>
                <h3 className="mt-32 text-heading font-bold text-2xl">{card.name}</h3>
                <h3 className="mt-2 text-heading">{card.job}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex space-x-2 mt-4">
        {testimonialsData.map((_, index) => (
          <span
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setCards(testimonialsData[index]);
            }}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all duration-300 ${
              currentIndex === index ? "bg-pink" : "bg-red-300"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}