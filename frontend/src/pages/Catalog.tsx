import { ProductList } from "../components/ProductList";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import PButton from "../components/PButton";
import SideMenu from "../components/SideMenu";
import BottomNav from "../components/BottomNav";
import logoIcon from '../assets/logo-icon.png';
import { useCart } from "../context/CartContext";

/* Página privada que muestra el catálogo y las acciones disponibles para el rol */
export default function Catalog() {
    const navigate = useNavigate();
    const { role } = useAuth();
    const [loading] = useState(false);
    /* Controla si el panel lateral (menú) está abierto o cerrado */
    const [menuOpen, setMenuOpen] = useState(false);

    /* Cantidad total de productos en el carrito*/
    const { totalItems } = useCart();

    /* Envía al administrador al formulario para añadir productos */
    const handleAddProduct = async () => {
        navigate("/admin/products/new");
    };

    return (
        <div className="min-h-screen bg-[#F4F6F3] pb-28">

            {/* Header Raíces */}
            <header className="bg-[#DCE3DB] px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                    <img
                    src={logoIcon}
                    alt="Raíces Logo"
                    className="h-7 w-auto object-contain" />
                    <span className="text-2xl font-semibold text-[#537A63]"></span>
                </div>

                {/* esto está dentro de un div para que se mantenga el diseño correcto */}
                <div className="flex items-center gap-4">
                    {/* El botón de alta solo se muestra a usuarios con rol administrador */}
                    {role === "admin" && (
                        <PButton onClick={handleAddProduct} disabled={loading} label="Añadir">
                            {loading ? <span className="loading loading-spinner" /> : "Añadir"}
                        </PButton>
                    )}

                    {/* Ícono del carrito: lleva a /cart y muestra cuántos productos hay agregados */}
                    <button
                        onClick={() => navigate("/cart")}
                        className="relative p-1 text-[#537A63]"
                        title="Carrito"
                    >
                        <ShoppingCart className="w-6 h-6" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#537A63] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </button>

                    {/* Ícono de menú: abre el panel lateral (perfil, about us, cerrar sesión) */}
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="p-1"
                        title="Menú"
                    >
                        <div className="flex flex-col gap-[3px]">
                            <span className="block w-6 h-[2.5px] bg-[#26623f]" />
                            <span className="block w-6 h-[2.5px] bg-[#26623f]" />
                            <span className="block w-6 h-[2.5px] bg-[#26623f]" />
                        </div>
                    </button>
                </div>
            </header>

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