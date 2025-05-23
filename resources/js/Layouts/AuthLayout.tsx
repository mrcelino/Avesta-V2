import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import React from "react";
import NavbarUser from "../Components/NavbarUser";
import Navbar from "../Components/DashboardUser/Navbar";
import NavbarClean from "@/Components/DashboardUser/NavbarClean";
import NavbarAdmin from "@/Pages/Dashboard-Mitra/Components/NavbarAdmin";
import Footer from "../Components/Footer";
import axios from "axios";

interface AuthLayoutProps {
  useDashboardNavbar?: boolean;
  useCleanNavbar?: boolean;
  useAdminNavbar?: boolean;
}

interface User {
  id_user: number;
  nama_depan: string;
  nama_belakang: string;
  email: string;
  role: string;
  password: string;
  saldo: string;
}

export interface Product {
  id_unggas: number;
  jenis_unggas: string;
  deskripsi: string;
  penjualan: number;
  harga_per_kg: string;
  stok: number;
  foto_unggas: string;
  created_at: string;
  warung: {
      id_warung: number;
      nama_warung: string;
      alamat_warung: string;
      kelurahan: string;
      foto_warung: string;
      latitude: string | null; 
      longitude: string | null;
  };
}

export interface CartItem extends Product {
  quantity: number;
  catatan?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => boolean;
  updateQuantity: (id_unggas: number, quantity: number) => void;
  removeFromCart: (id_unggas: number) => void;
  setNote: (id_unggas: number, note: string) => void;
  clearCart: () => void;
  cartTotal: string; // Tambah cartTotal
  showSwitchStoreModal: boolean;
  setShowSwitchStoreModal: (value: boolean) => void;
  checkStoreMatch: (product: Product) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
});

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useAuth = () => useContext(AuthContext);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
      throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

const CartProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showSwitchStoreModal, setShowSwitchStoreModal] = useState(false);

  // Fungsi untuk cek apakah warung sama dengan yang ada di keranjang
  const checkStoreMatch = (product: Product) => {
    if (cart.length === 0) {
      return true; // Kalo keranjang kosong, anggap match
    }
    const currentStoreId = cart[0].warung.id_warung;
    return currentStoreId === product.warung.id_warung;
  };
  
  // Hitung total belanjaan
  const cartTotal = cart.reduce((total, item) => total + parseFloat(item.harga_per_kg) * item.quantity, 0).toFixed(2);
  useEffect(() => {
      localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1): boolean => {
      setCart((prevCart) => {
          const existingItem = prevCart.find((item) => item.id_unggas === product.id_unggas);
          if (existingItem) {
              const newCart = prevCart.map((item) =>
                  item.id_unggas === product.id_unggas
                      ? { ...item, quantity: item.quantity + quantity }
                      : item
              );
              return newCart;
          }
          const newItem = { ...product, quantity, catatan: "" };
          return [...prevCart, newItem];
      });
      return true;
  };

  const updateQuantity = (id_unggas: number, quantity: number) => {
      setCart((prevCart) =>
          prevCart.map((item) =>
              item.id_unggas === id_unggas ? { ...item, quantity: Math.max(1, quantity) } : item
          )
      );
  };

  const removeFromCart = (id_unggas: number) => {
      setCart((prevCart) => prevCart.filter((item) => item.id_unggas !== id_unggas));
  };

  const setNote = (id_unggas: number, note: string) => {
      setCart((prevCart) =>
          prevCart.map((item) =>
              item.id_unggas === id_unggas ? { ...item, catatan: note } : item
          )
      );
  };

  const clearCart = () => {
      setCart([]);
  };

  return (
      <CartContext.Provider
          value={{
            cart,
            addToCart,
            updateQuantity,
            removeFromCart,
            setNote,
            clearCart,
            cartTotal,
            showSwitchStoreModal,
            setShowSwitchStoreModal,
            checkStoreMatch,
          }}
      >
          {children}
      </CartContext.Provider>
  );
};

const AuthLayout: React.FC<PropsWithChildren<AuthLayoutProps>> = ({
  children,
  useDashboardNavbar = false,
  useCleanNavbar = false, // Tambah default false
  useAdminNavbar = false,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchUser = async () => {
          try {
              console.log("AuthLayout: Fetching /api/me...");
              const response = await axios.get("/api/me", {
                  withCredentials: true,
              });
              console.log("AuthLayout: Fetch success, response:", response.data);
              setUser(response.data.user);
          } catch (error) {
              console.error("AuthLayout: Fetch failed:", {
                  message: (error as any).message,
                  status: (error as any).response?.status,
                  data: (error as any).response?.data,
              });
              setUser(null);
              if (axios.isAxiosError(error) && error.response?.status === 401) {
                  console.log("AuthLayout: Unauthorized, redirecting to /login");
                  window.location.href = "/login";
              }
          } finally {
              console.log("AuthLayout: Fetch complete, loading:", false);
              setLoading(false);
          }
      };

      fetchUser();
  }, []);

  console.log("AuthLayout rendered, user:", user, "loading:", loading);
  if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-pink-500"></div>
            </div>
        );
    }

    if (!user) {
        console.log("AuthLayout: No user after fetch, redirecting...");
        window.location.href = "/login";
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p>Redirecting to login...</p>
            </div>
        );
    }
  return (
      <AuthContext.Provider value={{ user, setUser, loading}}>
          <CartProvider>
                <>
                    {useCleanNavbar ? (
                        <NavbarClean />
                    ) : useAdminNavbar ? (
                        <NavbarAdmin />
                    ) : useDashboardNavbar ? (
                        <Navbar />
                    ) : (
                        <NavbarUser />
                    )}
                    <main>{children}</main>
                    <Footer />
                </>
          </CartProvider>
      </AuthContext.Provider>
  );
};

export default AuthLayout;