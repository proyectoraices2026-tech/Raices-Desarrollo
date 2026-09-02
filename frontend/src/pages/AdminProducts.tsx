import { useEffect, useState } from "react";
import { ProductForm } from "../components/ProductForm";
import { getCategories } from "../services/ProductService";

interface Category {
    id: string;
    name: string;
}

/* Página administrativa para cargar categorías y crear productos */
export default function AdminProducts() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    /* Consulta las categorías disponibles cuando se abre la página */
    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    /* Evita mostrar el formulario antes de tener las categorías */
    if (loading) return <p>Cargando...</p>;

    return (
        <div>
            <h1>Añadir producto</h1>
            <ProductForm categories={categories} />
        </div>
    );
}