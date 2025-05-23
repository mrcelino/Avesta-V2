import React from "react";
import { Link, usePage } from "@inertiajs/react";

interface NavItemProps {
  href: string;
  children: React.ReactNode;
}

// Link default untuk halaman biasa
const DEFAULT_NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/product", label: "Produk" },
  { href: "/about", label: "Tentang" },
  { href: "/contact", label: "Hubungi" },
];

// Link khusus untuk halaman /mitra
const MITRA_NAV_LINKS = [
  { href: "/mitra", label: "Beranda" },
  { href: "/admin", label: "Dashboard" },
  { href: "/mitra/about", label: "Tentang" },
  { href: "/mitra/contact", label: "Hubungi" },
];

const Navbar = () => {
  const { url } = usePage();

  // Tentukan teks dan href tombol berdasarkan halaman
  const mitraLink = url.startsWith("/mitra") ? { label: "User", href: "/" } : { label: "Mitra", href: "/mitra" };

  // Pilih NAV_LINKS berdasarkan halaman
  const navLinks = url.startsWith("/mitra") ? MITRA_NAV_LINKS : DEFAULT_NAV_LINKS;

  // Tentukan href untuk register berdasarkan URL saat ini
  const registerHref = url.startsWith("/mitra") ? "/register?mitra" : "/register";

  return (
    <nav className="navbar fixed z-50 bg-white p-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link href="/" className="pl-4">
          <img
            src="/image/avesta.png"
            alt="Avesta Logo"
            className="w-28 -mt-2 transition duration-300 hover:scale-105"
          />
        </Link>
        <Link
          href={mitraLink.href}
          className="bg-heading rounded-3xl text-white px-5 py-1 min-w-20 font-semibold transition duration-300 hover:scale-105"
        >
          {mitraLink.label}
        </Link>
      </div>

      {/* Navbar Menu & Actions */}
      <div className="flex-1 flex justify-end items-center space-x-4">
        <div className="flex items-center justify-center">
          {navLinks.map(({ href, label }) => (
            <NavItem key={href} href={href}>
              {label}
            </NavItem>
          ))}
        </div>
        <AuthButtons registerHref={registerHref} /> {/* Pass registerHref ke AuthButtons */}
      </div>
    </nav>
  );
};

const NavItem = ({ href, children }: NavItemProps) => (
  <Link
    href={href}
    className="font-semibold hover:bg-gray-200 rounded-3xl px-4 py-2 transition duration-300"
  >
    {children}
  </Link>
);

const AuthButtons = ({ registerHref }: { registerHref: string }) => (
  <>
    <Link
      href="/login"
      className="bg-white border-2 border-heading rounded-3xl text-heading px-5 py-1 font-semibold transition duration-300 hover:bg-heading hover:text-white"
    >
      Masuk
    </Link>
    <Link
      href={registerHref} // Gunakan registerHref yang dinamis
      className="bg-heading border-2 border-heading rounded-3xl text-white px-5 py-1 min-w-20 font-medium transition duration-300 hover:text-heading hover:bg-white"
    >
      Daftar
    </Link>
  </>
);

export default Navbar;