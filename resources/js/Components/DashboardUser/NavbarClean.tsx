import { Link } from "@inertiajs/react";

export default function NavbarClean() {
  return (
    <div className="navbar fixed top-0 left-0 w-full z-50 bg-pink p-3 shadow-sm flex items-center justify-between">
      {/* Logo & Mitra */}
      <div className="flex items-center space-x-4">
        <Info />
      </div>
    </div>
  );
}

function Info() {
  return (
    <>
      <Link href="/dashboard" className="pl-4">
        <img
          src="/image/avesta2.png"
          alt="Avesta Logo"
          className="w-28 -mt-2 transition duration-300 hover:scale-105"
        />
      </Link>
    </>
  );
}

