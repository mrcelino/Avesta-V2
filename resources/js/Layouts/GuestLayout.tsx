import { PropsWithChildren } from "react";
import React from "react";
import Navbar from "../Components/NavbarGuest";
import Footer from "../Components/Footer";

interface GuestLayoutProps {
    showFooter?: boolean;
}

const GuestLayout: React.FC<PropsWithChildren<GuestLayoutProps>> = ({ children, showFooter = false }) => {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            {showFooter && <Footer />}
        </>
    );
};

export default GuestLayout;
