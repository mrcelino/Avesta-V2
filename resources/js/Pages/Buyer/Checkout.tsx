import React, { useRef, useState } from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import { useCart } from "@/Layouts/AuthLayout";
import { router } from "@inertiajs/react";

const CartContent: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, setNote } = useCart();

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleIncrease = (id_unggas: number) => {
    const item = cart.find((i) => i.id_unggas === id_unggas);
    if (item) updateQuantity(id_unggas, item.quantity + 1);
  };

  const handleDecrease = (id_unggas: number) => {
    const item = cart.find((i) => i.id_unggas === id_unggas);
    if (item) {
      if (item.quantity > 1) {
        updateQuantity(id_unggas, item.quantity - 1);
      } else {
        removeFromCart(id_unggas);
      }
    }
  };

  const handleAddNote = (id_unggas: number) => {
    if (inputRef.current) {
      const newNote = inputRef.current.value || "";
      setNote(id_unggas, newNote);
    }
    setOpenDropdownId(null);
  };

  const handleCancel = () => {
    setOpenDropdownId(null);
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + parseFloat(item.harga_per_kg) * item.quantity,
    0
  );

  const handleConfirm = () => {
    router.visit("/payment", { preserveState: true });
  };

  return (
    <main className="p-8 pt-28 flex space-x-8 min-h-screen">
      <div className="w-2/3">
        <h2 className="text-2xl font-semibold mb-4">Keranjang</h2>
        <div className="bg-white p-4 rounded-2xl shadow-md border">
          <div className="space-y-4">
            {cart.length === 0 ? (
              <p>Keranjang kosong</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id_unggas}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <img
                    src={`/storage/${item.foto_unggas}`} 
                    alt={item.jenis_unggas}
                    className="size-24 rounded-lg"
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="font-semibold">{item.jenis_unggas}</h3>
                    <p>{item.warung?.nama_warung || "Warung tidak tersedia"}</p>
                    <div className="flex items-center mt-4">
                      <img src="/image/note.png" alt="Note Icon" className="mr-2" />
                      <div className="relative">
                        <div
                          role="button"
                          className="font-medium cursor-pointer"
                          onClick={() =>
                            setOpenDropdownId(
                              openDropdownId === item.id_unggas ? null : item.id_unggas
                            )
                          }
                        >
                          {item.catatan || "Tambah Catatan"}
                        </div>
                        {openDropdownId === item.id_unggas && (
                          <div className="absolute flex flex-col bg-white rounded-xl shadow-lg rounded-box w-60 p-2 border-2 top-[-100px] left-20 -translate-x-1/2 z-10">
                            <input
                              ref={inputRef}
                              className="rounded-xl border-2 min-h-20 w-full border-gray-300 focus:border-pink focus:ring focus:ring-pink outline-none"
                              defaultValue={
                                item.catatan === "Tambah Catatan" || !item.catatan
                                  ? ""
                                  : item.catatan
                              }
                            />
                            <div className="flex space-x-2 p-2 items-center justify-center">
                              <button
                                className="w-1/2 border-2 btn rounded-xl font-medium cursor-pointer bg-white"
                                onClick={handleCancel}
                              >
                                Batal
                              </button>
                              <button
                                className="w-1/2 bg-pink btn text-white rounded-xl font-medium cursor-pointer"
                                onClick={() => handleAddNote(item.id_unggas)}
                              >
                                Tambah
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      Rp{(parseFloat(item.harga_per_kg) * item.quantity).toLocaleString("id-ID")}
                    </p>
                    <div className="flex space-x-3 items-center justify-center mt-2">
                      <div
                        onClick={() => handleDecrease(item.id_unggas)}
                        className="flex items-center justify-center rounded-full size-5 text-lg text-pink border-2 border-pink cursor-pointer hover:scale-110 transition duration-300"
                      >
                        -
                      </div>
                      <h2 className="font-semibold">{item.quantity}</h2>
                      <div
                        onClick={() => handleIncrease(item.id_unggas)}
                        className="flex items-center justify-center rounded-full size-5 text-lg text-pink border-2 border-pink cursor-pointer hover:scale-110 transition duration-300"
                      >
                        +
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="w-1/3">
        <div className="bg-white p-4 rounded-2xl border shadow mt-12">
          <h3 className="text-xl font-semibold mb-4">Ringkasan Belanja</h3>
          <div className="flex justify-between mb-4">
            <span>Total Belanja</span>
            <span className="font-semibold">
              Rp{totalPrice.toLocaleString("id-ID")}
            </span>
          </div>
          <button
            onClick={handleConfirm}
            className="bg-pink text-white w-full py-2 rounded-xl font-bold btn"
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </main>
  );
};

const CartSummary: React.FC = () => {
  return (
    <AuthLayout>
      <CartContent />
    </AuthLayout>
  );
};

export default CartSummary;