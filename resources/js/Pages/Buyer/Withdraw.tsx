import { useState, useEffect } from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import axios from "axios";
import { formatIDR } from "@/Components/NavbarUser";

interface User {
    saldo: number;
}

export default function Withdraw() {
    const [localUser, setLocalUser] = useState<User | null>(null);
    const [nominal, setNominal] = useState("");
    const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Tambah state error

    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log("Fetching user data in Withdraw...");
                const response = await axios.get("/api/me", {
                    withCredentials: true,
                });
                console.log("User data fetched:", response.data.user);
                setLocalUser(response.data.user);
            } catch (error) {
                console.error("Failed to fetch user in Withdraw:", error);
                setLocalUser(null);
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    window.location.href = "/login";
                }
            }
        };

        fetchUser();
    }, []);

    const handleSetNominal = (amount: string) => {
        const numericValue = parseInt(amount.replace("rb", "000"), 10);
        if (!isNaN(numericValue)) {
            console.log("Setting nominal to:", numericValue);
            setNominal(numericValue.toString());
            setSelectedAmount(amount);
            setErrorMessage(null); // Reset error pas pilih nominal
        }
    };

    const handleConfirmWithdraw = async () => {
        console.log("handleConfirmWithdraw called - nominal:", nominal, "localUser:", localUser);
        const convertedAmount = parseInt(nominal, 10);
        if (!isNaN(convertedAmount) && localUser) {
            try {
                console.log("Confirming withdraw:", convertedAmount);
                const response = await axios.post(
                    "/api/withdraw",
                    { amount: convertedAmount },
                    { withCredentials: true }
                );
                console.log("Withdraw response:", response.data);
                setLocalUser(response.data.user); // Update saldo
                setNominal("");
                setSelectedAmount(null);
                setErrorMessage(null); // Reset error kalo sukses
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    console.error("Withdraw failed:", error.response.data);
                    setErrorMessage(error.response.data.message); // Tampilin pesan error dari backend
                } else {
                    console.error("Withdraw failed:", error);
                    setErrorMessage("Terjadi kesalahan, coba lagi.");
                }
            }
        } else {
            console.log("Withdraw skipped - invalid amount or no user:", { convertedAmount, localUser });
        }
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
                        {localUser ? formatIDR(localUser.saldo) : "Rp 0,00"}
                    </h2>
                    <h2 className="flex font-semibold text-black justify-end pr-2 text-lg mt-4">
                        Withdraw
                    </h2>

                    {errorMessage && (
                        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                    )}

                    <input
                        type="text"
                        value={nominal ? Number(nominal).toLocaleString("id-ID") : ""}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^\d]/g, "");
                            console.log("Input changed, new nominal:", value);
                            setNominal(value);
                            setSelectedAmount(null);
                            setErrorMessage(null); // Reset error pas ketik
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
                            onClick={handleConfirmWithdraw}
                            className="btn w-1/2 bg-pink text-white font-semibold py-2 px-4 rounded-2xl"
                            disabled={!nominal || !localUser}
                        >
                            Konfirmasi
                        </button>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}