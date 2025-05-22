import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import AdminLayout from "./Components/AdminLayout";

declare global {
  interface Window {
    Chart: any;
  }
}

interface DailyOrder {
  day: string;      
  date: string;     
  order_count: number;
}

interface Stats {
  successful_orders: number;
  total_unggas: number;
  total_employees: number;
  recent_orders_by_day: DailyOrder[];
}

const ChartComponent: React.FC<{ data: DailyOrder[] }> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!window.Chart || !chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((d) => d.day),
        datasets: [
          {
            label: "Pesanan selesai dalam 7 hari terakhir",
            data: data.map((d) => d.order_count),
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "#FB657A",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                const idx = context.dataIndex;
                const date = data[idx]?.date || "";
                const count = context.parsed.y;
                return `Date: ${date}, Orders: ${count}`;
              },
            },
          },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });

    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [data]);

  return (
    <div className="w-full h-full">
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
};

export default function Page() {
  const [stats, setStats] = useState<Stats>({
    successful_orders: 0,
    total_unggas: 0,
    total_employees: 0,
    recent_orders_by_day: [],
  });

  const [warungId, setWarungId] = useState<number | null>(() => {
    const storedId = localStorage.getItem("warungId");
    return storedId && storedId !== "" ? parseInt(storedId) : null;
  });


  useEffect(() => {
    if (!warungId) {
      (async () => {
        try {
          await axios.get("/sanctum/csrf-cookie");
          const response = await axios.get("/api/me", { withCredentials: true });
          const id = response.data.user?.id_warung || null;
          setWarungId(id);
          localStorage.setItem("warungId", id?.toString() || "");
        } catch {
          setWarungId(null);
          localStorage.setItem("warungId", "");
        }
      })();
    }
  }, [warungId]);


  useEffect(() => {
    if (!warungId) return;

    (async () => {
      try {
        const response = await axios.get(`/api/warung-stats/${warungId}`);
        setStats(response.data);
      } catch {
        setStats({
          successful_orders: 0,
          total_unggas: 0,
          total_employees: 0,
          recent_orders_by_day: [],
        });
      }
    })();
  }, [warungId]);

  return (
    <AdminLayout>
        <div className="min-h-screen">
        <h1 className="text-2xl font-bold mb-1">Beranda</h1>
        <h2 className="mb-4">Kelola tokomu untuk jaga kepuasan pelanggan</h2>

        <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col justify-between bg-white p-4 rounded-lg border shadow-sm min-h-28">
            <h2>Pesanan berhasil</h2>
            <h2 className="text-3xl font-bold">{stats.successful_orders}</h2>
            </div>
            <div className="flex flex-col justify-between bg-white p-4 rounded-lg border shadow-sm min-h-28">
            <h2>Jumlah Produk</h2>
            <h2 className="text-3xl font-bold">{stats.total_unggas}</h2>
            </div>
            <div className="flex flex-col justify-between bg-white p-4 rounded-lg border shadow-sm min-h-28">
            <h2>Jumlah Karyawan</h2>
            <h2 className="text-3xl font-bold">{stats.total_employees}</h2>
            </div>
        </div>

        <div className="bg-white h-[400px] mt-6 p-6 rounded-lg border shadow-sm flex items-center justify-center">
            <ChartComponent data={stats.recent_orders_by_day} />
        </div>
        </div>
    </AdminLayout>
  );
}
