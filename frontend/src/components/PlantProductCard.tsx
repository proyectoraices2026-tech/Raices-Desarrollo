// src/components/PlantProductCard.tsx

import { useState } from "react";
import { Droplets, Scissors, Sprout, Image as ImageIcon } from "lucide-react";
import type { Product } from "../services/ProductService";
import type { TaskUnit } from "../services/UserPlantsService";

const UNIT_LABELS: Record<TaskUnit, [string, string]> = {
    day: ["día", "días"],
    week: ["semana", "semanas"],
    month: ["mes", "meses"],
};

/* 1 día -> "Cada día", 3 días -> "Cada 3 días" */
function formatInterval(interval: number, unit: TaskUnit): string {
    const [singular, plural] = UNIT_LABELS[unit];
    return interval === 1 ? `Cada ${singular}` : `Cada ${interval} ${plural}`;
}

export default function PlantProductCard({
    product,
    onSelect,
}: {
    product: Product;
    onSelect: (product: Product) => void;
}) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    /* Solo se listan las tareas que el producto tiene definidas */
    const careRows = [
        { Icon: Droplets, label: "Riego", interval: product.default_watering_interval, unit: product.default_watering_unit },
        { Icon: Scissors, label: "Poda", interval: product.default_pruning_interval, unit: product.default_pruning_unit },
        { Icon: Sprout, label: "Abono", interval: product.default_fertilizer_interval, unit: product.default_fertilizer_unit },
    ].flatMap(({ Icon, label, interval, unit }) =>
        interval && unit ? [{ Icon, label, text: formatInterval(interval, unit) }] : []
    );

    return (
        <div className="bg-white border border-[#e8efe4] rounded-2xl overflow-hidden hover:shadow-md transition duration-200 flex flex-col w-full">
            <div className="relative w-full aspect-[4/3] bg-white flex-shrink-0 overflow-hidden">
                {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                    </div>
                )}

                {imageError || !product.image_url ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon className="w-7 h-7" />
                    </div>
                ) : (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                        className={`w-full h-full object-contain transition-opacity duration-300 ${
                            imageLoaded ? "opacity-100" : "opacity-0"
                        }`}
                    />
                )}
            </div>

            <div className="flex flex-col flex-1 p-2.5 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {product.categories?.name || "Plantas"}
                </span>

                <h3 className="font-bold text-[#1F2937] text-sm truncate">{product.name}</h3>

                {product.default_scientific_name && (
                    <p className="text-xs text-[#537a63] italic truncate">{product.default_scientific_name}</p>
                )}

                {careRows.length > 0 && (
                    <ul className="space-y-0.5 pt-0.5">
                        {careRows.map(({ Icon, label, text }) => (
                            <li key={label} className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                <Icon className="w-3.5 h-3.5 text-[#4E705B] flex-shrink-0" aria-hidden="true" />
                                <span className="font-semibold">{label}:</span> {text}
                            </li>
                        ))}
                    </ul>
                )}

                <button
                    type="button"
                    onClick={() => onSelect(product)}
                    className="mt-auto w-full py-2 rounded-full bg-[#4E705B] hover:bg-[#3A5A40] text-white text-xs font-semibold transition"
                >
                    Asignar
                </button>
            </div>
        </div>
    );
}