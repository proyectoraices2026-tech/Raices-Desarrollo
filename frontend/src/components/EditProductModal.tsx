import { useState } from "react";
import type { SubmitEvent } from "react";
import { X } from "lucide-react";
import { updateProduct, getErrorMessage } from "../services/ProductService";
import type { Product } from "../services/ProductService";

interface EditProductModalProps {
    product: Product;
    categories: { id: string; name: string }[];
    onClose: () => void;
    onSuccess: () => void;
    onError: (message: string) => void;
}

/* Mismas clases que usa ProductForm.tsx, para que el formulario de editar se vea igual al de crear */
const inputClass =
    "w-full px-4 py-3 bg-white border-2 border-[#c8dcc2] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4E705B] text-sm transition";
const labelClass = "block text-sm font-semibold text-[#2D4A3E] mb-1.5";

/* Formulario para editar un producto ya existente. Se precarga con los datos que ya tiene
   (product), a diferencia de ProductForm.tsx que siempre arranca vacío. La imagen es la
   única excepción: no se precarga un archivo, se deja tal cual si no se selecciona una nueva. */
export default function EditProductModal({ product, categories, onClose, onSuccess, onError }: EditProductModalProps) {
    const [sku, setSku] = useState(product.sku);
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description ?? "");
    const [categoryId, setCategoryId] = useState(product.category_id);
    const [price, setPrice] = useState(String(product.price));
    const [stock, setStock] = useState(String(product.stock));
    const [minStock, setMinStock] = useState(String(product.min_stock));
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const cleanSku = sku.trim();
        const cleanName = name.trim();
        const cleanDescription = description.trim();

        if (!cleanSku || !cleanName) {
            onError("El SKU y el nombre no pueden estar vacíos.");
            return;
        }

        setLoading(true);
        try {
            await updateProduct(product.id, {
                category_id: categoryId,
                sku: cleanSku,
                name: cleanName,
                description: cleanDescription,
                price: parseFloat(price),
                stock: parseInt(stock, 10),
                min_stock: parseInt(minStock, 10),
                /* Solo se manda si la persona escogió un archivo nuevo; si no, queda undefined
                   y updateProduct() deja la imagen que el producto ya tenía */
                imageFile: imageFile ?? undefined,
            });

            onSuccess();
        } catch (err) {
            onError(getErrorMessage(err, "Error al editar el producto."));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
                    aria-label="Cerrar"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-lg font-bold text-[#1F2937] mb-4">Editar producto</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={labelClass}>SKU</label>
                            <input value={sku} onChange={(e) => setSku(e.target.value)} required className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Nombre</label>
                            <input value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Descripción</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputClass} />
                    </div>

                    <div>
                        <label className={labelClass}>Categoría</label>
                        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className={inputClass}>
                            <option value="">Selecciona una categoría</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className={labelClass}>Precio</label>
                            <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Stock</label>
                            <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} required className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Stock mín.</label>
                            <input type="number" min="0" value={minStock} onChange={(e) => setMinStock(e.target.value)} className={inputClass} />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Imagen (opcional, solo si quieres cambiarla)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                            className="w-full text-sm text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#4E705B] file:text-white hover:file:bg-[#3E5C4A] file:cursor-pointer cursor-pointer"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-full bg-[#f0f0ec] text-[#1e2d24] font-semibold text-sm hover:bg-[#e4e4dc] transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 rounded-full bg-[#4E705B] text-white font-semibold text-sm hover:bg-[#3E5C4A] transition disabled:opacity-60"
                        >
                            {loading ? "Guardando..." : "Guardar cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
