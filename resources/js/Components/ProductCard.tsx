import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { useCart } from "@/Layouts/AuthLayout";

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
    foto_warung: string;
    latitude: string | null;
    longitude: string | null;
  };
}

const ProductCard = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State untuk pesan error
  const { addToCart, showSwitchStoreModal, setShowSwitchStoreModal, clearCart, checkStoreMatch } = useCart();

  useEffect(() => {
    if (showSwitchStoreModal) {
      setIsModalOpen(false);
    }

    if (isModalOpen || showSwitchStoreModal) {
      document.body.classList.add("modal-active");
    } else {
      document.body.classList.remove("modal-active");
    }

    return () => {
      document.body.classList.remove("modal-active");
    };
  }, [isModalOpen, showSwitchStoreModal]);

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return `Rp${numPrice.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const handleIncrease = () => setQuantity(quantity + 1); // Tidak cek stok
  const handleDecrease = () => setQuantity(Math.max(1, quantity - 1));

  const handleAddToCart = () => {
    if (quantity > product.stok) {
      setErrorMessage(`Stok hanya ${product.stok}. Tidak bisa memesan lebih!`);
      setTimeout(() => setErrorMessage(null), 3000); // Hilangkan error setelah 3 detik
      return;
    }
    addToCart(product, quantity);
    setQuantity(1);
    setIsModalOpen(false);
    setErrorMessage(null); // Reset error
  };

  const handleClearCartAndAdd = () => {
    clearCart();
    setShowSwitchStoreModal(false);
    setIsModalOpen(true);
  };

  const handleOrderClick = () => {
    const isStoreMatch = checkStoreMatch(product);
    if (isStoreMatch) {
      setIsModalOpen(true);
    } else {
      setShowSwitchStoreModal(true);
    }
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
          <h3 className="text-base font-medium">{product.jenis_unggas}</h3>
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
              onClick={handleOrderClick}
            >
              Pesan
            </button>
          </div>
        </div>
      </div>

      {/* Modal Detail Produk */}
      {isModalOpen && (
        <div className="modal modal-open z-50">
          <div className="modal-box max-w-3xl p-6 bg-white shadow-lg">
            <button
              className="btn btn-sm btn-circle text-xl btn-ghost absolute right-2 top-2 text-pink"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-2">Detail Produk</h3>
            <div className="flex border-2 border-slate-200 rounded-2xl p-4">
              <div className="w-1/2">
                <img
                  alt={`Image of ${product.jenis_unggas}`}
                  className="w-full h-full rounded-xl object-cover"
                  src={`/storage/${product.foto_unggas}`}
                />
              </div>
              <div className="ml-4 w-1/2 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{product.jenis_unggas}</h3>
                  <p className="font-normal">{product.deskripsi}</p>
                  <p className="text-xl font-semibold mt-2 mb-2">
                    {formatPrice(product.harga_per_kg)}
                  </p>
                  <p>{product.warung.nama_warung}</p>
                  <div className="flex items-center mt-1">
                    <span className="font-semibold">
                      {product.penjualan} Terjual
                    </span>
                  </div>
                  <p className="mt-1">Stok: {product.stok}</p>
                  <div className="flex flex-row space-x-2 mt-2 mb-4">
                    <div
                      onClick={handleDecrease}
                      className="flex items-center justify-center rounded-lg border-2 size-8 text-xl text-gray-400 cursor-pointer"
                    >
                      -
                    </div>
                    <div className="flex grow items-center justify-center rounded-lg border-2 size-8 text-base">
                      {quantity}
                    </div>
                    <div
                      onClick={handleIncrease}
                      className="flex items-center justify-center rounded-lg border-2 size-8 text-xl text-gray-400 cursor-pointer"
                    >
                      +
                    </div>
                  </div>
                </div>
                <div>
                  {/* Pesan Error */}
                  {errorMessage && (
                    <p className="text-red-500 text-sm mb-2 text-center">{errorMessage}</p>
                  )}
                  <button
                    onClick={handleAddToCart}
                    className="bg-pink text-white w-full py-2 font-semibold rounded-xl"
                  >
                    Tambah ke keranjang
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}></div>
        </div>
      )}

      {/* Modal Konfirmasi Ganti Toko */}
      {showSwitchStoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/5"
            onClick={() => setShowSwitchStoreModal(false)}
          ></div>
          <div className="flex flex-col gap-4 items-center justify-center relative bg-white rounded-3xl max-w-xl w-full p-6 shadow-lg">
            <button
              className="btn btn-circle text-xl btn-ghost absolute right-2 top-2 text-pink"
              onClick={() => setShowSwitchStoreModal(false)}
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-800 mt-4">
              Apakah Anda ingin beralih ke toko ini?
            </h3>
            <img src="/image/moveToko.png" alt="Avesta Logo" className="w-80"></img>
            <h3 className="flex text-sm text-center max-w-md mt-4">
              Jika ya, kami akan menyesuaikan pesanan dengan menghapus produk sebelumnya. Mohon konfirmasinya
            </h3>
            <div className="flex w-full justify-between space-x-2">
              <button
                onClick={() => setShowSwitchStoreModal(false)}
                className="btn btn-sm btn-outline w-1/2 text-pink hover:bg-gray-100 rounded-xl border-pink border-2"
              >
                Batal
              </button>
              <button
                onClick={handleClearCartAndAdd}
                className="btn btn-sm w-1/2 bg-pink text-white hover:bg-pink rounded-xl"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { ProductCard };
export type { Product };