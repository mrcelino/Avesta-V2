import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import { FormEvent } from "react";

type Errors = {
    email?: string[];
    password?: string[];
};

const Login = ({ errors }: { errors: Errors }) => {
    const { data, setData } = useForm({
        email: "",
        password: "",
    });

    const [apiErrors, setApiErrors] = useState<Errors>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);
    
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                throw result;
            }
    
            const { user, token } = result; // Ambil token dari respons
    
            if (token) {
                localStorage.setItem("token", token); // Simpan token ke localStorage
            }
    
            // ✅ Redirect berdasarkan role
            const redirectPaths: Record<string, string> = {
                pemilik: "/mitra",
                karyawan: "/karyawan",
                default: "/dashboard",
            };
    
            window.location.href = redirectPaths[user.role] ?? redirectPaths.default;
        } catch (error: any) {
            setApiErrors(error.errors || {});
        } finally {
            setProcessing(false);
        }
    };
    

    return (
        <div
            className="bg-pink flex items-center justify-center min-h-screen text-black"
            style={{ backgroundImage: `url('/image/bghero.png')` }}
        >
            <div
                className="bg-white rounded-3xl shadow-lg p-12 flex"
                style={{ width: "1000px" }}
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
                <div className="w-7/12 pl-16">
                    <img
                        alt="Avesta logo"
                        className="mb-4 mx-auto"
                        height={40}
                        src="/image/avesta.png"
                        width={100}
                    />
                    <h1 className="text-2xl font-bold mb-2 text-center">
                        Yuk, Gabung dengan Avesta!
                    </h1>
                    <p className="mb-6 font-semibold text-center">
                        Dapatkan harga ayam potong paling oke dan <br /> rasakan
                        mudahnya pesan online setiap hari!
                    </p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input
                                className="border border-gray-300 rounded-2xl p-2 w-full bg-cInput"
                                placeholder="Email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
                            />
                            {apiErrors.email && (
                                <span className="text-danger">
                                    {apiErrors.email.join(", ")}
                                </span>
                            )}
                        </div>
                        <div className="mb-4">
                            <input
                                className="border border-gray-300 rounded-2xl p-2 w-full bg-cInput"
                                placeholder="Sandi"
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="mb-4 mx-1 flex items-center">
                            <input
                                id="terms"
                                type="checkbox"
                                className="mr-2"
                            />
                            <label
                                htmlFor="terms"
                                className="text-sm font-semibold"
                            >
                                Ingat saya
                            </label>
                            <Link
                                href="/forgotpassword"
                                className="ml-auto text-sm text-heading"
                            >
                                Lupa Password
                            </Link>
                        </div>
                        <button
                            type="submit"
                            className="bg-pink text-white rounded-2xl p-2 w-full font-medium"
                            disabled={processing}
                        >
                            {processing ? "Memproses..." : "Login"}
                        </button>
                    </form>
                    <p className="text-center text-sm mt-40">
                        Belum punya akun?{" "}
                        <Link href="/register" className="text-heading">
                            Daftar
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
