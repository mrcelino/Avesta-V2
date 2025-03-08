import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthLayout from "@/Layouts/AuthLayout";
import Skeleton from "@/Components/Skeleton";

interface Product {
    id_unggas: number;
    jenis_unggas: string;
    deskripsi: string;
    penjualan: number;
    harga_per_kg: string;
    stok: number;
    foto_unggas: string;
    created_at: string;
    warung: {
        nama_warung: string;
        alamat_warung: string;
        kelurahan: string;
    };
}

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
                    <select
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="select px-4 py-2 bg-white rounded-3xl shadow-md max-w-[140px] outline-none focus:ring-0 focus:border-transparent"
                    >
                        <option disabled value="">
                            Harga
                        </option>
                        <option value="asc">Termurah</option>
                        <option value="desc">Termahal</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {loading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} />
                ))
                : products.length > 0
                ? products.map((product) => <ProductCard key={product.id_unggas} product={product} />)
                : <p>Tidak ada produk ditemukan untuk "{searchQuery}"</p>}
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

const ProductCard = ({ product }: { product: Product }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatPrice = (price: string) => {
        const numPrice = parseFloat(price);
        return `Rp${numPrice.toLocaleString("id-ID", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        })}`;
    };

    const handleAddToCart = () => {
        console.log(`Added product ${product.id_unggas} to cart`);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-md border p-3">
                <img
                    alt={`Image of ${product.jenis_unggas}`}
                    className="rounded-xl w-full h-64 object-cover"
                    height="400"
                    src={`/storage/${product.foto_unggas}`}
                    width="600"
                />
                <div className="py-2">
                    <h2 className="text-base font-medium">
                        {product.jenis_unggas}
                    </h2>
                    <p className="text-lg font-semibold">
                        {formatPrice(product.harga_per_kg)}
                    </p>
                    <a href="/toko" className="text-sm">
                        {product.warung.nama_warung}
                    </a>
                    <div className="flex items-center text-sm mt-2 gap-2">
                        <img
                            alt="Location Icon"
                            className="w-5"
                            src="/vector/Pin.svg"
                        />
                        <span className="font-medium">
                            {product.warung.kelurahan}
                        </span>
                        <span className="text-black font-medium">
                            • {product.penjualan} Terjual
                        </span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <button
                            className="bg-pink w-full text-white px-4 py-2 rounded-2xl font-semibold hover:bg-pink"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Pesan
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <dialog open className="modal">
                    <div className="modal-box max-w-3xl p-6">
                        <form method="dialog">
                            <button
                                className="btn btn-sm btn-circle text-xl btn-ghost absolute text-pink right-2 top-2"
                                onClick={() => setIsModalOpen(false)}
                            >
                                ✕
                            </button>
                        </form>
                        <h3 className="text-lg font-bold mb-2">
                            Detail Produk
                        </h3>
                        <div className="flex border-2 border-slate-200 rounded-2xl p-4">
                            <div className="w-1/2">
                                <img
                                    alt={`Image of ${product.jenis_unggas}`}
                                    className="w-full h-full rounded-lg object-cover"
                                    src={`${import.meta.env.VITE_APP_URL}${
                                        product.foto_unggas
                                    }`}
                                />
                            </div>
                            <div className="ml-4 w-1/2 flex flex-col justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold mb-2">
                                        {product.jenis_unggas}
                                    </h2>
                                    <p className="font-normal">
                                        {product.deskripsi}
                                    </p>
                                    <p className="text-xl font-semibold mt-2 mb-2">
                                        {formatPrice(product.harga_per_kg)}
                                    </p>
                                    <p>{product.warung.nama_warung}</p>
                                    <div className="flex items-center mt-1">
                                        <i className="fas fa-map-marker-alt text-pink mr-1"></i>
                                        <span className="font-semibold">
                                            0.28 km {product.penjualan} Terjual
                                        </span>
                                    </div>
                                    <p className="mt-1">Stok: {product.stok}</p>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    className="bg-pink text-white w-full py-2 font-semibold rounded-2xl mt-4"
                                >
                                    Tambah ke keranjang
                                </button>
                            </div>
                        </div>
                    </div>
                </dialog>
            )}
        </>
    );
};

export default CariAyam;
