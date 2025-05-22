import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { router } from '@inertiajs/react';

import axios from "axios";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [step, setStep] = useState<"email" | "code" | "reset">("email");
    const [countdown, setCountdown] = useState(30);
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (step === "code" && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown, step]);

    const maskEmail = (email: string) => {
        if (!email.includes("@")) return email;
        const [user, domain] = email.split("@");
        const maskedUser = user[0] + "*".repeat(Math.max(user.length - 1, 0));
        const domainParts = domain.split(".");
        const maskedDomain = domainParts[0][0] + "*".repeat(Math.max(domainParts[0].length - 1, 0));
        return `${maskedUser}@${maskedDomain}.${domainParts[1]}`;
    };

    const handleCodeChange = (value: string, index: number) => {
        const newCode = [...code];
        newCode[index] = value.slice(0, 1);
        setCode(newCode);
        if (value && index < 5) {
            const next = document.getElementById(`code-${index + 1}`) as HTMLInputElement;
            next?.focus();
        }
    };

    // Step 1: Kirim token ke email
    const sendToken = async () => {
        setLoading(true);
        setError(null);
        try {
            await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
            const response = await axios.post("/api/forgot-password", { email }, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                withCredentials: true,
            });
            setStep("code");
            setCountdown(30);
            setCode(["", "", "", "", "", ""]);
        } catch (e: any) {
            setError(e.response?.data.message || "Terjadi kesalahan saat mengirim token");
            console.error("Error sendToken:", e.response?.data || e);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verifikasi token
    const verifyToken = async () => {
        setLoading(true);
        setError(null);
        try {
            const tokenString = code.join("");
            if (tokenString.length !== 6) {
                setError("Kode verifikasi harus 6 digit");
                setLoading(false);
                return;
            }

            const response = await axios.post("/api/verify-token", { email, token: tokenString }, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                withCredentials: true,
            });

            setStep("reset");
        } catch (e: any) {
            setError(e.response?.data.message || "Token tidak valid");
            console.error("Error verifyToken:", e.response?.data || e);
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset password
    const resetPassword = async () => {
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Password dan konfirmasi password tidak cocok");
            setLoading(false);
            return;
        }

        try {
            const tokenString = code.join("");
            const response = await axios.post("/api/reset-password", {
                email,
                token: tokenString,
                password,
                password_confirmation: confirmPassword,
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                withCredentials: true,
            });

            router.visit('/login');
            setStep("email");
            setEmail("");
            setCode(["", "", "", "", "", ""]);
            setPassword("");
            setConfirmPassword("");
        } catch (e: any) {
            setError(e.response?.data.message || "Gagal reset password");
            console.error("Error resetPassword:", e.response?.data || e);
        } finally {
            setLoading(false);
        }
    };

    const resendToken = async () => {
        if (countdown > 0) return;
        await sendToken();
    };

    return (
        <div
            className="bg-pink flex items-center justify-center min-h-screen text-black"
            style={{ backgroundImage: `url('/image/bghero.png')` }}
        >
            <div
                className="bg-white rounded-3xl shadow-lg p-12 flex min-h-[600px] w-4/6"
            >
                <div className="w-5/12 hidden md:flex items-center justify-center rounded-3xl bg-[#F99BA9]">
                    <img
                        alt="Illustration"
                        className="rounded-lg p-4"
                        height={400}
                        src="/image/login.png"
                        width={400}
                    />
                </div>
                <div className="w-7/12 pl-16 flex flex-col justify-center">
                    <img
                        alt="Avesta logo"
                        className="mb-4 mx-auto"
                        height={40}
                        src="/image/avesta.png"
                        width={100}
                    />

                    {error && (
                        <p className="text-center text-red-600 mb-4">{error}</p>
                    )}

                    {step === "email" && (
                        <>
                            <h1 className="text-2xl font-bold mb-2 text-center">
                                Lupa Password?
                            </h1>
                            <p className="mb-6 text-center">
                                Masukkan alamat email yang Anda gunakan untuk <br />
                                menerima kode verifikasi.
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    sendToken();
                                }}
                            >
                                <div className="mb-4">
                                    <input
                                        className="border border-gray-300 rounded-2xl p-2 w-full bg-cInput"
                                        placeholder="Email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-pink text-white rounded-2xl p-2 w-full font-medium"
                                >
                                    {loading ? "Loading..." : "Kirim Kode Verifikasi"}
                                </button>
                            </form>
                        </>
                    )}

                    {step === "code" && (
                        <>
                            <h1 className="text-2xl font-bold mb-2 text-center">
                                Masukkan Kode Verifikasi
                            </h1>
                            <p className="mb-6 text-center">
                                Kode verifikasi telah dikirim melalui e-mail ke <br />
                                <span className="text-pink">{maskEmail(email)}</span>.
                            </p>
                            <div className="flex justify-between gap-2 mb-6">
                                {code.map((c, i) => (
                                    <input
                                        key={i}
                                        id={`code-${i}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={c}
                                        onChange={(e) => handleCodeChange(e.target.value, i)}
                                        className="w-14 h-12 text-center border border-gray-300 rounded-2xl text-lg font-semibold bg-[#F4F4F4]"
                                    />
                                ))}
                            </div>
                            <button
                                disabled={loading}
                                className="bg-pink text-white rounded-2xl p-2 w-full font-medium"
                                onClick={verifyToken}
                            >
                                {loading ? "Loading..." : "Selanjutnya"}
                            </button>

                            <p className="text-sm text-center mt-4">
                                Mohon tunggu dalam{" "}
                                <span className="text-pink font-semibold">
                                    {countdown} detik
                                </span>{" "}
                              untuk <button  disabled={countdown > 0 || loading} onClick={resendToken} className="text-pink font-semibold">kirim ulang kode.</button>
                            </p>
                        </>
                    )}

                    {step === "reset" && (
                        <>
                            <h1 className="text-2xl font-bold mb-2 text-center">
                                Buat Ulang Kata Sandi
                            </h1>
                            <p className="mb-6 text-center">
                                Masukkan kata sandi baru Anda, pastikan terdiri lebih dari 8 karakter
                                terdapat angka, simbol, dan huruf kapital.
                            </p>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    resetPassword();
                                }}
                            >
                                <div className="mb-4">
                                    <input
                                        className="border border-gray-300 rounded-2xl p-2 w-full bg-cInput"
                                        placeholder="Email"
                                        type="email"
                                        value={email}
                                        readOnly
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        className="border border-gray-300 rounded-2xl p-2 w-full bg-cInput"
                                        placeholder="Kata Sandi Baru"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        className="border border-gray-300 rounded-2xl p-2 w-full bg-cInput"
                                        placeholder="Konfirmasi Kata Sandi"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-pink text-white rounded-2xl p-2 w-full font-medium mt-4"
                                >
                                    {loading ? "Loading..." : "Buat Ulang Kata Sandi"}
                                </button>
                            </form>
                        </>
                    )}

                    <p className="text-center text-sm mt-32">
                        Ingat password?{" "}
                        <Link href="/login" className="text-heading">
                            Kembali ke Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}