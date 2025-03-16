import { useState, useEffect } from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import axios from "axios";
import { formatIDR } from "@/Components/NavbarUser";
import { useAuth } from "@/Layouts/AuthLayout"; 

interface User {
    saldo: number;
    password: string;
    id_user: number;
    nama_depan: string;
    nama_belakang: string;
    email: string;
    role: string;
}

// Komponen Anak untuk Konten Topup
const TopupContent: React.FC = () => {
    const { user, setUser } = useAuth();
    const [nominal, setNominal] = useState("");
    const [selectedAmount, setSelectedAmount] = useState<string | null>(null);

    const handleSetNominal = (amount: string) => {
        const numericValue = parseInt(amount.replace("rb", "000"), 10);
        if (!isNaN(numericValue)) {
            console.log("Setting nominal to:", numericValue);
            setNominal(numericValue.toString());
            setSelectedAmount(amount);
        }
    };

    const handleConfirmTopup = async () => {
        console.log("handleConfirmTopup called - nominal:", nominal, "user:", user); // Debug
        const convertedAmount = parseInt(nominal, 10);
        if (!isNaN(convertedAmount) && user) {
            try {
                console.log("Confirming topup:", convertedAmount);
                const response = await axios.post(
                    "/api/topup",
                    { amount: convertedAmount },
                    { withCredentials: true }
                );
                console.log("Topup response:", response.data);
                // Update user di context setelah topup sukses
                if (response.data.user) {
                    setUser(response.data.user); // Update saldo di context
                }
                setNominal("");
                setSelectedAmount(null);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error("Topup failed:", error.response?.data || error.message);
                } else {
                    console.error("Topup failed:", error);
                }
            }
        } else {
            console.log("Topup skipped - invalid amount or no user:", { convertedAmount, user });
        }
    };
    return (
        <div className="flex flex-col justify-center min-h-screen">
            <div className="flex flex-col justify-start mx-auto min-h-96 w-[45%]">
                <div className="flex flex-row items-center gap-4">
                    <img src="/image/coin.svg" alt="Coin Icon" className="size-5 object-cover" />
                    <h2 className="text-xl font-semibold">AvestaPay</h2>
                </div>
                <h2 className="font-semibold text-[#717171] text-lg mt-2">
                    {user ? formatIDR(user.saldo) : "Rp 0,00"}
                </h2>
                <h2 className="flex font-semibold text-black justify-end pr-2 text-lg mt-4">
                    Top Up
                </h2>

                <input
                    type="text"
                    value={nominal ? Number(nominal).toLocaleString("id-ID") : ""}
                    onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, "");
                        console.log("Input changed, new nominal:", value);
                        setNominal(value);
                        setSelectedAmount(null);
                    }}
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
                        disabled={!nominal}
                    >
                        Konfirmasi
                    </button>
                </div>
            </div>
        </div>
    );
};

// Komponen Utama Topup sebagai Wrapper
export default function Topup() {
    return (
        <AuthLayout>
            <TopupContent />
        </AuthLayout>
    );
}