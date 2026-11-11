import { useState, useEffect } from "react";
import type { SubmitEvent } from "react";
import { X } from "lucide-react";
import { createProduct, getErrorMessage } from "../services/ProductService";

interface ProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    categories: { id: string; name: string }[];
    onSuccess?: () => void;
    onError?: (message: string) => void;
}

const inputClass =
    "w-full px-4 py-3 bg-white border-2 border-[#c8dcc2] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4E705B] text-sm transition";
const labelClass = "block text-sm font-semibold text-[#2D4A3E] mb-1.5";

export function ProductForm({ isOpen, onClose, categories, onSuccess, onError }: ProductFormProps) {
    const [sku, setSku] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [minStock, setMinStock] = useState("0");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const resetFields = () => {
        setSku("");
        setName("");
        setDescription("");
        setCategoryId("");
        setPrice("");
        setStock("");
        setMinStock("0");
        setImageFile(null);
    };

    const handleCancel = () => {
        resetFields();
        onClose();
    };

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const cleanSku = sku.trim();
        const cleanName = name.trim();
        const cleanDescription = description.trim();

        if (!cleanSku || !cleanName) {
            onError?.("El SKU y el nombre no pueden estar vacíos.");
            return;
        }

        if (!imageFile) {
            onError?.("Debes seleccionar una imagen.");
            return;
        }

        setLoading(true);
        try {
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

            /* Solo se limpia y se cierra el modal una vez confirmado que la creación tuvo éxito */
            resetFields();
            onSuccess?.();
            onClose();
        } catch (err) {
            onError?.(getErrorMessage(err, "Error al crear el producto."));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-form-title"
        >
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-6 relative">
                <button
                    onClick={handleCancel}
                    className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
                    aria-label="Cerrar formulario de nuevo producto"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 id="product-form-title" className="text-lg font-bold text-[#1e2d24] mb-4">
                    Añadir producto
                </h2>

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
            </div>
        </div>
    );
}