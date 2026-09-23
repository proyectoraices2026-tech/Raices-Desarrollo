import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, Pencil } from "lucide-react";
import { ProductForm } from "../components/ProductForm";
import EditProductModal from "../components/EditProductModal";
import { getCategories, getAllProducts, setProductActive, getErrorMessage } from "../services/ProductService";
import type { Product } from "../services/ProductService";
import { useAlert } from "../context/AlertContext";

interface Category {
    id: string;
    name: string;
}

/* Página administrativa para cargar categorías, crear productos, y editar/dar de baja los que ya existen */
export default function AdminProducts() {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    /* Lista de productos existentes (activos e inactivos), para poder editarlos o darlos de baja */
    const [products, setProducts] = useState<Product[]>([]);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);
    /* Evita doble clic en desactivar/reactivar mientras responde Supabase */
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const loadProducts = () => {
        getAllProducts()
            .then(setProducts)
            .catch((err) => showAlert({ title: "No se pudieron cargar los productos", message: getErrorMessage(err), variant: "error" }));
    };

    /* Consulta las categorías disponibles y los productos ya creados cuando se abre la página */
    useEffect(() => {
        Promise.all([getCategories(), getAllProducts()])
            .then(([cats, prods]) => {
                setCategories(cats);
                setProducts(prods);
            })
            .catch(console.error)
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

    return (
        <div className="min-h-screen bg-[#F4F6F3]">
            <header className="bg-[#DCE3DB] px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <button
                    onClick={() => navigate("/catalog")}
                    className="p-2 -ml-2 rounded-full hover:bg-white/50 text-[#26623f]"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-bold text-[#26623f]">Gestionar productos</h1>
            </header>

            <main className="p-4 sm:p-6 max-w-lg mx-auto">
                {/* Evita mostrar el formulario antes de tener las categorías */}
                {/*
                    Se puso de esta forma para que aparezca la opción de volver al catálogo mientras se cargan las categorías, en lugar de mostrar una pantalla que no permite hacer nada.
                */}
                {loading ? (
                    <p className="text-sm text-[#537a63] text-center py-10">Cargando...</p>
                ) : (
                    <>
                        <ProductForm
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

                        {/* Lista de productos ya creados, para poder editarlos o darlos de baja */}
                        <div className="mt-8">
                            <h2 className="text-sm font-bold text-[#26623f] mb-3">Productos existentes</h2>

                            {products.length === 0 ? (
                                <p className="text-xs text-[#537a63] text-center py-6">Todavía no hay productos creados.</p>
                            ) : (
                                <div className="space-y-3">
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            className={`bg-white rounded-2xl p-3 flex items-center gap-3 shadow-sm ${!product.is_active ? "opacity-60" : ""}`}
                                        >
                                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                        <ImageIcon className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-[#1F2937] truncate">{product.name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {product.categories?.name ?? "Sin categoría"} · ${product.price.toLocaleString()} · Stock: {product.stock}
                                                </p>
                                                {!product.is_active && (
                                                    <span className="text-[10px] font-semibold text-red-600">Desactivado</span>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => setProductToEdit(product)}
                                                className="p-2 rounded-full bg-[#f0f4ee] text-[#4E705B] hover:bg-[#e0ebe0] flex-shrink-0"
                                                title="Editar"
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
                                                {togglingId === product.id ? "..." : product.is_active ? "Desactivar" : "Reactivar"}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>

            {productToEdit && (
                <EditProductModal
                    product={productToEdit}
                    categories={categories}
                    onClose={() => setProductToEdit(null)}
                    onSuccess={() => {
                        setProductToEdit(null);
                        showAlert({ title: "Producto actualizado", message: "Los cambios ya están guardados.", variant: "success" });
                        loadProducts();
                    }}
                    onError={(message) =>
                        showAlert({ title: "No se pudo editar el producto", message, variant: "error" })
                    }
                />
            )}
        </div>
    );
}