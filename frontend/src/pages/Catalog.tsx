import { ProductList } from "../components/ProductList";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PButton from "../components/PButton";
import SideMenu from "../components/SideMenu";
import BottomNav from "../components/BottomNav";
import NavBar from "../components/NavBar";

/* Página privada que muestra el catálogo y las acciones disponibles para el rol */
export default function Catalog() {
    const navigate = useNavigate();
    const { role } = useAuth();
    const [loading] = useState(false);
    /* Controla si el panel lateral (menú) está abierto o cerrado */
    const [menuOpen, setMenuOpen] = useState(false);

    /* Envía al administrador a la pantalla de gestión de productos (crear, editar, desactivar) */
    const handleManageProducts = async () => {
        navigate("/admin/products/new");
    };

    return (
        <div className="min-h-screen bg-[#F4F6F3] pb-28">

            <NavBar
                onMenuClick={() => setMenuOpen(true)}
                extraActions={
                    /* El botón de alta solo se muestra a usuarios con rol administrador */
                    role === "admin" ? (
                        <PButton onClick={handleManageProducts} disabled={loading} label="Gestionar productos">
                            {loading ? <span className="loading loading-spinner" /> : "Gestionar productos"}
                        </PButton>
                    ) : undefined
                }
            />

            {/* Banner Verdoso */}
            <div className="bg-[#537A63] text-white px-6 py-5">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-xl font-bold">Todo para tus plantas</h1>
                    <p className="text-xs text-white/80 mt-0.5">Envío gratis en pedidos +$25.000</p>
                </div>
            </div>

            {/* Contenido Principal */}
            <main className="p-4 sm:p-6">
                <ProductList />
            </main>

            {/* Panel lateral y barra inferior, visibles en toda la pantalla del catálogo */}
            <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
            <BottomNav />
        </div>
    );
}