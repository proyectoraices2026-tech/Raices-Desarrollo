import { useEffect, useState } from "react";
import { getActiveProducts } from "../services/ProductService";
import type { Product } from "../services/ProductService";

export function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getActiveProducts()
            .then(setProducts)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p role="alert">Error: {error}</p>;

    return (
        <div>
            {products.map((product) => (
                <article key={product.id}>
                    {product.image_url && <img src={product.image_url} alt={product.name} />}
                    <h3>{product.name}</h3>
                    <p>SKU: {product.sku}</p>
                    <p>${product.price.toFixed(2)}</p>
                    <p>{product.stock > 0 ? "Disponible" : "Sin stock"}</p>
                </article>
            ))}
        </div>
    );
}