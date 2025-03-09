import { useState } from "react";
import AuthLayout from "@/Layouts/AuthLayout";

export default function Withdraw() {
  const [nominal, setNominal] = useState("");
  const [saldo, setSaldo] = useState(1000000);
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null); // Menyimpan tombol yang dipilih

  const handleSetNominal = (amount: string) => {
    const numericValue = parseInt(amount.replace("rb", "000"), 10);
    if (!isNaN(numericValue)) {
      setNominal(numericValue.toString());
      setSelectedAmount(amount); // Menandai tombol yang dipilih
    }
  };

  const handleConfirmTopup = () => {
    const convertedAmount = parseInt(nominal.replace(".", ""), 10); // Menghapus titik sebelum konversi
    if (!isNaN(convertedAmount) && convertedAmount <= saldo) {
      setSaldo(saldo - convertedAmount);
    }
    setNominal("");
    setSelectedAmount(null); // Reset pilihan setelah konfirmasi
  };

  return (
    <AuthLayout>
      <div className="flex flex-col justify-center min-h-screen">
        <div className="flex flex-col justify-start mx-auto min-h-96 w-[45%]">
          <div className="flex flex-row items-center gap-4">
            <img src="/image/coin.svg" alt="Coin Icon" className="size-5 object-cover" />
            <h2 className="text-xl font-semibold">AvestaPay</h2>
          </div>
          <h2 className="font-semibold text-[#717171] text-lg mt-2">
            Rp {saldo.toLocaleString("id-ID")}
          </h2>
          <h2 className="flex font-semibold text-black justify-end pr-2 text-lg mt-4">
            Tarik
          </h2>

          <input
            type="text"
            value={nominal ? parseInt(nominal).toLocaleString("id-ID") : ""}
            onChange={(e) => setNominal(e.target.value.replace(/\D/g, ""))} // Hanya angka yang bisa diinput
            className="border-2 border-gray-200 rounded-2xl w-full p-2 mt-4"
            placeholder="Rp"
          />

          <div className="grid grid-cols-4 gap-8 mt-4">
            {["25rb", "50rb", "75rb", "100rb"].map((amount) => (
              <button
                key={amount}
                onClick={() => handleSetNominal(amount)}
                className={`flex items-center justify-center min-h-10 border-2 rounded-2xl px-2 py-2 w-36 transition duration-300 ${
                  selectedAmount === amount ? "bg-pink text-white" : "hover:bg-pink hover:text-white"
                }`}
              >
                {amount}
              </button>
            ))}
          </div>

          <div className="flex flex-row mt-10 w-full mx-auto gap-5">
            <a
              href="#"
              className="btn border-2 border-pink bg-white hover:bg-pink hover:text-white w-1/2 text-pink font-semibold py-2 px-4 rounded-2xl"
            >
              Batal
            </a>
            <button
              onClick={handleConfirmTopup}
              className="btn w-1/2 bg-pink text-white font-semibold py-2 px-4 rounded-2xl"
            >
              Konfirmasi
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
