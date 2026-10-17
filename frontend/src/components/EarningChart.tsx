import { useMemo, useState } from "react";
import { endOfDay, format, isSameDay, isSameMonth, isWithinInterval, parseISO, startOfDay, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import type { FinancialBucket, StatsRange } from "../services/StatsService";
import { formatPrice } from "../utils/formatPrice";
import { useMediaQuery } from "../hooks/UseMediaQuery";

interface EarningsChartProps {
    range: StatsRange;
    buckets: FinancialBucket[];
    loading: boolean;
    error: string | null;
}

interface ChartBar {
    key: string;
    shortLabel: string;
    fullLabel: string;
    value: number;
    isCurrent: boolean;
}

interface ChartBar {
    key: string;
    shortLabel: string;
    fullLabel: string;
    value: number;
    isCurrent: boolean;
    /* Solo en la vista anual: 0 = enero ... 11 = diciembre */
    monthIndex?: number;
}

const RANGE_BADGE: Record<StatsRange, string> = { week: "Semanal", month: "Mensual", year: "Anual" };

const money = (value: number) =>
    `${value < 0 ? "-" : ""}₡${formatPrice(Math.round(Math.abs(value)))}`;

/* Convierte las filas de la base de datos en las barras a dibujar:
   semana -> un día por barra, año -> un mes por barra, mes -> una semana (lunes a domingo) por barra */
function buildBars(range: StatsRange, buckets: FinancialBucket[], today: Date): ChartBar[] {
    /* parseISO interpreta "yyyy-MM-dd" en hora local; new Date("yyyy-MM-dd") lo correría un día */
    const days = buckets.map((b) => ({ date: parseISO(b.bucket), value: b.net_profit }));

    if (range === "week") {
        return days.map(({ date, value }) => ({
            key: `week:${format(date, "yyyy-MM-dd")}`,
            shortLabel: format(date, "EEE", { locale: es }),
            fullLabel: format(date, "EEEE d 'de' MMMM", { locale: es }),
            value,
            isCurrent: isSameDay(date, today),
        }));
    }

    if (range === "year") {
        return days.map(({ date, value }) => ({
            key: `year:${format(date, "yyyy-MM")}`,
            shortLabel: format(date, "MMM", { locale: es }),
            fullLabel: format(date, "MMMM yyyy", { locale: es }),
            value,
            isCurrent: isSameMonth(date, today),
            monthIndex: date.getMonth(),
        }));
    }

    /* Mes: se agrupan los días por semana; la primera y la última pueden ser parciales */
    const weeks = new Map<string, { first: Date; last: Date; value: number }>();
    for (const { date, value } of days) {
        const weekKey = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
        const current = weeks.get(weekKey);
        if (current) {
            current.last = date;
            current.value += value;
        } else {
            weeks.set(weekKey, { first: date, last: date, value });
        }
    }

    return Array.from(weeks.entries()).map(([weekKey, { first, last, value }]) => {
        const single = isSameDay(first, last);
        return {
            key: `month:${weekKey}`,
            shortLabel: single ? format(first, "d") : `${format(first, "d")}–${format(last, "d")}`,
            fullLabel: single
                ? format(first, "d 'de' MMMM", { locale: es })
                : `${format(first, "d")} al ${format(last, "d 'de' MMMM", { locale: es })}`,
            value,
            isCurrent: isWithinInterval(today, { start: startOfDay(first), end: endOfDay(last) }),
        };
    });
}

/* Eje vertical con valores "redondos" (100 000, 200 000...) que dejan espacio sobre la barra más alta */
function buildScale(max: number) {
    if (max <= 0) return { top: 1000, ticks: [0, 250, 500, 750, 1000] };

    const rawStep = max / 4;
    const exp = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const f = rawStep / exp;
    const step = Math.max((f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * exp, 1);
    const top = Math.ceil(max / step) * step;

    const ticks: number[] = [];
    for (let t = 0; t <= top + step / 2; t += step) ticks.push(Math.round(t));
    return { top, ticks };
}

/* Gráfico de barras con el beneficio neto del período elegido en el selector de la página */
export default function EarningsChart({ range, buckets, loading, error }: EarningsChartProps) {
    const [selectedKey, setSelectedKey] = useState<string | null>(null);
    /* Semestre que se muestra en mobile en la vista anual: por defecto, el actual */
    const [semester, setSemester] = useState<1 | 2>(() => (new Date().getMonth() < 6 ? 1 : 2));
    const isMobile = useMediaQuery("(max-width: 639px)");
    const semesterMode = range === "year" && isMobile;

    const bars = useMemo(() => buildBars(range, buckets, new Date()), [range, buckets]);

    /* En mobile, la vista anual muestra solo 6 meses para que las barras no queden diminutas */
    const visibleBars = useMemo(
        () =>
            semesterMode
                ? bars.filter((b) => (semester === 1 ? (b.monthIndex ?? 0) < 6 : (b.monthIndex ?? 0) >= 6))
                : bars,
        [bars, semesterMode, semester]
    );

    const maxValue = Math.max(0, ...visibleBars.map((b) => b.value));
    const { top, ticks } = useMemo(() => buildScale(maxValue), [maxValue]);

    /* Si no se ha tocado ninguna barra visible (o cambió el período), se resalta la del período actual */
    const selected =
        visibleBars.find((b) => b.key === selectedKey) ?? visibleBars.find((b) => b.isCurrent) ?? null;

    return (
        <div className="bg-tarjeta rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                    <div className="flex items-baseline gap-3">
                        <p className="text-lg font-semibold text-primarioBase">Ganancias</p>
                        {selected && !loading && !error && (
                            <span className="text-sm font-bold text-primarioBase">{money(selected.value)}</span>
                        )}
                    </div>
                    {selected && !loading && !error && (
                        <p className="text-[11px] text-textoSecundario first-letter:uppercase pb-2">{selected.fullLabel}</p>
                    )}
                </div>
                <span className="text-xs font-semibold text-primarioBase border border-primarioBase rounded-full px-3 py-1.5">
                    {RANGE_BADGE[range]}
                </span>
            </div>

            {error ? (
                <p role="alert" className="text-xs font-semibold text-error">
                    {error}
                </p>
            ) : loading ? (
                <p className="text-xs text-primarioBase text-center py-16">Cargando...</p>
            ) : (
                <>
                {semesterMode && (
                        <div
                            className="inline-flex bg-white border border-primarioClaro rounded-full p-1"
                            role="group"
                            aria-label="Semestre"
                        >
                            <button
                                type="button"
                                onClick={() => setSemester(1)}
                                aria-pressed={semester === 1}
                                aria-label="Primer semestre, enero a junio"
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                                    semester === 1 ? "bg-primarioBase text-white" : "text-primarioBase hover:bg-tarjeta"
                                }`}
                            >
                                Ene – Jun
                            </button>
                            <button
                                type="button"
                                onClick={() => setSemester(2)}
                                aria-pressed={semester === 2}
                                aria-label="Segundo semestre, julio a diciembre"
                                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                                    semester === 2 ? "bg-primarioBase text-white" : "text-primarioBase hover:bg-tarjeta"
                                }`}
                            >
                                Jul – Dic
                            </button>
                        </div>
                    )}

                    <div className="flex gap-2 mt-12">
                        {/* Eje vertical */}
                        <div className="relative h-40 w-14 flex-shrink-0">
                            {ticks.map((t) => (
                                <span
                                    key={t}
                                    className="absolute right-1 -translate-y-1/2 text-[10px] font-semibold text-textoSecundario"
                                    style={{ bottom: `${(t / top) * 100}%` }}
                                >
                                    {formatPrice(t)}
                                </span>
                            ))}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="h-40 border-l-2 border-b-2 border-primarioBase flex items-end gap-1 sm:gap-2 px-1">
                                {visibleBars.map((bar) => {
                                    const isSelected = selected?.key === bar.key;
                                    /* Un valor negativo se dibuja sin altura; el monto real se ve al seleccionarlo */
                                    const heightPct = (Math.max(bar.value, 0) / top) * 100;
                                    return (
                                        <button
                                            key={bar.key}
                                            type="button"
                                            onClick={() => setSelectedKey(bar.key)}
                                            aria-pressed={isSelected}
                                            aria-label={`${bar.fullLabel}: ${money(bar.value)}`}
                                            title={`${bar.fullLabel}: ${money(bar.value)}`}
                                            className="flex-1 min-w-0 h-full flex items-end justify-center"
                                        >
                                            <span
                                                className={`block w-full max-w-[28px] rounded-t-[10px] transition-colors ${isSelected ? "bg-[#87c6a1]" : "bg-primarioBase"
                                                    }`}
                                                style={{ height: `${heightPct}%`, minHeight: bar.value > 0 ? 2 : 0 }}
                                            />
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex gap-1 sm:gap-2 px-1 mt-2">
                                {visibleBars.map((bar) => (
                                    <p
                                        key={bar.key}
                                        className="flex-1 min-w-0 text-[10px] font-semibold text-textoSecundario text-center capitalize truncate"
                                    >
                                        {bar.shortLabel}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {maxValue <= 0 && (
                        <p className="text-[11px] text-primarioBase/70 text-center mt-3">
                            Sin ganancias registradas en este período.
                        </p>
                    )}
                </>
            )}
        </div>
    );
}