import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import {ProductCard, Product} from "@/Components/ProductCard";
import axios from "axios";


interface InfoCardProps {
  icon: string;
  label: string;
  description: string;
}

interface Warung {
  id_warung: number;
  nama_warung: string;
  foto_warung: string | null;
  alamat_warung: string;
  kelurahan: string;
  unggas: Product[];
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, label, description }) => (
  <div className="flex flex-col items-center border-2 py-2 px-4 rounded-lg shadow-sm">
    <div className="flex items-center space-x-2">
      <img src={icon} alt={`${label} icon`} className="w-5" />
      <p className="text-lg font-medium">{label}</p>
    </div>
    <p className="text-pink">{description}</p>
  </div>
);

export default function Toko() {
  const { props } = usePage();
  const { id } = props;
  console.log("ID dari URL:", id);
  const [warung, setWarung] = useState<Warung | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWarung = async () => {
      try {
        const response = await axios.get(`/api/warungs/${id}`);
        const data = response.data;
  
        if (data.unggas) {
          data.unggas = data.unggas.map((item: any) => ({
            ...item,
            warung: {
              id_warung: data.id_warung,
              nama_warung: data.nama_warung,
              alamat_warung: data.alamat_warung,
              kelurahan: data.kelurahan,
            },
          }));
        }
  
        setWarung(data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchWarung();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!warung) return <p>Warung tidak ditemukan</p>;
  return (
    <AuthLayout>
      <div className="container w-full p-2 mx-auto flex flex-col min-h-screen">
        <div className="bg-white flex items-center space-x-6 mt-28 mb-6">
          <img
            alt="Foto Warung"
            className="size-40 rounded-[28px] object-cover"
            src={`/storage/${warung.foto_warung}`}
          />
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">{warung.nama_warung}</h2>
            <p className="font-medium mt-2">
              {warung.alamat_warung}
            </p>
            <div className="flex space-x-4">
              <InfoCard icon="/vector/pin.svg" label={warung.kelurahan} description="Kelurahan" />
              <InfoCard icon="/vector/price.svg" label="100+" description="Penjualan" />
              <InfoCard icon="/vector/chat.svg" label="Chat" description="Penjual" />
            </div>
          </div>
        </div>
        <h3 className="font-semibold text-2xl mb-2">Daftar Produk</h3>
        <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-20">
          {warung.unggas.length > 0 ? (
            warung.unggas.map((product) => (
              <ProductCard key={product.id_unggas} product={product} />
            ))
          ) : (
            <p className="col-span-4 text-center text-gray-500">Tidak ada produk tersedia</p>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};
