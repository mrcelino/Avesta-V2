import React, { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import axios from "axios";

interface NavItemProps {
  href: string;
  children: React.ReactNode;
}

interface AuthButtonsProps {
  registerHref: string;
}

// Interface untuk data pengguna
interface User {
  nama_depan: string;
  saldo: number;
  foto?: string;
  role?: string;
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
      <div className="flex-1 hidden md:flex justify-end items-center space-x-1 lg:space-x-4">
        <div className="flex items-center justify-center">
          {navLinks.map(({ href, label }) => (
            <NavItem key={href} href={href}>
              {label}
            </NavItem>
          ))}
        </div>
        <AuthButtons registerHref={registerHref} />
      </div>
    </nav>
  );
};

const NavItem = ({ href, children }: NavItemProps) => (
  <Link
    href={href}
    className="font-semibold hover:bg-gray-200 rounded-3xl px-2 lg:px-4 py-2 transition duration-300"
  >
    {children}
  </Link>
);

const AuthButtons = ({ registerHref }: AuthButtonsProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get<{ user: User }>("/api/me", { withCredentials: true });
        console.log("User data fetched:", response.data);
        setUser(response.data.user);
      } catch (error: any) {
        console.log("Not logged in or error:", error.response?.status);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    // Tampilkan placeholder selama loading
    return <div className="w-12 h-12 rounded-full animate-pulse bg-gray-200"></div>;
  }

  if (user) {
    // Jika sudah login, tampilkan Profile
    return <Profile user={user} setUser={setUser} />;
  }

  // Jika belum login, tampilkan tombol Masuk dan Daftar
  return (
    <>
      <Link
        href="/login"
        className="bg-white border-2 border-heading rounded-3xl text-heading px-5 py-1 font-semibold transition duration-300 hover:bg-heading hover:text-white"
      >
        Masuk
      </Link>
      <Link
        href={registerHref}
        className="bg-heading border-2 border-heading rounded-3xl text-white px-5 py-1 min-w-20 font-medium transition duration-300 hover:text-heading hover:bg-white"
      >
        Daftar
      </Link>
    </>
  );
};

// Komponen Profile
const Profile = ({ user, setUser }: { user: User; setUser: (user: User | null) => void }) => {
  const [imageError, setImageError] = useState(false); // State untuk handle error gambar

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="rounded-full w-12 h-12 overflow-hidden cursor-pointer bg-gray-200"
      >
        <img
          src={imageError || !user.foto ? "/image/default-avatar.png" : `/storage/${user.foto}`}
          alt="Avatar"
          className="w-full h-full object-cover aspect-square"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      </div>

      <ul
        tabIndex={0}
        className="dropdown-content menu min-w-60 max-w-2xl h-fit bg-base-100 rounded-2xl z-1 mt-2 p-3 shadow-md"
      >
        <div className="flex items-center justify-start gap-4 max-w-2xl min-h-14 border-2 p-2 rounded-xl shadow-2xs">
          <div className="rounded-full w-10 h-10 overflow-hidden bg-gray-200">
            <img
              src={imageError || !user.foto ? "/image/default-avatar.png" : `/storage/${user.foto}`}
              alt="Avatar"
              className="w-full h-full object-cover aspect-square"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          </div>
          <div className="flex-col">
            <p className="font-semibold text-base">{user.nama_depan || "Loading..."}</p>
            {user.role === "pemilik" && (
              <Link href="admin/wallet" className="flex flex-row items-center gap-2">
                <img src="/image/coin.svg" alt="Coin Icon" className="size-5 object-cover" />
                <p className="text-base">{formatIDR(Number(user.saldo))}</p>
              </Link>
            )}
          </div>
        </div>
          {user.role === "pemilik" && (
            <Link
              href="/admin/wallet"
              className="bg-white hover:bg-pink hover:text-white rounded-3xl px-5 py-2 font-semibold transition duration-300 hover:scale-105 mt-2"
            >
              AvestaPay
            </Link>
          )}
        <div
          onClick={handleLogout}
          className="flex justify-between pr-4 bg-white hover:bg-pink hover:text-white rounded-3xl px-5 py-2 font-semibold transition duration-300 hover:scale-105 cursor-pointer"
        >
          <span>Logout</span>
          <img src="/image/logout.svg" alt="Logout Icon" className="size-4 object-cover" />
        </div>
      </ul>
    </div>
  );
};

// Fungsi formatIDR untuk format saldo
const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  }).format(amount);
};

export default Navbar;