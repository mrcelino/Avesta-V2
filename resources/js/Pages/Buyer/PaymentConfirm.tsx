import React, { useState, useEffect } from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import axios from "axios";
import { useAuth, useCart } from "@/Layouts/AuthLayout";

interface User {
    saldo: number;
    password: string; // Password hashed dari database
    id_user: number; // Untuk foreign key di order
}

// Komponen Anak untuk Konten PaymentConfirm
const PaymentContent: React.FC = () => {
    const [password, setPassword] = useState("");
    const [showErrorModal, setShowErrorModal] = useState(false); // Untuk password salah
    const [showInsufficientModal, setShowInsufficientModal] = useState(false); // Untuk saldo gak cukup
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showOrderErrorModal, setShowOrderErrorModal] = useState(false); // Modal untuk error saat create order
    const [errorMessage, setErrorMessage] = useState(""); // Simpan pesan error
    const { user } = useAuth(); // Ambil user dari context
    const { cart, cartTotal, clearCart } = useCart(); // Ambil cart, cartTotal, dan clearCart


    const handleCancel = () => {
        setPassword("");
    };

    const handleVerify = async () => {
        if (!user) return; // Jangan jalankan kalo context belum siap

        console.log("Verifying password:", password);
        try {
            // Validasi password lewat API
            let response;
            try {
                response = await axios.post(
                    "/api/verify-password",
                    { password },
                    { withCredentials: true }
                );
            } catch (verifyError: any) {
                if (verifyError.response) {
                    console.log("Verify password error:", verifyError.response.data);
                    // Semua error dari /api/verify-password (termasuk 401, 500) pake modal Kata Sandi Salah
                    setShowErrorModal(true);
                    return;
                }
                throw verifyError; // Lempar error lain ke catch utama
            }

            if (!response.data.success) {
                console.log("Password verification failed:", response.data);
                setShowErrorModal(true); // Password salah dari response
                return;
            }

            // Password bener, cek saldo vs cartTotal
            if (parseFloat(cartTotal) > parseFloat(user.saldo)) {
                console.log("Saldo insufficient:", { cartTotal, saldo: user.saldo });
                setShowInsufficientModal(true); // Saldo gak cukup
                return;
            }

            console.log("Payment confirmed:", { cartTotal, saldo: user.saldo });
            // Buat order kalo pembayaran berhasil
            const orderData = {
                id_user: user.id_user,
                id_warung: cart.length > 0 ? cart[0].warung.id_warung : null, // Ambil id_warung dari cart
                tanggal_order: new Date().toISOString().split("T")[0], // Tanggal hari ini
                total_harga: parseFloat(cartTotal),
                status_order: "processed",
                order_items: cart.map((item) => ({
                    id_unggas: item.id_unggas,
                    jumlah_kg: item.quantity,
                    harga_total_per_item: parseFloat(item.harga_per_kg) * item.quantity,
                    catatan: item.catatan || "",
                })),
            };

            console.log("Sending order data:", orderData);

            // POST ke /api/create-order
            let orderResponse;
            try {
                orderResponse = await axios.post(
                    "/api/create-order",
                    orderData,
                    { withCredentials: true }
                );
            } catch (orderError: any) {
                if (orderError.response) {
                    console.log("Order creation error:", orderError.response.data);
                    if (orderError.response.status === 401 || orderError.response.status === 403) {
                        setErrorMessage("Unauthorized: Silakan login kembali");
                    } else if (orderError.response.status === 400) {
                        setErrorMessage(orderError.response.data.message || "Gagal memproses pembayaran");
                    } else if (orderError.response.status === 500) {
                        setErrorMessage(orderError.response.data.message || "Terjadi kesalahan pada server");
                    } else {
                        setErrorMessage("Gagal membuat order");
                    }
                    setShowOrderErrorModal(true);
                    return;
                }
                throw orderError;
            }

            if (!orderResponse.data.success) {
                console.log("Order creation failed:", orderResponse.data);
                setErrorMessage(orderResponse.data.message || "Gagal membuat order");
                setShowOrderErrorModal(true); // Tampilkan modal error
                return;
            }

            console.log("Order created:", orderResponse.data);

            // Ngosongin keranjang kalo berhasil
            clearCart();
            setShowSuccessModal(true); // Tampilkan modal sukses

        } catch (error: any) {
            // Tangkap error dari axios (kecuali yang udah dihandle di try nested)
            console.error("Error occurred:", error);
            if (error.response) {
                // Error dari server (misalnya 400, 403, 500)
                if (error.response.status === 401 || error.response.status === 403) {
                    setErrorMessage("Unauthorized: Silakan login kembali");
                } else if (error.response.status === 400) {
                    setErrorMessage(error.response.data.message || "Gagal memproses pembayaran");
                } else {
                    setErrorMessage("Terjadi kesalahan pada server");
                }
                setShowOrderErrorModal(true); // Tampilkan modal error
            } else {
                // Error jaringan atau lainnya
                setErrorMessage("Gagal terhubung ke server");
                setShowOrderErrorModal(true);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col gap-y-4 items-center justify-center">
            <h2 className="font-semibold text-xl">Masukkan Kata Sandi Akun Kamu</h2>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-48 bg-white border-pink border-2 rounded-xl size-10 px-2 focus:border-pink"
                maxLength={8}
            />
            <div className="flex flex-row mt-7 gap-5">
                <button
                    onClick={handleCancel}
                    className="btn border-2 border-pink bg-white hover:bg-pink hover:text-white w-56 text-pink font-semibold py-2 px-4 rounded-2xl transition duration-300"
                >
                    Batal
                </button>
                <button
                    onClick={handleVerify}
                    className="btn w-56 bg-pink text-white hover:bg-pink font-semibold py-2 px-4 rounded-2xl"
                    disabled={!user} // Disable tombol kalo belum siap
                >
                    Konfirmasi
                </button>
            </div>

            {/* Modal Password Salah */}
            {showErrorModal && (
                <div className="modal modal-open">
                    <div className="modal-box bg-pink">
                        <button
                            onClick={() => setShowErrorModal(false)}
                            className="btn btn-sm btn-circle btn-ghost text-white absolute right-2 top-2 hover:text-pink transition duration-300"
                        >
                            ✕
                        </button>
                        <h3 className="text-3xl font-bold text-white mb-4 text-center">Kata Sandi Salah</h3>
                        <img className="px-12 py-8 mx-auto" src="/image/gagal.png" alt="Gagal" />
                    </div>
                </div>
            )}

            {/* Modal Saldo Tidak Mencukupi */}
            {showInsufficientModal && (
                <div className="modal modal-open">
                    <div className="modal-box bg-white">
                        <button
                            onClick={() => setShowInsufficientModal(false)}
                            className="btn btn-sm btn-circle btn-ghost text-pink absolute right-2 top-2 hover:text-white transition duration-300"
                        >
                            ✕
                        </button>
                        <h3 className="text-3xl font-bold text-pink mb-4 text-center max-w-lg">Saldo Tidak Mencukupi</h3>
                        <img className="px-12 py-8 mx-auto" src="/image/nobalance.png" alt="Saldo tidak mencukupi" />
                    </div>
                </div>
            )}

            {/* Modal Pembayaran Terkonfirmasi */}
            {showSuccessModal && (
                <div className="modal modal-open">
                    <div className="modal-box bg-pink">
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className="btn btn-sm btn-circle btn-ghost text-white absolute right-2 top-2 hover:text-pink transition duration-300"
                        >
                            ✕
                        </button>
                        <h3 className="text-3xl font-bold text-white mb-4 text-center">Pembayaran <br />Terkonfirmasi</h3>
                        <img className="px-12 py-8 mx-auto" src="/image/success.png" alt="Sukses" />
                    </div>
                </div>
            )}

            {/* Modal Error Saat Create Order */}
            {showOrderErrorModal && (
                <div className="modal modal-open">
                    <div className="modal-box bg-white">
                        <button
                            onClick={() => setShowOrderErrorModal(false)}
                            className="btn btn-sm btn-circle btn-ghost text-pink absolute right-2 top-2 hover:text-white transition duration-300"
                        >
                            ✕
                        </button>
                        <h3 className="text-3xl font-bold text-pink mb-4 text-center max-w-lg">Gagal Membuat Order</h3>
                        <p className="text-center text-pink">{errorMessage}</p>
                        <img className="px-12 py-8 mx-auto" src="/image/gagal.png" alt="Gagal" />
                    </div>
                </div>
            )}
        </div>
    );
};

// Komponen Utama PaymentConfirm sebagai Wrapper
export default function PaymentConfirm() {
    return (
        <AuthLayout>
            <PaymentContent />
        </AuthLayout>
    );
}