import { useEffect, useState, useMemo } from "react";
import { Image as ImageIcon, Pencil, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { ProductForm } from "../components/ProductForm";
import EditProductModal from "../components/EditProductModal";
import { getCategories, getAllProducts, setProductActive, getErrorMessage } from "../services/ProductService";
import type { Product } from "../services/ProductService";
import { formatPrice } from "../utils/formatPrice";
import { useAlert } from "../context/AlertContext";
import NavBar from "../components/NavBar";
import SideMenu from "../components/SideMenu";
import BottomNav from "../components/BottomNav";

interface Category {
    id: string;
    name: string;
}

const ITEMS_PER_PAGE_ADMIN = 10;

type StatusFilter = "all" | "active" | "inactive";

/* Página administrativa para cargar categorías, crear productos, y editar/dar de baja los que ya existen */
export default function AdminProducts() {
    const { showAlert } = useAlert();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);

    /* Lista de productos existentes (activos e inactivos), para poder editarlos o darlos de baja */
    const [products, setProducts] = useState<Product[]>([]);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    /* Evita doble clic en desactivar/reactivar mientras responde Supabase */
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    /* Filtros */
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    const loadProducts = () => {
        getAllProducts()
            .then(setProducts)
            .catch((err) =>
                showAlert({
                    title: "No se pudieron cargar los productos",
                    message: getErrorMessage(err),
                    variant: "error",
                })
            );
    };

    /* Consulta las categorías disponibles y los productos ya creados cuando se abre la página */
    useEffect(() => {
        Promise.all([getCategories(), getAllProducts()])
            .then(([cats, prods]) => {
                setCategories(cats);
                setProducts(prods);
            })
            .catch((err) => {
                showAlert({
                    title: "No se pudieron cargar los datos",
                    message: getErrorMessage(err),
                    variant: "error",
                });
            })
            .finally(() => setLoading(false));
    }, []);

    const handleToggleActive = async (product: Product) => {
        setTogglingId(product.id);
        try {
            await setProductActive(product.id, !product.is_active);
            showAlert({
                title: product.is_active ? "Producto desactivado" : "Producto reactivado",
                message: product.is_active
                    ? "Ya no va a aparecer en la tienda."
                    : "El producto vuelve a estar disponible en la tienda.",
                variant: "success",
            });
            loadProducts();
        } catch (err) {
            showAlert({
                title: "No se pudo actualizar el producto",
                message: getErrorMessage(err),
                variant: "error",
            });
        } finally {
            setTogglingId(null);
        }
    };

    /* Filtrado por búsqueda y estado */
    const filteredProducts = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        return products.filter((product) => {
            const matchesSearch =
                term === "" ||
                product.name.toLowerCase().includes(term) ||
                product.categories?.name?.toLowerCase().includes(term);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && product.is_active) ||
                (statusFilter === "inactive" && !product.is_active);

            return matchesSearch && matchesStatus;
        });
    }, [products, searchTerm, statusFilter]);

    const totalPages = useMemo(() => {
        return Math.ceil(filteredProducts.length / ITEMS_PER_PAGE_ADMIN) || 1;
    }, [filteredProducts]);

    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE_ADMIN;
        return filteredProducts.slice(start, start + ITEMS_PER_PAGE_ADMIN);
    }, [filteredProducts, currentPage]);

    /* Resetea a página 1 cuando cambian filtros o total */
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, filteredProducts.length]);

    /* Ajusta página si queda fuera de rango tras cambios */
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    return (
        <div className="min-h-screen bg-white pb-48">
            <div className="sticky top-0 z-40">
                <NavBar onMenuClick={() => setMenuOpen(true)} />
                <BottomNav />
            </div>

            <main className="p-4 sm:p-6 max-w-6xl mx-auto">
                {loading ? (
                    <p className="text-sm text-[#537a63] text-center py-10">Cargando...</p>
                ) : (
                    <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
                        {/* Botón añadir producto */}
                        <div className="w-full lg:w-auto">
                            <button
                                className="
                                    w-full sm:w-auto
                                    btn btn-Secondary btn-sm md:btn-md
                                    bg-white border border-[#e8efe4] text-textoNegro
                                    hover:bg-fondoGlobal hover:border-[#d7e3d0]
                                    transition-all duration-300
                                     lg:shadow-none"
                                onClick={() => setRegisterOpen(true)}
                            >
                                Añadir producto
                            </button>
                        </div>

                        {/* Lista de productos ya creados, para poder editarlos o darlos de baja */}
                        <div className="w-full lg:flex-1">
                            <h2 className="text-base sm:text-lg font-bold text-[#26623f] mb-4">
                                Productos existentes
                            </h2>

                            {/* Filtros */}
                            <div className="flex flex-col gap-3 mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Buscar por nombre o categoría..."
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-[#e8efe4] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#4E705B]/20 focus:border-[#4E705B] transition"
                                    />
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter("all")}
                                        className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition ${
                                            statusFilter === "all"
                                                ? "bg-[#4E705B] text-white "
                                                : "bg-white text-[#2D4A3E] border border-[#e8efe4] hover:bg-slate-50"
                                        }`}
                                    >
                                        Todas ({products.length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter("active")}
                                        className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition ${
                                            statusFilter === "active"
                                                ? "bg-[#4E705B] text-white "
                                                : "bg-white text-[#2D4A3E] border border-[#e8efe4] hover:bg-slate-50"
                                        }`}
                                    >
                                        Activas ({products.filter((p) => p.is_active).length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setStatusFilter("inactive")}
                                        className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition ${
                                            statusFilter === "inactive"
                                                ? "bg-[#4E705B] text-white shadow-sm"
                                                : "bg-white text-[#2D4A3E] border border-[#e8efe4] hover:bg-slate-50"
                                        }`}
                                    >
                                        Desactivadas ({products.filter((p) => !p.is_active).length})
                                    </button>
                                </div>
                            </div>

                            {filteredProducts.length === 0 ? (
                                <p className="text-xs sm:text-sm text-[#537a63] text-center py-6">
                                    {products.length === 0
                                        ? "Todavía no hay productos creados."
                                        : "No se encontraron productos con los filtros aplicados."}
                                </p>
                            ) : (
                                <>
                                    <div className="space-y-3">
                                        {paginatedProducts.map((product) => (
                                            <div
                                                key={product.id}
                                                className={`bg-white border border-[#e8efe4] rounded-2xl p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-sm ${
                                                    !product.is_active ? "opacity-60" : ""
                                                }`}
                                            >
                                                <div className="w-full h-40 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                                    {product.image_url ? (
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                            <ImageIcon className="w-6 h-6 sm:w-5 sm:h-5" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0 w-full sm:w-auto">
                                                    <p className="text-sm font-bold text-[#1F2937] truncate">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                        {product.categories?.name ?? "Sin categoría"} · ₡{formatPrice(product.price)} · Stock: {product.stock}
                                                    </p>
                                                    {!product.is_active && (
                                                        <span className="inline-block mt-1 text-[10px] font-semibold text-red-600">
                                                            Desactivado
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                                                    <button
                                                        onClick={() => setProductToEdit(product)}
                                                        className="p-2 rounded-full bg-[#f0f4ee] text-[#4E705B] hover:bg-[#e0ebe0] flex-shrink-0"
                                                        title="Editar"
                                                        aria-label="Editar producto"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>

                                                    <button
                                                        onClick={() => handleToggleActive(product)}
                                                        disabled={togglingId === product.id}
                                                        className={`px-3 py-2 rounded-full text-xs font-semibold flex-shrink-0 transition disabled:opacity-50 ${
                                                            product.is_active
                                                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                                                : "bg-[#e3f3e9] text-[#3E5C4A] hover:bg-[#d4ecdd]"
                                                        }`}
                                                    >
                                                        {togglingId === product.id
                                                            ? "..."
                                                            : product.is_active
                                                            ? "Desactivar"
                                                            : "Reactivar"}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="flex flex-col items-center gap-2 mt-4 sm:flex-row sm:justify-center">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    disabled={currentPage === 1}
                                                    onClick={() => setCurrentPage((prev) => prev - 1)}
                                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white text-[#2D4A3E] hover:bg-slate-50 disabled:opacity-40 transition  text-xs sm:px-3"
                                                    aria-label="Página anterior"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Anterior</span>
                                                </button>

                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                                        const isCurrent = page === currentPage;
                                                        return (
                                                            <button
                                                                key={page}
                                                                type="button"
                                                                onClick={() => setCurrentPage(page)}
                                                                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs font-bold transition ${
                                                                    isCurrent
                                                                        ? "bg-[#4E705B] text-white"
                                                                        : "bg-white text-[#2D4A3E] hover:bg-slate-50"
                                                                }`}
                                                            >
                                                                {page}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                <button
                                                    type="button"
                                                    disabled={currentPage === totalPages}
                                                    onClick={() => setCurrentPage((prev) => prev + 1)}
                                                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white text-[#2D4A3E] hover:bg-slate-50 disabled:opacity-40 transition  text-xs sm:px-3"
                                                    aria-label="Página siguiente"
                                                >
                                                    <span className="hidden sm:inline">Siguiente</span>
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <span className="text-xs text-slate-500 font-medium">
                                                Página {currentPage} de {totalPages}
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <ProductForm
                isOpen={registerOpen}
                onClose={() => setRegisterOpen(false)}
                categories={categories}
                onSuccess={() => {
                    showAlert({
                        title: "Producto añadido",
                        message: "El producto ya está disponible en el catálogo.",
                        variant: "success",
                    });
                    loadProducts();
                }}
                onError={(message) =>
                    showAlert({
                        title: "No se pudo guardar el producto",
                        message,
                        variant: "error",
                    })
                }
            />
            {productToEdit && (
                <EditProductModal
                    product={productToEdit}
                    categories={categories}
                    onClose={() => setProductToEdit(null)}
                    onSuccess={() => {
                        setProductToEdit(null);
                        showAlert({
                            title: "Producto actualizado",
                            message: "Los cambios ya están guardados.",
                            variant: "success",
                        });
                        loadProducts();
                    }}
                    onError={(message) =>
                        showAlert({
                            title: "No se pudo editar el producto",
                            message,
                            variant: "error",
                        })
                    }
                />
            )}
            <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>
    );
}