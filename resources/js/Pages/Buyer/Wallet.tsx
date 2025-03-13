import AuthLayout from "@/Layouts/AuthLayout";
import { Link } from "@inertiajs/react";
export default function Wallet() {
    return (
        <>
            <AuthLayout>
                <div className="container max-w-full min-h-screen w-full">
                    <div className="relative flex items-center justify-center bg-slate-200 min-h-96 w-full bg-hero-bg">
                        {/* Container untuk elemen merah dan putih */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-[90%] min-h-56 rounded-t-[40px] bg-[#F99BA98C]">
                            {/* Elemen merah */}
                            <div className="flex items-center justify-between p-8">
                                {/* Sisi Kiri */}
                                <div className="flex flex-col items-start gap-5 justify-center">
                                    <div className="flex space-x-4">
                                        <img
                                            src="/image/coin.svg"
                                            alt="Coin Icon"
                                            className="size-8 object-cover"
                                        />
                                        <h2 className="text-2xl text-white font-medium">
                                            AvestaPay
                                        </h2>
                                    </div>
                                    <div className="flex space-x-4">
                                        <h2 className="text-2xl text-white font-medium">
                                            Rp. 0,00
                                        </h2>
                                    </div>
                                </div>
                                {/* Sisi Kanan */}
                                <div className="flex space-x-4">
                                    <Link
                                        href="#"
                                        className="btn bg-white text-pink text-lg rounded-xl font-semibold hover:scale-105 transition duration-300"
                                    >
                                        Topup
                                    </Link>
                                    <Link
                                        href="#"
                                        className="btn bg-white text-pink text-lg rounded-xl font-semibold hover:scale-105 transition duration-300"
                                    >
                                        Tarik
                                    </Link>
                                </div>
                            </div>
                            {/* Elemen putih*/}
                            <div className="flex flex-col gap-4 absolute bottom-0 left-0 w-full min-h-40 bg-white rounded-t-[40px] rounded-b-[40px] border-2 shadow-sm translate-y-1/2 px-8 py-6">
                                <h2 className="font-semibold text-pink text-lg">
                                    Riwayat Transaksi
                                </h2>
                                <div className="flex justify-between">
                                    <div className="flex flex-col">
                                        <h2 className="font-semibold">
                                            Ayam Dada Fillet
                                        </h2>
                                        <h2 className="text-[#B7B6B6] font-semibold text-sm">
                                            Jumat, 28 Feb 2025
                                        </h2>
                                    </div>
                                    <h2 className="text-[#30B666] font-medium">
                                        +Rp50.000,00
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthLayout>
        </>
    );
}
