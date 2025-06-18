import axios from "axios";
import React from "react";
import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { useCart } from "@/Layouts/AuthLayout";
import { useAuth } from "@/Layouts/AuthLayout";
import { formatIDR } from "../NavbarUser";
import { useLocation } from "@/Layouts/AuthLayout";

function LocationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [kelurahans, setKelurahans] = useState<string[]>([]);

    useEffect(() => {
        const fetchKelurahans = async () => {
            try {
                const response = await axios.get(
                    "api/warungs/kelurahan"
                );
                setKelurahans(
                    response.data.map(
                        (item: { kelurahan: string }) => item.kelurahan
                    )
                );
            } catch (error) {
                console.error("Error fetching kelurahan:", error);
            }
        };

        const urlParams = new URLSearchParams(window.location.search);
        const kelurahan = urlParams.get("kelurahan");
        if (kelurahan) setSelectedOption(kelurahan);

        fetchKelurahans();
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const selectOption = (option: string) => {
        setSelectedOption(option);
        setIsOpen(false);
        window.location.href = `/cariayam?kelurahan=${encodeURIComponent(
            option
        )}`;
    };

    return (
        <div className="flex items-center justify-evenly bg-pink rounded-full text-white px-4">
            <img src="/image/pin.png" alt="Location Icon" className="w-6" />
            <div className="relative max-w-sm">
                {/* Tombol Trigger Dropdown */}
                <div
                    onClick={toggleDropdown}
                    className="cursor-pointer rounded-full text-white bg-pink font-semibold text-lg p-3 flex justify-between items-center"
                >
                    <span>{selectedOption || "Pilih Lokasi"}</span>
                    <img
                        src="/vector/dropdown2.png"
                        alt="Location Icon"
                        className="w-5 ml-4"
                    />
                </div>
                {/* Daftar Opsi (Dropdown Menu) */}
                {isOpen && (
                    <div className="absolute -ml-12 z-10 mt-2 p-2 w-full min-w-56 bg-white text-black font-medium rounded-[35px] shadow-xl">
                        <ul className="p-2">
                            {kelurahans.length > 0 ? (
                                kelurahans.map((option) => (
                                    <li
                                        key={option}
                                        onClick={() => selectOption(option)}
                                        className="p-2 hover:bg-pink hover:text-white rounded-full cursor-pointer transition duration-300 hover:scale-105"
                                    >
                                        {option}
                                    </li>
                                ))
                            ) : (
                                <li className="p-2 text-center">
                                    Memuat lokasi...
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

function Keranjang() {
    const { cart } = useCart();
    const itemCount = cart.length;
    return (
        <>
            <Link
                href="/checkout"
                className="relative btn bg-pink rounded-full p-2 size-12 flex items-center justify-center"
            >
                <img
                    src="/vector/cart2.png"
                    alt="Cart Icon"
                    width={20}
                    height={20}
                />
                <div
                    className={`absolute rounded-full bg-pink top-0 right-0 translate-x-1/4 -translate-y-1/4 text-xs flex items-center justify-center text-white ${
                        itemCount > 9 ? "size-6" : "size-5"
                    }`}
                >
                    {itemCount > 99 ? "99+" : itemCount}
                </div>
            </Link>
        </>
    );
}

function Profile() {
  const { user, setUser } = useAuth();
  const { setLocation } = useLocation();
  const handleLogout = async () => {
    try {
        await axios.post("/api/logout", {}, {
            withCredentials: true,
        });
        setUser(null);
        window.location.href = "/login";
        setLocation({
        latitude: null,
        longitude: null,
        nama_warung: null,
        alamat_warung: null,
        id_order: null,
      })
    } catch (error) {
        console.error("Logout failed:", error);
    }
  };
  console.log("Profile component rendered, user:", user);

  return (
  <div className="dropdown dropdown-bottom dropdown-end">
    <div
      tabIndex={0}
      role="button"
      className="rounded-full size-12 overflow-hidden cursor-pointer"
    >
      <img
        src={user && user.foto ? `/storage/${user.foto}` : "/image/default-avatar.png"}
        alt="Avatar"
        className="w-full h-full object-cover"
      />
    </div>

    <ul
      tabIndex={0}
      className="dropdown-content menu min-w-60 max-w-2xl min-h-40 bg-base-100 rounded-2xl z-1 mt-2 p-3 shadow-md"
    >
      <div className="flex items-center justify-start gap-4 max-w-2xl min-h-14 border-2 p-2 rounded-xl shadow-2xs">
        <div className="rounded-full size-10 overflow-hidden">
          <img
            src={user && user.foto ? `/storage/${user.foto}` : "/image/default-avatar.png"}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-col">
          <p className="font-semibold text-base">
            {user ? `${user.nama_depan}` : "Loading..."}
          </p>
          <Link href="/wallet" className="flex flex-row items-center gap-2">
            <img src="/image/coin.svg" alt="Coin Icon" className="size-5 object-cover" />
            <p className="text-base">{user ? formatIDR(user.saldo) : "Rp 0,00"}</p>
          </Link>
        </div>
      </div>

      <Link
        href="/purchasehistory"
        className="bg-white hover:bg-pink hover:text-white rounded-3xl px-5 py-2 font-semibold transition duration-300 hover:scale-105 mt-4"
      >
        Riwayat Pembelian
      </Link>
      <Link
        href="/settings"
        className="bg-white hover:bg-pink hover:text-white rounded-3xl px-5 py-2 font-semibold transition duration-300 hover:scale-105"
      >
        Pengaturan
      </Link>
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
}

const Navbar = () => {
    return (
        <div className="navbar fixed z-50 bg-white p-3 shadow-sm flex items-center justify-between">
            {/* Logo & Mitra */}
            <div className="flex items-center space-x-4">
                <Link href="/" className="pl-4">
                    <img
                        src="/image/avesta.png"
                        alt="Avesta Logo"
                        className="w-28 -mt-2 transition duration-300 hover:scale-105"
                    />
                </Link>
                <Link
                    href="/mitra"
                    className="bg-heading rounded-3xl text-white px-5 py-1 min-w-20 font-semibold transition duration-300 hover:scale-105"
                >
                    Mitra
                </Link>
            </div>

            {/* Navbar End (Elemen lainnya) */}
            <div className="flex items-center space-x-4">
                <Keranjang />
                <LocationDropdown />
                <Profile />
            </div>
        </div>
    );
};

export default Navbar;
