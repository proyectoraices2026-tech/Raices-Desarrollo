// src/pages/AdminAssignPlants.tsx

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useAlert } from "../context/AlertContext";
import PlantProductCard from "../components/PlantProductCard";
import RegisterPlantModal from "../components/RegisterPlantModal";
import { getErrorMessage, getPlantProducts } from "../services/ProductService";
import type { Product } from "../services/ProductService";
import { findUsersByEmail } from "../services/AdminUsersService";
import type { FoundUser } from "../services/AdminUsersService";

//aaa
import SideMenu from "../components/SideMenu";
import BottomNav from "../components/BottomNav";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { ArrowNavigateUp } from "../components/ArrowNavigateUp";

export default function AdminAssignPlants() {
    const { showAlert } = useAlert();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState<FoundUser[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState<FoundUser | null>(null);

    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    /* Carga los productos que tienen datos de planta */
    useEffect(() => {
        getPlantProducts()
            .then(setProducts)
            .catch((err) =>
                showAlert({
                    title: "No se pudieron cargar los productos",
                    message: getErrorMessage(err),
                    variant: "error",
                })
            )
            .finally(() => setLoadingProducts(false));
        // showAlert se recrea en cada render del provider; incluirlo repetiría la carga
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* Búsqueda por email con una pequeña espera (350 ms) para no consultar en cada tecla */
    useEffect(() => {
        const trimmed = query.trim();
        if (selectedUser || trimmed.length < 3) {
            setResults([]);
            return;
        }

        let cancelled = false;
        const timer = setTimeout(async () => {
            setSearching(true);
            try {
                const found = await findUsersByEmail(trimmed);
                if (!cancelled) setResults(found);
            } catch (err) {
                if (!cancelled) {
                    showAlert({ title: "No se pudo buscar", message: getErrorMessage(err), variant: "error" });
                }
            } finally {
                if (!cancelled) setSearching(false);
            }
        }, 350);

        return () => {
            cancelled = true;
            clearTimeout(timer);
            setSearching(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, selectedUser]);

    const handleSelectUser = (user: FoundUser) => {
        setSelectedUser(user);
        setQuery("");
        setResults([]);
    };

    const handleSelectProduct = (product: Product) => {
        if (!selectedUser) {
            showAlert({
                title: "Selecciona un usuario",
                message: "Primero busca por email al usuario al que le vas a asignar la planta.",
                variant: "info",
            });
            return;
        }
        setSelectedProduct(product);
    };

    /* Controla si el panel lateral (menú) está abierto o cerrado */
    const [menuOpen, setMenuOpen] = useState(false);

    /* Lleva al usuario hasta el principio de la página buscando el primer elemento de la misma (id="first") */
    const handleScrollUp = () => {
        document.getElementById("first")?.scrollIntoView({ behavior: "smooth" });
    };

    return (

    <div className="min-h-screen flex flex-col">
        <div className="sticky top-0 z-40">
                <NavBar
                    onMenuClick={() => setMenuOpen(true)}
                />
                <BottomNav />
            </div>
        
        <main id="first" className="max-w-5xl mx-auto px-4 py-6 space-y-6">

            

            <div>
                <h1 className="text-xl font-bold text-[#1e2d24]">Asignar plantas</h1>
                <p className="text-sm text-[#537a63]">
                    Busca al usuario por email y elige la planta comprada para registrársela con sus cuidados recomendados.
                </p>
            </div>

            {/* Paso 1: usuario */}
            <section className="space-y-2">
                <h2 className="text-sm font-semibold text-[#2D4A3E]">1. Usuario</h2>

                {selectedUser ? (
                    <div className="flex items-center justify-between gap-3 bg-[#f5f7f2] border border-[#e8efe4] rounded-xl px-4 py-3">
                        <div className="min-w-0">
                            <p className="text-sm font-bold text-[#1e2d24] truncate">{selectedUser.name || "Sin nombre"}</p>
                            <p className="text-xs text-[#537a63] truncate">{selectedUser.email}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSelectedUser(null)}
                            className="px-4 py-2 rounded-full bg-white border border-[#c8dcc2] text-[#2D4A3E] text-xs font-semibold hover:bg-[#f0f5ec] transition flex-shrink-0"
                        >
                            Cambiar
                        </button>
                    </div>
                ) : (
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar usuario por email (mínimo 3 caracteres)"
                            aria-label="Buscar usuario por email"
                            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-[#c8dcc2] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4E705B] text-sm transition"
                        />

                        {searching && <p className="text-xs text-slate-400 mt-2">Buscando...</p>}

                        {!searching && query.trim().length >= 3 && results.length === 0 && (
                            <p className="text-xs text-slate-400 mt-2">No se encontraron usuarios con ese email.</p>
                        )}

                        {results.length > 0 && (
                            <ul className="absolute z-10 left-0 right-0 mt-2 bg-white border border-[#e8efe4] rounded-xl shadow-lg overflow-hidden">
                                {results.map((user) => (
                                    <li key={user.id}>
                                        <button
                                            type="button"
                                            onClick={() => handleSelectUser(user)}
                                            className="w-full text-left px-4 py-2.5 hover:bg-[#f5f7f2] transition"
                                        >
                                            <p className="text-sm font-semibold text-[#1e2d24] truncate">{user.email}</p>
                                            {user.name && <p className="text-xs text-[#537a63] truncate">{user.name}</p>}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </section>

            {/* Paso 2: planta */}
            <section className="space-y-3">
                <h2 className="text-sm font-semibold text-[#2D4A3E]">2. Planta</h2>

                {loadingProducts ? (
                    <p className="text-sm text-slate-400">Cargando plantas...</p>
                ) : products.length === 0 ? (
                    <p className="text-sm text-slate-500">
                        Aún no hay productos con datos de planta. Márcalos con "Es una planta" al editar un producto.
                    </p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {products.map((product) => (
                            <PlantProductCard key={product.id} product={product} onSelect={handleSelectProduct} />
                        ))}
                    </div>
                )}
            </section>

            {/* Se monta solo con usuario y producto elegidos; el key reinicia el formulario entre productos */}
            {selectedProduct && selectedUser && (
                <RegisterPlantModal
                    key={selectedProduct.id}
                    isOpen
                    onClose={() => setSelectedProduct(null)}
                    targetUserId={selectedUser.id}
                    targetUserLabel={selectedUser.name || selectedUser.email}
                    prefillProduct={selectedProduct}
                />
            )}

            
        </main>
        <ArrowNavigateUp handleUpNavigate={handleScrollUp}></ArrowNavigateUp>

            {/* Footer con información, contacto y ubicación */}
            <Footer />

            {/* Panel lateral, visible en toda la pantalla del catálogo */}
            <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div> 

        
        
    );
}