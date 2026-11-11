import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import BottomNav from "../components/BottomNav";
import EarningsChart from "../components/EarningChart";
import FinancialSummaryCard from "../components/FinancialSummaryCard";
import NavBar from "../components/NavBar";
import SideMenu from "../components/SideMenu";
import Footer from "../components/Footer"; 
import { useFinancialSummary } from "../hooks/UseFinancialSummary";
import { useTopSellers } from "../hooks/UseTopSellers";
import { getAllProducts } from "../services/ProductService";
import type { Product } from "../services/ProductService";
import type { StatsRange } from "../services/StatsService";
import { ArrowNavigateUp } from "../components/ArrowNavigateUp";

const CHART_COLORS = ["#645244", "#537a63", "#c4a557", "#1c2b18", "#5a7a54", "#929487"];

/* Cantidad de productos que muestran la dona y el panel de "Más vendidos" */
const TOP_SELLERS_LIMIT = 6;

const RANGE_OPTIONS: { key: StatsRange; label: string }[] = [
    { key: "week", label: "Semanal" },
    { key: "month", label: "Mensual" },
    { key: "year", label: "Anual" },
];

type PanelKey = "vendidos" | "agotarse" | "agotados" | null;

/* Página de estadísticas del admin. Todo usa datos reales: resumen financiero, ganancias y más
   vendidos siguen el selector de período; "agotados" y "próximos en agotarse" muestran el stock actual. */
export default function AdminStats() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openPanel, setOpenPanel] = useState<PanelKey>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState<StatsRange>("month");
    const panelsRef = useRef<HTMLDivElement>(null);

    const { buckets, loading: summaryLoading, error: summaryError } = useFinancialSummary(range);
    const { sellers, loading: sellersLoading, error: sellersError } = useTopSellers(range, TOP_SELLERS_LIMIT);

    /* Lleva al usuario hasta el principio de la página buscando el primer elemento de la misma (id="first") */
    const handleScrollUp = () => {
        document.getElementById("first")?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        getAllProducts()
            .then(setProducts)
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);

    /* Cierra el panel abierto al tocar fuera de la fila de filtros o al presionar Escape */
    useEffect(() => {
        if (!openPanel) return;

        const handlePointerDown = (e: PointerEvent) => {
            if (panelsRef.current && !panelsRef.current.contains(e.target as Node)) setOpenPanel(null);
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpenPanel(null);
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [openPanel]);

    const agotados = useMemo(
        () => products.filter((p) => p.is_active && p.stock === 0),
        [products]
    );

    const proximosAgotarse = useMemo(
        () =>
            products
                .filter((p) => p.is_active && p.stock > 0 && p.stock <= p.min_stock)
                .sort((a, b) => a.stock - b.stock),
        [products]
    );

    /* La función de la base de datos devuelve ids y unidades; los nombres salen de products */
    const topSellers = useMemo(() => {
        const namesById = new Map<string, string>(
            products.map((p) => [p.id, p.name] as [string, string])
        );
        return sellers.map((s) => ({
            name: namesById.get(s.productId) ?? "Producto",
            value: s.totalSold,
        }));
    }, [sellers, products]);

    const topSellersReady = !sellersLoading && !loading;
    const topSellersTotal = topSellers.reduce((sum, s) => sum + s.value, 0);

    const donutGradient = useMemo(() => {
        if (topSellersTotal === 0) return "";
        let acc = 0;
        const stops = topSellers.map((s, i) => {
            const start = (acc / topSellersTotal) * 360;
            acc += s.value;
            const end = (acc / topSellersTotal) * 360;
            return `${CHART_COLORS[i % CHART_COLORS.length]} ${start}deg ${end}deg`;
        });
        return `conic-gradient(${stops.join(", ")})`;
    }, [topSellers, topSellersTotal]);

    const togglePanel = (key: PanelKey) => setOpenPanel((current) => (current === key ? null : key));

    const pillClass = (active: boolean) =>
        `w-full flex items-center justify-between gap-2 px-5 py-3 rounded-2xl text-sm font-semibold border transition ${
            active ? "bg-tarjeta border-primarioClaro text-primarioBase" : "bg-white border-primarioClaro text-primarioBase hover:bg-tarjeta"
        }`;

    /* Panel flotante: se dibuja encima del contenido, no lo empuja hacia abajo */
    const panelClass =
        "absolute left-0 right-0 top-full mt-2 z-30 max-h-64 overflow-y-auto bg-verdePastel border border-primarioClaro rounded-2xl p-3 space-y-2 shadow-lg";

    return (
        <div className="min-h-screen bg-white">
            <div className="sticky top-0 z-40">
                <NavBar onMenuClick={() => setMenuOpen(true)} />
                <BottomNav />
            </div>

            <div id="first" className="md:max-w-5xl md:mx-auto p-5 md:px-12 md:py-8">
                <h1 className="font-poppins text-3xl md:text-4xl leading-tight font-bold text-primarioOscuro mb-1">
                    Estadísticas
                </h1>
                <p className="text-sm text-primarioBase mb-4">Resumen del estado del vivero.</p>

                {/* Selector de período: lo usan el resumen financiero, el gráfico de ganancias y los más vendidos */}
                <div
                    className="inline-flex bg-white border border-primarioClaro rounded-full p-1 mb-4"
                    role="group"
                    aria-label="Período de las estadísticas"
                >
                    {RANGE_OPTIONS.map((option) => (
                        <button
                            key={option.key}
                            type="button"
                            onClick={() => setRange(option.key)}
                            aria-pressed={range === option.key}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
                                range === option.key ? "bg-primarioBase text-white" : "text-primarioBase hover:bg-tarjeta"
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                

                {/* Fila de filtros desplegables: cada panel flota debajo de su botón */}
                <div ref={panelsRef} className="flex flex-col sm:flex-row gap-3 mb-4 relative">
                    <div className="flex-1 relative">
                        <button
                            onClick={() => togglePanel("vendidos")}
                            aria-expanded={openPanel === "vendidos"}
                            className={pillClass(openPanel === "vendidos")}
                        >
                            Más vendidos
                            <ChevronDown className={`w-4 h-4 transition-transform ${openPanel === "vendidos" ? "rotate-180" : ""}`} />
                        </button>
                        {openPanel === "vendidos" && (
                            <div className={panelClass}>
                                {sellersError ? (
                                    <p role="alert" className="text-xs text-error text-center py-3">{sellersError}</p>
                                ) : !topSellersReady ? (
                                    <p className="text-xs text-primarioBase text-center py-3">Cargando...</p>
                                ) : topSellers.length === 0 ? (
                                    <p className="text-xs text-primarioBase text-center py-3">Sin ventas aceptadas en este período.</p>
                                ) : (
                                    topSellers.map((s, i) => (
                                        <div
                                            key={`${s.name}-${i}`}
                                            className="bg-white rounded-xl px-4 py-2.5 flex items-center justify-between text-sm font-semibold"
                                            style={{ color: CHART_COLORS[i % CHART_COLORS.length] }}
                                        >
                                            <span>{s.name}</span>
                                            <span>{s.value} u.</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 relative">
                        <button
                            onClick={() => togglePanel("agotarse")}
                            aria-expanded={openPanel === "agotarse"}
                            className={pillClass(openPanel === "agotarse")}
                        >
                            Próximos en agotarse
                            <ChevronDown className={`w-4 h-4 transition-transform ${openPanel === "agotarse" ? "rotate-180" : ""}`} />
                        </button>
                        {openPanel === "agotarse" && (
                            <div className={panelClass}>
                                {loading ? (
                                    <p className="text-xs text-primarioBase text-center py-3">Cargando...</p>
                                ) : proximosAgotarse.length === 0 ? (
                                    <p className="text-xs text-primarioBase text-center py-3">Ningún producto está por agotarse.</p>
                                ) : (
                                    proximosAgotarse.map((p) => (
                                        <div key={p.id} className="bg-white rounded-xl px-4 py-2.5 flex items-center justify-between text-sm font-semibold text-acentoBase">
                                            <span>{p.name}</span>
                                            <span>{p.stock} u.</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 relative">
                        <button
                            onClick={() => togglePanel("agotados")}
                            aria-expanded={openPanel === "agotados"}
                            className={pillClass(openPanel === "agotados")}
                        >
                            Agotados
                            <ChevronDown className={`w-4 h-4 transition-transform ${openPanel === "agotados" ? "rotate-180" : ""}`} />
                        </button>
                        {openPanel === "agotados" && (
                            <div className={panelClass}>
                                {loading ? (
                                    <p className="text-xs text-primarioBase text-center py-3">Cargando...</p>
                                ) : agotados.length === 0 ? (
                                    <p className="text-xs text-primarioBase text-center py-3">No hay productos agotados.</p>
                                ) : (
                                    agotados.map((p) => (
                                        <div key={p.id} className="bg-white rounded-xl px-4 py-2.5 flex items-center justify-between text-sm font-semibold text-error">
                                            <span>{p.name}</span>
                                            <span>0 u.</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                         {/* Resumen financiero y dona de más vendidos: lado a lado desde md, una sobre otra en mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FinancialSummaryCard range={range} buckets={buckets} loading={summaryLoading} error={summaryError} />

                    {/* Tarjeta "Más vendidos": dona + leyenda */}
                    <div className="bg-tarjeta rounded-2xl p-5 h-full">
                        <p className="text-lg font-semibold text-primarioBase mb-4">Más vendidos</p>

                        {sellersError ? (
                            <p role="alert" className="text-xs font-semibold text-error">{sellersError}</p>
                        ) : !topSellersReady ? (
                            <p className="text-xs text-primarioBase text-center py-10">Cargando...</p>
                        ) : topSellers.length === 0 ? (
                            <p className="text-xs text-primarioBase text-center py-10">Sin ventas aceptadas en este período.</p>
                        ) : (
                            <div className="flex flex-col items-center gap-6">
                                <div
                                    className="w-40 h-40 rounded-full flex-shrink-0"
                                    style={{
                                        background: donutGradient,
                                        WebkitMask: "radial-gradient(farthest-side, transparent 62%, black 63%)",
                                        mask: "radial-gradient(farthest-side, transparent 62%, black 63%)",
                                    }}
                                    role="img"
                                    aria-label="Gráfico de dona de productos más vendidos"
                                />
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
                                    {topSellers.map((s, i) => (
                                        <div
                                            key={`${s.name}-${i}`}
                                            className="flex items-center gap-2 text-xs font-semibold"
                                            style={{ color: CHART_COLORS[i % CHART_COLORS.length] }}
                                        >
                                            <span
                                                className="w-3 h-3 rounded-[4px] flex-shrink-0"
                                                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                                            />
                                            {s.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tarjeta "Ganancias": datos reales, responde al selector de período */}
                <EarningsChart range={range} buckets={buckets} loading={summaryLoading} error={summaryError} />

                

                <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
            </div>

            <ArrowNavigateUp handleUpNavigate={handleScrollUp}></ArrowNavigateUp>
            <Footer/>

        </div>
        
    );
}