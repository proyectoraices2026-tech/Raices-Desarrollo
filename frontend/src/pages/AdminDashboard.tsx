import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import NavBar from "../components/NavBar";
import SideMenu from "../components/SideMenu";
import statsIcon from "../assets/dashboard/stats.svg";
import shopIcon from "../assets/dashboard/shop.svg";
import requestsIcon from "../assets/dashboard/requests.svg";

/* Los 3 accesos del dashboard de admin. Las estadísticas (dona + ganancias)
   se movieron a su propia página, /admin/stats. */
const DASHBOARD_CARDS = [
    { key: "stats", label: "Estadísticas", icon: statsIcon, path: "/admin/stats" },
    { key: "catalog", label: "Gestionar catálogo", icon: shopIcon, path: "/admin/products/new" },
    { key: "requests", label: "Gestionar pedidos", icon: requestsIcon, path: "/admin/requests" },
] as const;

export default function AdminDashboard() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white pb-48">
            <div className="sticky top-0 z-40">
                <NavBar onMenuClick={() => setMenuOpen(true)} />
                <BottomNav />
            </div>

            <div className="md:max-w-5xl md:mx-auto p-5 md:px-12 md:py-8">
                <h1 className="font-poppins text-3xl md:text-4xl leading-tight font-bold text-primarioOscuro mb-1">
                    Dashboard de administrador
                </h1>
                <p className="text-sm text-primarioBase mb-8">Elige qué quieres revisar o gestionar.</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {DASHBOARD_CARDS.map((card) => (
                        <button
                            key={card.key}
                            onClick={() => navigate(card.path)}
                            className="bg-white border border-[#e8efe4] rounded-2xl flex flex-col items-center justify-center gap-4 py-10 px-5 hover:border-primarioClaro hover:bg-tarjeta transition"
                        >
                            <img src={card.icon} alt="" className="w-16 h-16 object-contain" aria-hidden="true" />
                            <span className="text-sm font-bold text-primarioOscuro text-center">{card.label}</span>
                        </button>
                    ))}
                </div>

                <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
            </div>
        </div>
    );
}
