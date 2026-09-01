import { useState } from "react";
import type { SubmitEvent } from "react";
import { createProduct } from "../services/ProductService";

interface ProductFormProps {
    categories: { id: string; name: string }[];
    onSuccess?: () => void;
}

export function ProductForm({ categories, onSuccess }: ProductFormProps) {
    const [sku, setSku] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [minStock, setMinStock] = useState("0");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (!imageFile) {
            setError("Debes seleccionar una imagen.");
            return;
        }

        setLoading(true);
        try {
            await createProduct({
                category_id: categoryId,
                sku,
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock, 10),
                min_stock: parseInt(minStock, 10),
                imageFile,
            });

            // limpiar formulario
            setSku("");
            setName("");
            setDescription("");
            setCategoryId("");
            setPrice("");
            setStock("");
            setMinStock("0");
            setImageFile(null);

            onSuccess?.();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al crear el producto.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && <p role="alert">{error}</p>}

            <label>
                SKU
                <input value={sku} onChange={(e) => setSku(e.target.value)} required />
            </label>

            <label>
                Nombre
                <input value={name} onChange={(e) => setName(e.target.value)} required />
            </label>

            <label>
                Descripción
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>

            <label>
                Categoría
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                    <option value="">Selecciona una categoría</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </label>

            <label>
                Precio
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </label>

            <label>
                Stock
                <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                />
            </label>

            <label>
                Stock mínimo
                <input
                    type="number"
                    min="0"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                />
            </label>

            <label>
                Imagen
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                    required
                />
            </label>

            <button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Añadir producto"}
            </button>
        </form>
    );
}