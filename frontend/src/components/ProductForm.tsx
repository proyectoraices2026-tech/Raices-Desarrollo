import { useState } from "react";
import type { SubmitEvent } from "react";
import { createProduct } from "../services/ProductService";

interface ProductFormProps {
    categories: { id: string; name: string }[];
    onSuccess?: () => void;
    onError?: (message: string) => void;
}
/* Clase de estilo para los inputs del formulario */

const inputClass =
    "w-full px-4 py-3 bg-white border-2 border-[#c8dcc2] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4E705B] text-sm transition";const labelClass = "block text-sm font-semibold text-[#2D4A3E] mb-1.5";

/* Formulario utilizado para capturar los datos de un nuevo producto */
export function ProductForm({ categories, onSuccess, onError }: ProductFormProps) {
    /* Estados que guardan temporalmente la información introducida en el formulario */
    const [sku, setSku] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [minStock, setMinStock] = useState("0");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    /* Valida los datos básicos, crea el producto y controla los estados de la operación */

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        /* Sanitización: quita espacios de sobra al inicio/final de los campos de texto */
        const cleanSku = sku.trim();
        const cleanName = name.trim();
        const cleanDescription = description.trim();

        if (!cleanSku || !cleanName) {
            onError?.("El SKU y el nombre no pueden estar vacíos.");
            return;
        }

        /* La imagen es necesaria porque también se sube al almacenamiento */

        if (!imageFile) {
            onError?.("Debes seleccionar una imagen.");
            return;
        }

        /* Desactiva acciones mientras se guarda la información */

        setLoading(true);
        try {
            /* Convierte los valores de texto a números antes de enviarlos al servicio, clean hace que no haya espacios en blanco */
            await createProduct({
                category_id: categoryId,
                sku: cleanSku,
                name: cleanName,
                description: cleanDescription,
                price: parseFloat(price),
                stock: parseInt(stock, 10),
                min_stock: parseInt(minStock, 10),
                imageFile,
            });            
            
            /* Limpia los campos después de crear el producto correctamente */
            setSku("");
            setName("");
            setDescription("");
            setCategoryId("");
            setPrice("");
            setStock("");
            setMinStock("0");
            setImageFile(null);

            /* Avisa al componente padre que el registro terminó correctamente */

            onSuccess?.();
        } catch (err) {
            /* Muestra el error producido durante la creación del producto */
            onError?.(err instanceof Error ? err.message : "Error al crear el producto.");
        } finally {
            /* Permite volver a utilizar el formulario al terminar la operación */
            setLoading(false);
        }
    }

    /* Renderiza el formulario con los campos necesarios para crear un producto */
    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelClass}>SKU</label>
                    <input
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        required
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className={labelClass}>Nombre</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={inputClass}
                    />
                </div>
            </div>

            <div>
                <label className={labelClass}>Descripción</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className={inputClass}
                />
            </div>

            <div>
                <label className={labelClass}>Categoría</label>
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                    className={inputClass}
                >
                    <option value="">Selecciona una categoría</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
                <div>
                    <label className={labelClass}>Precio</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className={labelClass}>Stock</label>
                    <input
                        type="number"
                        min="0"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                        className={inputClass}
                    />
                </div>
                <div>
                    <label className={labelClass}>Stock mín.</label>
                    <input
                        type="number"
                        min="0"
                        value={minStock}
                        onChange={(e) => setMinStock(e.target.value)}
                        className={inputClass}
                    />
                </div>
            </div>

            <div>
                <label className={labelClass}>Imagen</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                    required
                    className="w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#4E705B] file:text-white hover:file:bg-[#3E5C4A] file:cursor-pointer cursor-pointer"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-[#4E705B] text-white font-semibold text-sm hover:bg-[#3E5C4A] transition duration-200 disabled:opacity-60"
            >
                {loading ? "Guardando..." : "Añadir producto"}
            </button>
        </form>
    );
}