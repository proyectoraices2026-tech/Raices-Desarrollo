import { ProductList } from "../components/ProductList";
import { useState } from "react";
import SideMenu from "../components/SideMenu";
import BottomNav from "../components/BottomNav";
import NavBar from "../components/NavBar";

/* Página privada que muestra el catálogo y las acciones disponibles para el rol */
export default function Catalog() {
    
    /* Controla si el panel lateral (menú) está abierto o cerrado */
    const [menuOpen, setMenuOpen] = useState(false);

    /* Envía al administrador a la pantalla de gestión de productos (crear, editar, desactivar) */
    

    return (
        <div className="min-h-screen bg-[#F4F6F3] pb-28">

            <NavBar
                onMenuClick={() => setMenuOpen(true)}
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