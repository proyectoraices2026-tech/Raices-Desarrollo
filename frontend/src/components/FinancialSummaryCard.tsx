import { useMemo } from "react";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { sumFinancialBuckets } from "../services/StatsService";
import type { FinancialBucket, StatsRange } from "../services/StatsService";
import { formatPrice } from "../utils/formatPrice";

interface FinancialSummaryCardProps {
    range: StatsRange;
    buckets: FinancialBucket[];
    loading: boolean;
    error: string | null;
}

/* Colones sin decimales y con el signo adelante si es negativo */
const money = (value: number) =>
    `${value < 0 ? "-" : ""}₡${formatPrice(Math.round(Math.abs(value)))}`;

function Metric({ label, value, hint, negative }: { label: string; value: string; hint: string; negative?: boolean }) {
    return (
        <div className="bg-white rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-primarioBase">{label}</p>
            <p className={`text-xl font-bold mt-1 ${negative ? "text-error" : "text-primarioOscuro"}`}>{value}</p>
            <p className="text-[10px] text-textoSecundario mt-1">{hint}</p>
        </div>
    );
}

/* Tarjeta numérica: inversión, ventas y beneficio neto del período que recibe por prop */
export default function FinancialSummaryCard({ range, buckets, loading, error }: FinancialSummaryCardProps) {
    const totals = useMemo(() => sumFinancialBuckets(buckets), [buckets]);

    const periodLabel = useMemo(() => {
        const now = new Date();
        if (range === "week") {
            const start = startOfWeek(now, { weekStartsOn: 1 });
            const end = endOfWeek(now, { weekStartsOn: 1 });
            return `${format(start, "d MMM", { locale: es })} – ${format(end, "d MMM yyyy", { locale: es })}`;
        }
        if (range === "month") return format(now, "MMMM yyyy", { locale: es });
        return format(now, "yyyy");
    }, [range]);

    /* Beneficio neto = ventas menos el costo de lo vendido.
       Alternativa (balance de caja): totals.sales - totals.investment */
    const netProfit = totals.netProfit;

    const show = (value: number) => (loading ? "…" : money(value));

    return (
        <div className="bg-tarjeta rounded-2xl p-5 mb-4">
            <div className="flex items-baseline justify-between gap-3 mb-4">
                <p className="text-lg font-semibold text-primarioBase">Resumen financiero</p>
                <span className="text-xs font-semibold text-primarioBase capitalize">{periodLabel}</span>
            </div>

            {error ? (
                <p role="alert" className="text-xs font-semibold text-error">
                    {error}
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Metric label="Inversión" value={show(totals.investment)} hint="Compras de stock del período" />
                    <Metric label="Ventas" value={show(totals.sales)} hint="Pedidos aceptados del período" />
                    <Metric
                        label="Beneficio neto"
                        value={show(netProfit)}
                        hint="Ventas menos el costo de lo vendido"
                        negative={!loading && netProfit < 0}
                    />
                </div>
            )}
        </div>
    );
}