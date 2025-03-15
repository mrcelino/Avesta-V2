import { useEffect, useState } from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import { Link } from "@inertiajs/react";
import { formatIDR } from "@/Components/NavbarUser";
import axios from "axios";

interface User {
    saldo: number;
}

interface HistoryPayment {
    id_history_payment: number;
    tanggal_history: string;
    status_history: string;
    tipe_transaksi: string;
    wallet_payment: number; // Sesuai tabel
    id_user: number;
    id_order: number | null;
    id_payment: number | null;
}

export default function Wallet() {
    const [localUser, setLocalUser] = useState<User | null>(null);
    const [history, setHistory] = useState<HistoryPayment[]>([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                console.log("Fetching user data in Wallet...");
                const response = await axios.get("/api/me", {
                    withCredentials: true,
                });
                console.log("User data fetched:", response.data.user);
                setLocalUser(response.data.user);
            } catch (error) {
                console.error("Failed to fetch user in Wallet:", error);
                setLocalUser(null);
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    window.location.href = "/login";
                }
            }
        };

        const fetchHistory = async () => {
            try {
                console.log("Fetching transaction history...");
                const response = await axios.get("/api/history", {
                    withCredentials: true,
                });
                console.log("History data fetched:", response.data.data);
                setHistory(response.data.data);
            } catch (error) {
                console.error("Failed to fetch history:", error);
            }
        };

        fetchUser();
        fetchHistory();
    }, []);

    return (
        <AuthLayout>
            <div className="container max-w-full min-h-screen w-full">
                <div className="relative flex items-center justify-center bg-slate-200 min-h-96 w-full bg-hero-bg">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-[90%] min-h-56 rounded-t-[40px] bg-[#F99BA98C]">
                        <div className="flex items-center justify-between p-8">
                            <div className="flex flex-col items-start gap-5 justify-center">
                                <div className="flex space-x-4">
                                    <img
                                        src="/image/coin2.svg"
                                        alt="Coin Icon"
                                        className="size-8 object-cover"
                                    />
                                    <h2 className="text-2xl text-white font-medium">
                                        AvestaPay
                                    </h2>
                                </div>
                                <div className="flex space-x-4">
                                    <h2 className="text-2xl text-white font-medium">
                                        {localUser ? formatIDR(localUser.saldo) : "Rp 0,00"}
                                    </h2>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <Link
                                    href="/topup"
                                    className="btn bg-white text-pink text-lg rounded-xl font-semibold hover:scale-105 transition duration-300"
                                >
                                    Topup
                                </Link>
                                <Link
                                    href="/withdraw"
                                    className="btn bg-white text-pink text-lg rounded-xl font-semibold hover:scale-105 transition duration-300"
                                >
                                    Tarik
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 absolute bottom-0 left-0 w-full min-h-40 bg-white rounded-t-[40px] rounded-b-[40px] border-2 shadow-sm translate-y-1/2 px-8 py-6">
                            <h2 className="font-semibold text-pink text-lg">
                                Riwayat Transaksi
                            </h2>
                            {history.length > 0 ? (
                                history.map((transaction) => (
                                    <div key={transaction.id_history_payment} className="flex justify-between">
                                        <div className="flex flex-col">
                                            <h2 className="font-semibold">
                                                {transaction.tipe_transaksi === "top-up"
                                                    ? "Topup"
                                                    : transaction.tipe_transaksi === "penarikan"
                                                    ? "Withdraw"
                                                    : "Pembayaran"}
                                            </h2>
                                            <h2 className="text-[#B7B6B6] font-semibold text-sm">
                                                {new Date(transaction.tanggal_history).toLocaleDateString(
                                                    "id-ID",
                                                    { day: "numeric", month: "long", year: "numeric" }
                                                )}
                                            </h2>
                                        </div>
                                        <h2
                                            className={`font-medium ${
                                                transaction.tipe_transaksi === "top-up"
                                                    ? "text-[#30B666]"
                                                    : "text-red-500"
                                            }`}
                                        >
                                            {transaction.tipe_transaksi === "top-up"
                                                ? `+${formatIDR(transaction.wallet_payment)}`
                                                : `-${formatIDR(transaction.wallet_payment)}`}
                                        </h2>
                                    </div>
                                ))
                            ) : (
                                <p className="text-[#B7B6B6]">Tidak ada riwayat transaksi</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}