import { Link, usePage } from "@inertiajs/react";
export default function Sidebar() {
  const { url } = usePage();

  const navItems = [
      { href: "/admin", label: "Beranda", icon: "/image/nav-home.svg" },
      { href: "/admin/data", label: "Data", icon: "/image/nav-data.svg" },
      {
          href: "/admin/karyawan",
          label: "Karyawan",
          icon: "/image/nav-karyawan.svg",
      },
      {
          href: "/admin/pesanan",
          label: "Pesanan",
          icon: "/image/nav-pesanan.svg",
      },
      {
          href: "/admin/produk",
          label: "Produk",
          icon: "/image/nav-produk.svg",
      },
      { href: "/admin/toko", label: "Toko", icon: "/image/nav-toko.svg" },
  ];

  return (
      <div className="bg-pink fixed pt-24 left-0 h-full w-72 p-6 text-white overflow-y-auto">
          <nav>
              <ul className="space-y-2">
                  {navItems.map(({ href, label, icon }) => {
                      const isActive = url === href;
                      return (
                          <li key={href}>
                              <Link
                                  href={href}
                                  className="relative flex items-center p-3 rounded-xl transition duration-300 group"
                              >
                                  <span
                                      className={`absolute inset-0 rounded-xl bg-white transition-opacity duration-300 ${
                                          isActive
                                              ? "opacity-30"
                                              : "opacity-0 group-hover:opacity-30"
                                      }`}
                                  ></span>
                                  <span className="relative flex space-x-5 items-center">
                                      <img
                                          src={icon}
                                          alt={`${label} icon`}
                                          className="w-6 h-6"
                                      />
                                      <span>{label}</span>
                                  </span>
                              </Link>
                          </li>
                      );
                  })}
              </ul>
          </nav>
      </div>
  );
}