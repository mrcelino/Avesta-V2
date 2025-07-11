import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthLayout from "@/Layouts/AuthLayout";
import Skeleton from "@/Components/Skeleton";
import { ProductCard, Product } from "@/Components/ProductCard";

interface ApiResponse {
    status: string;
    data: {
        current_page: number;
        data: Product[];
        last_page: number;
        total: number;
    };
}

const CariAyam = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [sortBy, setSortBy] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [kelurahan, setKelurahan] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Ambil query `kelurahan` dan `q` dari URL saat component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const lokasi = urlParams.get("kelurahan") || "";
        const q = urlParams.get("q") || "";
        setKelurahan(lokasi);
        setSearchQuery(q);
    }, []);

    // Fetch data saat sortBy, currentPage, atau searchQuery berubah
    useEffect(() => {
        fetchProducts();
    }, [sortBy, currentPage, searchQuery, kelurahan]);

    const fetchProducts = async () => {
        try {
            setLoading(true); // Set loading ke true saat mulai fetch data
            const response = await axios.get<ApiResponse>(
                `/api/unggas?page=${currentPage}&sortBy=${sortBy}&kelurahan=${encodeURIComponent(
                    kelurahan
                )}&q=${encodeURIComponent(searchQuery)}`
            );
            setProducts(response.data.data.data);
            setLastPage(response.data.data.last_page);
        } catch (error) {
            console.error("Error fetching products", error);
        }
        setLoading(false); // Setelah fetch selesai, set loading ke false
    };

    const handleSortChange = (sortOption: string) => {
        setSortBy(sortOption);
        setCurrentPage(1);
        window.history.pushState(
            {},
            "",
            `/cariayam?page=1&sortBy=${sortOption}&kelurahan=${encodeURIComponent(
                kelurahan
            )}&q=${encodeURIComponent(searchQuery)}`
        );
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.history.pushState(
            {},
            "",
            `/cariayam?page=${page}&sortBy=${sortBy}&kelurahan=${encodeURIComponent(
                kelurahan
            )}&q=${encodeURIComponent(searchQuery)}`
        );
    };

    const sortOptions = [
        { label: "Termurah", value: "asc" },
        { label: "Termahal", value: "desc" },
    ];

    const selectSortOption = (value: string) => {
        handleSortChange(value);
        setIsOpen(false);
    };

    return (
        <AuthLayout>
            <div className="container mx-auto p-4 min-h-screen">
                <div className="flex justify-between items-center mb-4 mt-20">
                    <div className="flex space-x-4 bg-c-input w-full rounded-3xl p-2">
                        <div className="px-4 py-1 flex items-center justify-center text-xl font-semibold">
                            Urutkan:
                        </div>
                        <button
                            onClick={() => handleSortChange("terbaru")}
                            className={`cursor-pointer hover:scale-105 transition duration-300 px-4 py-1 bg-white rounded-3xl shadow-md ${
                                sortBy === "terbaru"
                                    ? "border-pink border-2"
                                    : ""
                            }`}
                        >
                            Terbaru
                        </button>
                        <button
                            onClick={() => handleSortChange("terlaris")}
                            className={`cursor-pointer hover:scale-105 transition duration-300 px-4 py-1 bg-white rounded-3xl shadow-md ${
                                sortBy === "terlaris"
                                    ? "border-pink border-2"
                                    : ""
                            }`}
                        >
                            Terlaris
                        </button>
                        <div
                            onClick={() => setIsOpen(!isOpen)}
                            className="relative hover:scale-105 transition duration-300 px-4 py-1 bg-white rounded-3xl shadow-md w-full max-w-[140px] outline-none cursor-pointer flex justify-between items-center appearance-none"
                        >
                            <span>
                                {sortBy === "asc"
                                    ? "Termurah"
                                    : sortBy === "desc"
                                    ? "Termahal"
                                    : "Harga"}
                            </span>
                            <svg
                                className={`w-4 h-4 transition-transform duration-300 ${
                                    isOpen ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                            {isOpen && (
                                <div className="absolute top-8 left-1 z-10 mt-2 min-w-[140px] bg-white text-black font-medium rounded-[35px] shadow-xl px-2 py-1">
                                    <ul className="p-2">
                                        {sortOptions.map((option) => (
                                            <li
                                                key={option.value}
                                                onClick={() =>
                                                    selectSortOption(
                                                        option.value
                                                    )
                                                }
                                                className="p-2 hover:bg-pink hover:text-white rounded-full cursor-pointer transition duration-300 hover:scale-105 text-sm"
                                            >
                                                {option.label}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, index) => (
                            <Skeleton key={index} />
                        ))
                    ) : products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard
                                key={product.id_unggas}
                                product={product}
                            />
                        ))
                    ) : (
                        <p>Tidak ada produk ditemukan untuk "{searchQuery}"</p>
                    )}
                </div>

                {/* PAGINATION */}
                <div className="flex justify-center mt-6">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="btn px-4 py-2 bg-white border-heading border-2 rounded-xl mx-2 disabled:bg-gray-600 disabled:border-0 cursor-pointer hover:scale-105 transition duration-300"
                    >
                        Prev
                    </button>
                    <span className="px-4 py-2">
                        Page {currentPage} of {lastPage}
                    </span>
                    <button
                        disabled={currentPage === lastPage}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="btn px-4 py-2 text-white bg-pink rounded-xl mx-2 disabled:bg-gray-600 cursor pointer hover:scale-105 transition duration-300"
                    >
                        Next
                    </button>
                </div>
            </div>
        </AuthLayout>
    );
};

export default CariAyam;
