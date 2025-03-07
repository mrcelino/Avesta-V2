import { Link } from "@inertiajs/react";

import GuestLayout from "../Layouts/GuestLayout";
import Hero from "@/Components/Home/Hero";
import Whyus from "@/Components/Home/WhyUs";
import AboutUs from "@/Components/Home/AboutUs";
import OrderGuide from "@/Components/Home/Orderguide";
import Brand from "@/Components/Home/Brand";
import Testimonials from "@/Components/Home/Testimonials";
const Welcome = () => {
    return (
        <GuestLayout showFooter={true}>
            <Hero />
            <div className="mx-16 mb-20">
                <h2 className="font-extrabold text-3xl leading-[1.1] sm:text-3xl md:text-5xl my-20 text-heading text-center">Mengapa memilih Avesta?</h2>
                    <Whyus />
                    <AboutUs />
                <h2 className="font-extrabold text-3xl leading-[1.1] sm:text-3xl md:text-5xl my-20 text-heading text-center">Bagaimana Cara Pesan?</h2>
                    <OrderGuide />
                <h2 className="font-extrabold text-3xl leading-[1.1] sm:text-3xl md:text-5xl my-20 text-heading text-center">Daftar Mitra Toko</h2>
                    <Brand />
                <h2 className="hidden md:block font-extrabold text-3xl leading-[1.1] sm:text-3xl md:text-5xl my-20 text-heading  text-center ">Testimoni</h2> 
                    <Testimonials />
            </div>
        </GuestLayout>
    );
};

export default Welcome;
