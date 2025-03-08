import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import React from "react";
import NavbarUser from "../Components/NavbarUser";
import Navbar from "../Components/DashboardUser/Navbar";
import Footer from "../Components/Footer";
import axios from "axios";

interface AuthLayoutProps {
  useDashboardNavbar?: boolean;
}

interface User {
  id: number;
  nama_depan: string;
  nama_belakang: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true
});

export const useAuth = () => useContext(AuthContext);

const AuthLayout: React.FC<PropsWithChildren<AuthLayoutProps>> = ({ children, useDashboardNavbar = false }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token available");
    
        const response = await axios.get("/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("User fetched:", response.data.user);
        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}> {/* Tambahkan setUser */}
      {useDashboardNavbar ? <Navbar /> : <NavbarUser />}
      <main>{loading ? <p>Loading...</p> : children}</main>
      <Footer />
    </AuthContext.Provider>
  );
};

export default AuthLayout;
