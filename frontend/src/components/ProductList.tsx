import { useEffect, useState } from "react";
import { getActiveProducts } from "../services/ProductService";
import type { Product } from "../services/ProductService";

/* Componente que consulta y muestra únicamente los productos activos */
export function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /* Obtiene los productos una sola vez cuando se monta el componente */
    useEffect(() => {
        getActiveProducts()
            .then(setProducts)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    /* Mientras llega la respuesta se informa que la consulta sigue en proceso */
    if (loading) return <p>Cargando productos...</p>;
    /* Si la consulta falla, se muestra el mensaje recibido */
    if (error) return <p role="alert">Error: {error}</p>;

    /* Recorre los productos y presenta sus datos principales */
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