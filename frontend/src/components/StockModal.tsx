import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { X } from "lucide-react";
import { addStock, adjustStock, getErrorMessage, getProductCostOverride } from "../services/ProductService";
import type { Product } from "../services/ProductService";

interface StockModalProps {
    product: Product;
    /* add = compra de mercancía (inversión); adjust = corrección o merma */
    mode: "add" | "adjust";
    onClose: () => void;
    onSuccess: () => void;
}

const inputClass =
    "w-full px-4 py-3 bg-white border-2 border-[#c8dcc2] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#4E705B] text-sm transition";
const labelClass = "block text-sm font-semibold text-[#2D4A3E] mb-1.5";

export default function StockModal({ product, mode, onClose, onSuccess }: StockModalProps) {
    const isAdd = mode === "add";

    const [amount, setAmount] = useState("");
    /* Valor provisional: 50% del precio, hasta que se cargue el costo guardado (si existe) */
    const [unitCost, setUnitCost] = useState(String(Number((product.price / 2).toFixed(2))));
    const [saveAsCost, setSaveAsCost] = useState(false);
    const [note, setNote] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAdd) return;
        getProductCostOverride(product.id)
            .then((cost) => {
                if (cost !== null) setUnitCost(String(cost));
            })
            .catch(() => {});
    }, [isAdd, product.id]);

    const parsedAmount = parseInt(amount, 10);
    const resultingStock = product.stock + (Number.isNaN(parsedAmount) ? 0 : parsedAmount);

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (Number.isNaN(parsedAmount) || parsedAmount === 0) {
            setError("Ingresa una cantidad distinta de cero.");
            return;
        }
        if (isAdd && parsedAmount < 0) {
            setError("Para agregar stock la cantidad debe ser positiva.");
            return;
        }

        const cost = parseFloat(unitCost);
        if (isAdd && (Number.isNaN(cost) || cost < 0)) {
            setError("Ingresa un costo unitario válido.");
            return;
        }

        setLoading(true);
        try {
            if (isAdd) {
                await addStock(product.id, parsedAmount, cost, note.trim() || null, saveAsCost);
            } else {
                await adjustStock(product.id, parsedAmount, note.trim() || null);
            }
            onSuccess();
        } catch (err) {
            setError(getErrorMessage(err, "No se pudo actualizar el stock."));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]" role="dialog" aria-modal="true">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
                    aria-label="Cerrar"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-lg font-bold text-[#1F2937]">
                    {isAdd ? "Agregar stock" : "Ajustar stock"}
                </h2>
                <p className="text-xs text-slate-500 mb-4">
                    {product.name} · Stock actual: {product.stock}
                </p>

                {error && (
                    <p className="text-xs text-red-600 mb-3" role="alert">
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={labelClass}>
                            {isAdd ? "Unidades compradas" : "Unidades a sumar o restar (negativo resta)"}
                        </label>
                        <input
                            type="number"
                            step="1"
                            min={isAdd ? 1 : undefined}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className={inputClass}
                        />
                        <p className="text-[11px] text-slate-500 mt-1">Stock resultante: {resultingStock}</p>
                    </div>

                    {isAdd && (
                        <div>
                            <label className={labelClass}>Costo unitario de esta compra (₡)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={unitCost}
                                onChange={(e) => setUnitCost(e.target.value)}
                                required
                                className={inputClass}
                            />
                            <label className="flex items-center gap-2 text-xs text-slate-600 mt-2">
                                <input
                                    type="checkbox"
                                    checked={saveAsCost}
                                    onChange={(e) => setSaveAsCost(e.target.checked)}
                                />
                                Usar este costo como costo habitual del producto
                            </label>
                        </div>
                    )}

                    <div>
                        <label className={labelClass}>Nota (opcional)</label>
                        <input
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder={isAdd ? "Ej. compra al proveedor" : "Ej. plantas dañadas por plaga"}
                            className={inputClass}
                        />
                    </div>

                    <div className="flex gap-3 pt-1">
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
                            {loading ? "Guardando..." : "Confirmar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}