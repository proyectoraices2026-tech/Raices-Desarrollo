import { ProductList } from "../components/ProductList";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PButton from "../components/PButton";
import logoImage from '../assets/Raiz.png';

/* Página privada que muestra el catálogo y las acciones disponibles para el rol */
export default function Catalog() {
    const navigate = useNavigate();
    const { role } = useAuth();
    const [loading] = useState(false);
  /* Envía al administrador al formulario para añadir productos */
    const handleAddProduct = async () => {
        navigate("/admin/products/new");
    };

    return (
        <div className="min-h-screen bg-[#F4F6F3] pb-12">
            
            {/* Header Raíces */}
            <header className="bg-[#DCE3DB] px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
         <img
             src={logoImage}
                alt="Raíces Logo"
             className="h-10 sm:h-10 md:h-12 w-auto object-contain mx-auto"
            />
                    <span className="text-2xl font-bold text-[#26623f] tracking-tight"></span>
                    
                </div>
{/* El botón de alta solo se muestra a usuarios con rol administrador */}
                {role === "admin" && (
                    <PButton onClick={handleAddProduct} disabled={loading} label="Añadir">
                        {loading ? <span className="loading loading-spinner" /> : "Añadir"}
                    </PButton>
                )}
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

        </div>
    );
}