export default function OrderGuide() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { src: "/image/order1.png", text: "Cari Toko" },
        { src: "/image/order2.png", text: "Pilih Pesanan" },
        { src: "/image/order3.png", text: "Bayar Online" },
        { src: "/image/order4.png", text: "Ambil Pesanan" },
      ].map((item, index) => (
        <div
          key={index}
          className="bg-pink text-white rounded-3xl p-6 flex flex-col items-center h-[350px] md:h-auto"
        >
          <img
            alt={item.text}
            className="p-4 mt-10 md:p-10 md:mt-16 w-full h-auto object-contain"
            height="150"
            src={item.src}
            width="150"
          />
          <div className="mt-auto flex items-center justify-center bg-white text-pink rounded-full px-4 py-2 font-bold w-36 md:w-52">
            <div className="hidden md:flex items-center justify-center bg-pink text-white rounded-full w-8 h-8 mr-2">
              <span className="font-bold">{index + 1}</span>
            </div>
            {item.text}
          </div>
        </div>
      ))}
    </div>
  );
}
