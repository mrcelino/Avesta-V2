import React from "react";
import { Link } from '@inertiajs/react';
const Navbar = () => {
  return (
    <nav className="fixed flex justify-center bg-pink items-center w-full p-4  shadow-md z-50">
      <div className="flex items-center justify-center space-x-8 pl-4 p-2">
        <Link href="/">
          <img src="/image/avesta2.png" alt="Avesta Logo" className="w-24 -mt-2 transition duration-300 hover:scale-105" />
        </Link>
        <Link href="register"   className="bg-white rounded-3xl text-pink px-5 py-1 min-w-20 font-semibold transition duration-300  hover:scale-105">Mitra</Link>
      </div>
      <div className="flex-1 flex justify-end items-center space-x-4">

      </div>
      
    </nav>
  );
};

export default Navbar;
