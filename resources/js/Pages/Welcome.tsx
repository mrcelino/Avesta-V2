import { Link } from '@inertiajs/react';
import Navbar from '../Components/NavbarGuest';
import Footer from '../Components/Footer';
import Hero from '../Components/Home/Hero';
import WhyUs from '../Components/Home/Whyus';
const Welcome = () => {
    return (
        <div>
            <Navbar/>

            <div className='py-20 min-h-screen flex items-center justify-center'>
                <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl">Responsive</button>
                <h1>Welcome to Inertia.js</h1>
                <p>This is the welcome page.</p>
                <Link href="/login">Login</Link>
                <Link href="/register">Regsiter</Link>
            </div>
            <Footer/>
        </div>
    );
};

export default Welcome;