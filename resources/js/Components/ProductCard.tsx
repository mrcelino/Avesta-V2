import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";

interface Product {
  id_unggas: number;
  jenis_unggas: string;
  deskripsi: string;
  penjualan: number;
  harga_per_kg: string;
  stok: number;
  foto_unggas: string;
  created_at: string;
  warung: {
    id_warung: number;
    nama_warung: string;
    alamat_warung: string;
    kelurahan: string;
  };
}

const ProductCard = ({ product }: { product: Product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add("modal-active");
    } else {
      document.body.classList.remove("modal-active");
    }
    return () => {
      document.body.classList.remove("modal-active");
    };
  }, [isModalOpen]);

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return `Rp${numPrice.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const handleAddToCart = () => {
    console.log(`Added product ${product.id_unggas} to cart`);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md border p-3">
        <img
          alt={`Image of ${product.jenis_unggas}`}
          className="rounded-xl w-full h-64 object-cover"
          height="400"
          src={`/storage/${product.foto_unggas}`}
          width="600"
        />
        <div className="py-2">
          <h2 className="text-base font-medium">{product.jenis_unggas}</h2>
          <p className="text-lg font-semibold">{formatPrice(product.harga_per_kg)}</p>
          {product.warung ? (
            <Link href={`/warungs/${product.warung.id_warung}`} className="text-sm">
              {product.warung.nama_warung}
            </Link>
          ) : (
            <p className="text-sm">Warung tidak tersedia</p>
          )}
          <div className="flex items-center text-sm mt-2 gap-2">
            <img alt="Location Icon" className="w-5" src="/vector/Pin.svg" />
            <span className="font-medium">
              {product.warung?.kelurahan ?? "Kelurahan tidak tersedia"}
            </span>
            <span className="text-black font-medium">
              • {product.penjualan} Terjual
            </span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <button
              className="bg-pink w-full text-white px-4 py-2 rounded-2xl font-semibold hover:bg-pink"
              onClick={() => setIsModalOpen(true)}
            >
              Pesan
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl p-6">
            <button
              className="btn btn-sm btn-circle text-xl btn-ghost absolute right-2 top-2 text-pink"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="text-lg font-bold mb-2">Detail Produk</h3>
            <div className="flex border-2 border-slate-200 rounded-2xl p-4">
              <div className="w-1/2">
                <img
                  alt={`Image of ${product.jenis_unggas}`}
                  className="w-full h-full rounded-lg object-cover"
                  src={`/storage/${product.foto_unggas}`}
                />
              </div>
              <div className="ml-4 w-1/2 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-2">{product.jenis_unggas}</h2>
                  <p className="font-normal">{product.deskripsi}</p>
                  <p className="text-xl font-semibold mt-2 mb-2">
                    {formatPrice(product.harga_per_kg)}
                  </p>
                  <p>{product.warung.nama_warung}</p>
                  <div className="flex items-center mt-1">
                    <i className="fas fa-map-marker-alt text-pink mr-1"></i>
                    <span className="font-semibold">
                      0.28 km {product.penjualan} Terjual
                    </span>
                  </div>
                  <p className="mt-1">Stok: {product.stok}</p>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="bg-pink text-white w-full py-2 font-semibold rounded-2xl mt-4"
                >
                  Tambah ke keranjang
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}></div>
        </div>
      )}
    </>
  );
};

export { ProductCard };
export type { Product };