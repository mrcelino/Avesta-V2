import React from "react";
import { Link } from '@inertiajs/react';
import { useState } from "react";

function LocationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const selectOption = (option: string) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    return (
        <div className="flex items-center justify-evenly bg-white rounded-full text-pink px-4">
            <img src="/image/pin2.png" alt="Location Icon" className="w-6" />
            <div className="relative max-w-sm">
                {/* Tombol Trigger Dropdown */}
                <div
                    onClick={toggleDropdown}
                    className="cursor-pointer rounded-full text-pink bg-white font-semibold text-lg p-3 flex justify-between items-center"
                >
                    <span>{selectedOption || "Pilih Lokasi"}</span>
                    <img src="/vector/dropdown.png" alt="Location Icon" className="w-5 ml-4" />
                </div>
                {/* Daftar Opsi (Dropdown Menu) */}
                {isOpen && (
                    <div className="absolute -ml-12 z-10 mt-2 p-2 w-full min-w-56 bg-white text-black font-medium rounded-[35px] shadow-xl">
                        <ul className="p-2">
                            {["Sendangadi", "Sinduadi", "Tirtoadi", "Tlogoadi"].map((option) => (
                                <li
                                    key={option}
                                    onClick={() => selectOption(option)}
                                    className="p-2 hover:bg-pink hover:text-white rounded-full cursor-pointer transition duration-300 hover:scale-105"
                                >
                                    {option}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

function Keranjang(){
  return(
    <>
      <Link href="/register" className="btn rounded-full p-2 size-12 flex items-center justify-center">
        <img src="/vector/cart.png" alt="Cart Icon" width={20} height={20} />
      </Link>
    </>
  )
}

function Profile(){
  return(
    <>
      <div className="dropdown dropdown-bottom dropdown-end">
          <div tabIndex={0} role="button" className="btn rounded-full p-2 size-12 flex items-center justify-center"></div>
            <ul tabIndex={0} className="dropdown-content menu min-w-60 max-w-2xl min-h-40 bg-base-100 rounded-2xl z-1  mt-2 p-3 shadow-md">
              <div className="flex items-center justify-start gap-4 max-w-2xl min-h-14 border-2 p-2 rounded-xl shadow-2xs">
                  <div className="rounded-full size-10 bg-gray-200">
                  </div>
                  <div className="flex-col">
                    <p className="font-semibold text-base">Marcelino</p>
                    <div className="flex flex-row items-center gap-2">
                        <img src="/image/coin.svg" alt="Coin Icon" className="size-5 object-cover"/>
                        <p className="text-base">IDR 0,00</p>
                    </div>
                  </div>
              </div>
              <Link href="register"  className="bg-white hover:bg-pink hover:text-white rounded-3xl  px-5 py-2  font-semibold transition duration-300  hover:scale-105 mt-4">Riwayat Pembelian</Link>
              <Link href="register"  className="bg-white hover:bg-pink hover:text-white rounded-3xl  px-5 py-2  font-semibold transition duration-300  hover:scale-105">Pengaturan</Link>
              <div className="flex justify-between pr-4 bg-white hover:bg-pink hover:text-white rounded-3xl  px-5 py-2  font-semibold transition duration-300  hover:scale-105">
              <Link href="register"  className="">Keluar</Link>
                  <img src="/image/logout.svg" alt="Coin Icon" className="size-4 object-cover"/>
              </div>
            </ul>
        </div>
    </>
  )
}

const Navbar = () => {
  return (
    <div className="navbar fixed z-50 bg-pink p-3 shadow-sm flex items-center justify-between">
      {/* Logo & Mitra */}
      <div className="flex items-center space-x-4">
        <Link href="/" className="pl-4">
          <img 
            src="/image/avesta2.png" 
            alt="Avesta Logo" 
            className="w-28 -mt-2 transition duration-300 hover:scale-105" 
          />
        </Link>
        <Link href="register" className="bg-white rounded-3xl text-pink px-5 py-1 min-w-20 font-semibold transition duration-300 hover:scale-105">
          Mitra
        </Link>
      </div>

      {/* Navbar Center */}
      <div className="flex-1 flex justify-center ml-20">
        <form className="flex bg-white px-4 py-2 rounded-full overflow-hidden w-full max-w-md">
          <input 
            type="text" 
            name="q" 
            placeholder="Cari Ayam" 
            className="w-full outline-none border-0 text-black text-sm px-2 bg-transparent focus:ring-0 focus:outline-none"
          />
          <button type="submit" className="flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 192.904 192.904" 
              width="20px" 
              className="fill-pink transition duration-300 hover:scale-110"
            >
              <path d="M190.707 180.101l-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
            </svg>
          </button>
        </form>
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

