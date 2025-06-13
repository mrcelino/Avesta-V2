import { useEffect, useState, useRef } from "react";
import axios from "axios";
import AdminLayout from "./Components/AdminLayout";

declare global {
    interface Window {
        Chart: any;
    }
}

interface ChartDataItem {
    day?: string;
    week?: string;
    month?: string;
    order_count: number;
}

interface KategoriDataItem {
    kategori: string;
    order_count: number;
}

interface ChartComponentProps {
    data: ChartDataItem[];
}

interface KategoriChartComponentProps {
    data: KategoriDataItem[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<any>(null);

    useEffect(() => {
        if (!window.Chart || !chartRef.current) return;
        const ctx = chartRef.current.getContext("2d");
        if (!ctx) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const labels = data.map(
            (item) => item.day || item.week || item.month || "Tidak diketahui"
        );
        const values = data.map((item) => item.order_count);

        chartInstance.current = new window.Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Total Penjualan",
                        data: values,
                        backgroundColor: "rgba(255, 99, 132, 0.6)",
                        borderColor: "#FB657A",
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        bottom: 30,
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            autoSkip: true,
                            maxRotation: 0,
                            minRotation: 0,
                            font: {
                                size: 12,
                            },
                        },
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                        },
                    },
                },
            },
        });
    }, [data]);

    return (
        <div className="w-full h-full">
            <canvas ref={chartRef} className="w-full h-full" />
        </div>
    );
};

const KategoriChartComponent: React.FC<KategoriChartComponentProps> = ({ data }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<any>(null);

    useEffect(() => {
        if (!window.Chart || !chartRef.current) return;
        const ctx = chartRef.current.getContext("2d");
        if (!ctx) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        // Definisikan semua kategori
        const allCategories = ["Ayam Utuh", "Dada Ayam", "Ceker Ayam", "Ayam Fillet", "Jeroan"];
        
        // Pastikan data adalah array, jika tidak, gunakan array kosong
        const validData = Array.isArray(data) ? data : [];

        // Normalisasi data
        const normalizedData = allCategories.map((category) => {
            const apiCategory = validData.find((item) => {
                const normalizedApiCategory = item.kategori === "Ceker" ? "Ceker Ayam" : 
                                            item.kategori === "Dada" ? "Dada Ayam" : 
                                            item.kategori === "Fillet" ? "Ayam Fillet" : item.kategori;
                return normalizedApiCategory === category;
            });
            return {
                kategori: category,
                order_count: apiCategory ? apiCategory.order_count : 0,
            };
        });

        const labels = normalizedData.map((item) => item.kategori);
        const values = normalizedData.map((item) => item.order_count);

        chartInstance.current = new window.Chart(ctx, {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Total Penjualan per Kategori",
                        data: values,
                        backgroundColor: "rgba(255, 99, 132, 0.6)",
                        borderColor: "#FB657A",
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        bottom: 30,
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            autoSkip: true,
                            maxRotation: 0,
                            minRotation: 0,
                            font: {
                                size: 12,
                            },
                        },
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                        },
                    },
                },
            },

        });
    }, [data]);

    return (
        <div className="w-full h-full">
            <canvas ref={chartRef} className="w-full h-full" />
        </div>
    );
};

const options = ["Minggu ini", "Bulan ini", "Tahun ini"] as const;
type OptionType = (typeof options)[number];
const rangeMap: Record<OptionType, string> = {
    "Minggu ini": "minggu",
    "Bulan ini": "bulan",
    "Tahun ini": "tahun",
};

export default function Data() {
    const [selectedStat, setSelectedStat] = useState<OptionType>("Minggu ini");
    const [showStatDropdown, setShowStatDropdown] = useState(false);
    const [statistikData, setStatistikData] = useState<ChartDataItem[]>([]);

    const [selectedKategori, setSelectedKategori] = useState<OptionType>("Minggu ini");
    const [showKategoriDropdown, setShowKategoriDropdown] = useState(false);
    const [kategoriData, setKategoriData] = useState<KategoriDataItem[]>([]);

    useEffect(() => {
        const fetchStatistikData = async () => {
            try {
                const response = await axios.get(
                    `/api/laporan-penjualan?range=${rangeMap[selectedStat]}`
                );
                setStatistikData(response.data);
            } catch (error) {
                console.error("Gagal memuat data statistik:", error);
            }
        };

        fetchStatistikData();
    }, [selectedStat]);

    useEffect(() => {
        const fetchKategoriData = async () => {
            try {
                const response = await axios.get(
                    `/api/laporan-kategori?range=${rangeMap[selectedKategori]}`
                );
                setKategoriData(response.data);
            } catch (error) {
                console.error("Gagal memuat data kategori:", error);
            }
        };

        fetchKategoriData();
    }, [selectedKategori]);

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-1">Laporan Penjualan</h1>
            <h2>Pantau laporan penjualan untuk memaksimalkan penjualan</h2>

            <div className="bg-white h-[450px] mt-4 p-6 rounded-lg border shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        Statistik Penjualan
                    </h3>
                    <div className="relative">
                        <button
                            onClick={() =>
                                setShowStatDropdown(!showStatDropdown)
                            }
                            className="border-2 border-pink rounded-lg px-4 flex justify-between font-medium py-1 hover:bg-gray-100 transition"
                        >
                            {selectedStat}
                        </button>
                        {showStatDropdown && (
                            <div className="absolute right-1 mt-1 bg-white border rounded-md shadow-md w-40 z-10">
                                {options.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            setSelectedStat(option);
                                            setShowStatDropdown(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <ChartComponent data={statistikData} />
            </div>

            <div className="bg-white h-[400px] mt-4 p-6 rounded-lg border shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        Kategori Penjualan
                    </h3>
                    <div className="relative">
                        <button
                            onClick={() =>
                                setShowKategoriDropdown(!showKategoriDropdown)
                            }
                            className="border-2 border-pink rounded-lg px-4 flex justify-between font-medium py-1 hover:bg-gray-100 transition"
                        >
                            {selectedKategori}
                        </button>
                        {showKategoriDropdown && (
                            <div className="absolute right-1 mt-1 bg-white border rounded-md shadow-md w-40 z-10">
                                {options.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            setSelectedKategori(option);
                                            setShowKategoriDropdown(false);
                                        }}
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <KategoriChartComponent data={kategoriData} />
            </div>
        </AdminLayout>
    );
}
