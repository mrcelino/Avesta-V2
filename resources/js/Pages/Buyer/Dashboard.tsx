import Hero from "@/Components/DashboardUser/Hero";
import { Link } from "@inertiajs/react";
import OrderGuide from "@/Components/Home/Orderguide";
import Brand from "@/Components/Home/Brand";
import Testimonials from "@/Components/Home/Testimonials";
import AuthLayout from "@/Layouts/AuthLayout";

const ayamList = [
    { name: "Ayam Utuh", img: "/image/ayam1.png", alt: "Whole chicken" },
    { name: "Dada Ayam", img: "/image/ayam2.png", alt: "Chicken breast" },
    { name: "Ceker Ayam", img: "/image/ayam3.png", alt: "Chicken feet" },
    { name: "Sayap Ayam", img: "/image/ayam4.png", alt: "Chicken wings" },
    { name: "Ayam Fillet", img: "/image/ayam5.png", alt: "Chicken fillet" },
    { name: "Jeroan Ayam", img: "/image/ayam6.png", alt: "Chicken offal" }
  ];

export default function Dashboard(){
    return(
        <AuthLayout useDashboardNavbar>
            <Hero/>
            <div className="mx-20 mb-20">
            <h2 className="font-extrabold text-3xl leading-[1.1] sm:text-3xl md:text-6xl my-20 mb-8 text-heading text-center">Kategori</h2>
                <div className="grid grid-cols-6 gap-4">
                    {ayamList.map((ayam, index) => (
                        <div
                        key={index}
                        className="flex flex-col items-center bg-white rounded-2xl border-2 shadow-md p-4 transition duration-300 hover:scale-110"
                        >
                        <a href={`/cariayam?q=${encodeURIComponent(ayam.name)}`}>
                            <img src={ayam.img} alt={ayam.alt} className="w-24 h-24 mb-2" />
                            <p className="text-heading font-bold text-lg">{ayam.name}</p>
                        </a>
                        </div>
                    ))}
                </div>
            <h2 className="font-extrabold text-3xl leading-[1.1] sm:text-3xl md:text-6xl my-20 text-heading text-center">Bagaimana Cara Pesan</h2>
                <OrderGuide/>
            <h2 className="font-extrabold text-3xl leading-[1.1] sm:text-3xl md:text-6xl my-20 text-heading text-center">Daftar Mitra Toko</h2>
                <Brand/>
            <h2 className="font-extrabold text-3xl leading-[1.1] sm:text-3xl md:text-6xl my-20 text-heading text-center">Testimoni</h2>
                <Testimonials/>
            </div>

        </AuthLayout>
    )
}