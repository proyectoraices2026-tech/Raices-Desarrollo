import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "../components/ProductForm";
import { getCategories } from "../services/ProductService";
import { useAlert } from "../context/AlertContext";

interface Category {
    id: string;
    name: string;
}

/* Página administrativa para cargar categorías y crear productos */
export default function AdminProducts() {
    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    /* Consulta las categorías disponibles cuando se abre la página */
    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-[#F4F6F3]">
            <header className="bg-[#DCE3DB] px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <button
                    onClick={() => navigate("/catalog")}
                    className="p-2 -ml-2 rounded-full hover:bg-white/50 text-[#26623f]"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-lg font-bold text-[#26623f]">Añadir producto</h1>
            </header>

            <main className="p-4 sm:p-6 max-w-lg mx-auto">
                {/* Evita mostrar el formulario antes de tener las categorías */}
                {/*
                    Se puso de esta forma para que aparezca la opción de volver al catálogo mientras se cargan las categorías, en lugar de mostrar una pantalla que no permite hacer nada.
                */}
                {loading ? (
                    <p className="text-sm text-[#537a63] text-center py-10">Cargando...</p>
                ) : (
                    <ProductForm
                        categories={categories}
                        onSuccess={() =>
                            showAlert({
                                title: "Producto añadido",
                                message: "El producto ya está disponible en el catálogo.",
                                variant: "success",
                            })
                        }
                         onError={(message) =>
                            showAlert({
                                title: "No se pudo guardar el producto",
                                message,
                                variant: "error",
                            })
                        }
                    />
                )}
            </main>
        </div>
    );
}