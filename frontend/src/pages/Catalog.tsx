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
        <div className="min-h-screen bg-white pb-28">

            <div className="sticky top-0 z-40">
                <NavBar
                    onMenuClick={() => setMenuOpen(true)}
                />
                <BottomNav />
            </div>

            {/* Contenido Principal */}
            <main className="p-4 sm:p-6">
                <ProductList />
            </main>

            {/* Panel lateral, visible en toda la pantalla del catálogo */}
            <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>
    );
}