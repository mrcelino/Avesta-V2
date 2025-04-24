import Navbar from "./NavbarAdmin";
import Sidebar from "./Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-[#F8F8F8]">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <div className="flex-1 ml-72 mt-20 p-6">{children}</div>
            </div>
        </div>
    );
}