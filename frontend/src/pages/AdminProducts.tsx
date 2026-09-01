import { useEffect, useState } from "react";
import { ProductForm } from "../components/ProductForm";
import { getCategories } from "../services/ProductService";

interface Category {
    id: string;
    name: string;
}

export default function AdminProducts() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCategories()
            .then(setCategories)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Cargando...</p>;

    return (
        <div>
            <h1>Añadir producto</h1>
            <ProductForm categories={categories} />
        </div>
    );
}