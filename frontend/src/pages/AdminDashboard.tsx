import BottomNav from "../components/BottomNav";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

import { useState } from "react";
import SideMenu from "../components/SideMenu";


export default function AdminDashboard() {

    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleManageProducts = async () => {
        navigate("/admin/products/new");
    };

    const handleManageRequests = async () => {
        navigate("/admin/requests");
    };

    return (
        <div className="min-h-screen bg-[#f5f7f2] pb-28">
            <NavBar onMenuClick={() => setMenuOpen(true)} />

            <div className="md:max-w-5xl md:mx-auto">
                {/* Hero */}
                <div className="p-5 md:px-12 md:py-8">
                    <h1 className="font-poppins text-4xl md:text-5xl leading-tight font-bold text-[#1e2d24] mb-2">
                        <span className="block">Dashboard de aministrador</span>
                    </h1>
                    <p className="text-sm md:text-base text-[#537a63] mb-4 md:max-w-md">
                        Funciones de admin:
                    </p>

                </div>

                <div className="px-5 md:px-12">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                        <button
                            onClick={handleManageProducts}
                            className="bg-white rounded-2xl overflow-hidden border border-[#e8efe4] text-left hover:bg-[#e8efe4] hover:border-[#c8dcc2] transition"
                        >
                            
                            <div className="h-24 md:h-32 p-4">
                                <p className="text-xs font-bold text-[#1e2d24] m-2">Gestionar productos</p>
                                <p className="text-[10px] text-[#537a63]">Añadir o modificar los productos del catálogo</p>
                            </div>
                        </button>

                        <button
                            onClick={handleManageRequests}
                            className="bg-white rounded-2xl overflow-hidden border border-[#e8efe4] text-left hover:bg-[#e8efe4] hover:border-[#c8dcc2] transition"
                        >
                            
                            <div className="h-24 md:h-32 p-4">
                                <p className="text-xs font-bold text-[#1e2d24] m-2">Pedidos pendientes</p>
                                <p className="text-[10px] text-[#537a63]">Aceptar o rechazar pedidos realizados por los usuarios</p>
                            </div>
                        </button>
                    </div>
                </div>

                <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
                <BottomNav />
            </div>
        </div>
    );
}