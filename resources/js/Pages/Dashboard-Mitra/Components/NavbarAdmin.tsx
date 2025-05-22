import axios from "axios";
import { Link } from "@inertiajs/react";
import { useState, useEffect } from "react";

export const formatIDR = (amount: string | number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
  }).format(Number(amount));
};

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/me", { withCredentials: true });
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();

    // Listen to orderCompleted event
    const handleOrderCompleted = () => {
      console.log("Order completed event received, refreshing user data...");
      fetchUser();
    };

    window.addEventListener("orderCompleted", handleOrderCompleted);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("orderCompleted", handleOrderCompleted);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("warungId");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="navbar min-w-full fixed top-0 left-0 w-full z-50 bg-pink p-3 shadow-sm flex items-center justify-between">
      {/* Logo & Mitra */}
      <div className="flex items-center space-x-4">
        <Info />
      </div>

      {/* Navbar End */}
      <div className="flex items-center space-x-4">
        <Profile user={user} loading={loading} handleLogout={handleLogout} />
      </div>
    </div>
  );
}

function Info() {
  return (
    <>
      <Link href="/mitra" className="pl-4">
        <img
          src="/image/avesta2.png"
          alt="Avesta Logo"
          className="w-28 -mt-2 transition duration-300 hover:scale-105"
        />
      </Link>
      <Link
        href="/"
        className="bg-white rounded-3xl text-pink px-5 py-1 min-w-20 font-semibold transition duration-300 hover:scale-105"
      >
        User
      </Link>
    </>
  );
}

function Profile({ user, loading, handleLogout }: any) {
  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn rounded-full p-2 size-12 flex items-center justify-center"
      >
        {/* Placeholder untuk trigger dropdown, bisa diganti dengan avatar */}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu min-w-60 max-w-2xl min-h-40 bg-base-100 rounded-2xl z-1 mt-2 p-3 shadow-md"
      >
        <div className="flex items-center justify-start gap-4 max-w-2xl min-h-16 border-2 p-2 rounded-xl shadow-2xs mb-2">
          <div className="rounded-full size-10 bg-gray-200"></div>
          <div className="flex-col">
            <p className="font-semibold text-base">
              {loading ? "Loading..." : user ? user.nama_depan : "Guest"}
            </p>
            <Link
              href="/wallet"
              className="flex flex-row items-center gap-2"
            >
              <img
                src="/image/coin.svg"
                alt="Coin Icon"
                className="size-5 object-cover"
              />
              <p className="text-base">
                {loading ? "Rp 0,00" : user ? formatIDR(user.saldo) : "Rp 0,00"}
              </p>
            </Link>
          </div>
        </div>
        <Link
          href="/wallet"
          className="bg-white hover:bg-pink hover:text-white rounded-3xl px-5 py-2 font-semibold transition duration-300 hover:scale-105"
        >
          Dompet
        </Link>
        <div
          onClick={handleLogout}
          className="flex justify-between pr-4 bg-white hover:bg-pink hover:text-white rounded-3xl px-5 py-2 font-semibold transition duration-300 hover:scale-105 cursor-pointer"
        >
          <span>Logout</span>
          <img
            src="/image/logout.svg"
            alt="Coin Icon"
            className="size-4 object-cover"
          />
        </div>
      </ul>
    </div>
  );
}