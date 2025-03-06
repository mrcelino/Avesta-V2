import React from "react";
import { Link } from '@inertiajs/react';
const Navbar = () => {
  return (
    <nav className="fixed flex justify-center bg-white items-center w-full p-4  shadow-md z-50">
      <div className="flex items-center justify-center space-x-8 pl-4">
        <Link href="/">
          <img src="/image/avesta.png" alt="Avesta Logo" className="w-24 -mt-2" />
        </Link>
        <Link href="register" className="bg-heading rounded-3xl text-white px-5 py-1 min-w-20 font-medium transition duration-300 hover:text-heading hover:bg-white hover:border-2 hover:border-heading">Mitra</Link>
      </div>
      <div className="flex-1 flex justify-end items-center space-x-4">
        <div className="flex items-center justify-center">
          <Link href="/" className="font-semibold hover:bg-gray-200 rounded-3xl px-4 py-2 transition duration-300">Beranda</Link>
          <Link href="/product" className="font-semibold hover:bg-gray-200 rounded-3xl px-4 py-2 transition duration-300">Produk</Link>
          <Link href="/about" className="font-semibold hover:bg-gray-200 rounded-3xl px-4 py-2 transition duration-300">Tentang</Link>
          <Link href="/contact" className="font-semibold hover:bg-gray-200 rounded-3xl px-4 py-2 transition duration-300">Hubungi</Link>
        </div>
        <Link href="/login" className="bg-white border-2 border-heading rounded-3xl text-heading px-5 py-1 font-semibold transition duration-300 hover:bg-heading hover:text-white">Masuk</Link>
        <Link href="register"   className="bg-heading border-2 border-heading rounded-3xl text-white px-5 py-1 min-w-20 font-medium transition duration-300 hover:text-heading hover:bg-white">Daftar</Link>
      </div>
      
    </nav>
  );
};

export default Navbar;
