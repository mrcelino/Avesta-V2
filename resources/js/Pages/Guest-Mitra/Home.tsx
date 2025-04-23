import GuestLayout from "@/Layouts/GuestLayout";
import Brand from "@/Components/Home/Brand";
import Testimonials from "./Components/Testimonials";
import AboutUs from "@/Components/Home/AboutUs";
import StepGuide from "./Components/Guide";
import Features from "./Components/Features";
import CallToActionSection from "./Components/CTA"

export default function Home() {
    return (
        <GuestLayout showFooter={true}>
            <img src="/image/mitrabg.png" alt="hero" width={100} height={100} className="w-full pt-12"></img>
            <div className="mx-40 mb-20">
                <h2 className="font-extrabold text-3xl leading-[1.1] sm:text-3xl md:text-4xl my-10 text-heading text-center">
                    Mengapa bergabung dengan kami?
                </h2>
                <Features/>
                <AboutUs/>
                <h2 className="font-extrabold text-3xl leading-[1.1] sm:text-3xl md:text-4xl my-14 text-heading text-center">
                    Cara Kerja
                </h2>
                <StepGuide/>
                <h2 className="font-extrabold text-3xl leading-[1.1] sm:text-3xl md:text-4xl my-14 text-heading text-center">
                    Daftar Mitra Toko
                </h2>
                <Brand/>
                <CallToActionSection/>
                <h2 className="hidden md:block font-extrabold text-3xl leading-[1.1] sm:text-3xl md:text-4xl my-14 text-heading  text-center ">
                    Testimoni
                </h2>
                <Testimonials />
            </div>
        </GuestLayout>
    );
}
