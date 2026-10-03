import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import BottomNav from "../components/BottomNav";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import SideMenu from "../components/SideMenu";
import { getAllProducts } from "../services/ProductService";
import type { Product } from "../services/ProductService";
import { formatPrice } from "../utils/formatPrice";

const CHART_COLORS = ["#645244", "#537a63", "#c4a557", "#1c2b18", "#5a7a54", "#929487"];

type PanelKey = "vendidos" | "agotarse" | "agotados" | null;

export default function AdminDashboard() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [openPanel, setOpenPanel] = useState<PanelKey>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getAllProducts()
            .then(setProducts)
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);

    /* Productos activos con stock en 0: "Agotados". Dato real, sale directo de la tabla products. */
    const agotados = useMemo(
        () => products.filter((p) => p.is_active && p.stock === 0),
        [products]
    );

    /* Productos activos con stock por debajo (o igual) de su mínimo, pero todavía no en 0:
       "Próximos en agotarse". También es dato real de products, ordenado del más urgente al menos. */
    const proximosAgotarse = useMemo(
        () =>
            products
                .filter((p) => p.is_active && p.stock > 0 && p.stock <= p.min_stock)
                .sort((a, b) => a.stock - b.stock),
        [products]
    );

    /*
        NOTA estos dos bloques usan datos de EJEMPLO hay que agregar un endpoint nuevo tipo
        GET /api/requests/stats que devuelva, por producto, la cantidad total vendida (pedidos
        con status "accepted"), y el total de esos pedidos agrupado por día. En cuanto exista,
        se reemplaza SAMPLE_TOP_SELLERS y SAMPLE_EARNINGS por la respuesta real de ese endpoint.
    */
    const SAMPLE_TOP_SELLERS = [
        { name: "Cactus", value: 32 },
        { name: "Monstera", value: 24 },
        { name: "Macetero", value: 18 },
        { name: "Tomate", value: 12 },
        { name: "Abono", value: 9 },
        { name: "Azada", value: 5 },
    ];
    const SAMPLE_EARNINGS = [
        { day: "Lunes", value: 14000 },
        { day: "Martes", value: 8000 },
        { day: "Miércoles", value: 3000 },
        { day: "Jueves", value: 14000 },
        { day: "Viernes", value: 16000 },
        { day: "Sábado", value: 15000 },
        { day: "Domingo", value: 15000 },
    ];
    const earningsMax = Math.max(...SAMPLE_EARNINGS.map((d) => d.value));
    const topSellersTotal = SAMPLE_TOP_SELLERS.reduce((sum, s) => sum + s.value, 0);

     const donutGradient = useMemo(() => {
        let acc = 0;
        const stops = SAMPLE_TOP_SELLERS.map((s, i) => {
            const start = (acc / topSellersTotal) * 360;
            acc += s.value;
            const end = (acc / topSellersTotal) * 360;
            return `${CHART_COLORS[i % CHART_COLORS.length]} ${start}deg ${end}deg`;
        });
        return `conic-gradient(${stops.join(", ")})`;
    }, [topSellersTotal]);

    const togglePanel = (key: PanelKey) => setOpenPanel((current) => (current === key ? null : key));

    const pillClass = (active: boolean) =>
        `flex-1 flex items-center justify-between gap-2 px-5 py-3 rounded-2xl text-sm font-semibold border transition ${
            active ? "bg-tarjeta border-primarioClaro text-primarioBase" : "bg-white border-primarioClaro text-primarioBase hover:bg-tarjeta"
        }`;

    return (
        <div className="min-h-screen bg-white">
            <div className="sticky top-0 z-40">
                <NavBar onMenuClick={() => setMenuOpen(true)} />
                <BottomNav />
            </div>

            <div className="md:max-w-5xl md:mx-auto p-5 md:px-12 md:py-8">
                <h1 className="font-poppins text-3xl md:text-4xl leading-tight font-bold text-primarioOscuro mb-1">
                    Dashboard de administrador
                </h1>
                <p className="text-sm text-primarioBase mb-6">Resumen del estado del vivero.</p>

                {/* Accesos rápidos que ya existían, se mantienen arriba del dashboard nuevo */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button
                        onClick={() => navigate("/admin/products/new")}
                        className="bg-white rounded-2xl overflow-hidden border border-[#e8efe4] text-left hover:bg-tarjeta hover:border-primarioClaro transition"
                    >
                        <div className="h-20 p-4">
                            <p className="text-xs font-bold text-primarioOscuro mb-1">Gestionar productos</p>
                            <p className="text-[10px] text-primarioBase">Añadir o modificar el catálogo</p>
                        </div>
                    </button>
                    <button
                        onClick={() => navigate("/admin/requests")}
                        className="bg-white rounded-2xl overflow-hidden border border-[#e8efe4] text-left hover:bg-tarjeta hover:border-primarioClaro transition"
                    >
                        <div className="h-20 p-4">
                            <p className="text-xs font-bold text-primarioOscuro mb-1">Pedidos pendientes</p>
                            <p className="text-[10px] text-primarioBase">Aceptar o rechazar pedidos</p>
                        </div>
                    </button>
                </div>

                {/* Fila de filtros desplegables, igual que en el prototipo */}
                <div className="flex flex-col sm:flex-row gap-3 mb-2 relative">
                    <div className="flex-1">
                        <button onClick={() => togglePanel("vendidos")} className={pillClass(openPanel === "vendidos")}>
                            Más vendidos
                            <ChevronDown className={`w-4 h-4 transition-transform ${openPanel === "vendidos" ? "rotate-180" : ""}`} />
                        </button>
                        {openPanel === "vendidos" && (
                            <div className="mt-2 bg-verdePastel rounded-2xl p-3 space-y-2 shadow-sm">
                                {SAMPLE_TOP_SELLERS.map((s, i) => (
                                    <div key={s.name} className="bg-white rounded-xl px-4 py-2.5 flex items-center justify-between text-sm font-semibold" style={{ color: CHART_COLORS[i % CHART_COLORS.length] }}>
                                        <span>{s.name}</span>
                                        <span>{s.value} u.</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <button onClick={() => togglePanel("agotarse")} className={pillClass(openPanel === "agotarse")}>
                            Próximos en agotarse
                            <ChevronDown className={`w-4 h-4 transition-transform ${openPanel === "agotarse" ? "rotate-180" : ""}`} />
                        </button>
                        {openPanel === "agotarse" && (
                            <div className="mt-2 bg-verdePastel rounded-2xl p-3 space-y-2 shadow-sm">
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

                    <div className="flex-1">
                        <button onClick={() => togglePanel("agotados")} className={pillClass(openPanel === "agotados")}>
                            Agotados
                            <ChevronDown className={`w-4 h-4 transition-transform ${openPanel === "agotados" ? "rotate-180" : ""}`} />
                        </button>
                        {openPanel === "agotados" && (
                            <div className="mt-2 bg-verdePastel rounded-2xl p-3 space-y-2 shadow-sm">
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

                {/* Aviso visible de que estas dos tarjetas todavía usan datos de ejemplo */}
                <p className="text-[11px] text-primarioBase/70 italic mb-4">
                    * "Más vendidos" y "Ganancias" muestran datos de ejemplo por ahora — falta un endpoint del backend de pedidos para calcularlos con datos reales.
                </p>

                {/* Tarjeta "Más vendidos": dona + leyenda */}
                <div className="bg-tarjeta rounded-2xl p-5 mb-4">
                    <p className="text-lg font-semibold text-primarioBase mb-4">Más vendidos</p>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 w-full">
                            {SAMPLE_TOP_SELLERS.map((s, i) => (
                                <div key={s.name} className="flex items-center gap-2 text-xs font-semibold" style={{ color: CHART_COLORS[i % CHART_COLORS.length] }}>
                                    <span className="w-3 h-3 rounded-[4px] flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                                    {s.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tarjeta "Ganancias": barras semanales */}
                <div className="bg-tarjeta rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-lg font-semibold text-primarioBase">Ganancias</p>
                        <span className="text-xs font-semibold text-primarioBase border border-primarioBase rounded-full px-3 py-1.5">
                            Mensuales
                        </span>
                    </div>
                    <div className="flex items-end gap-2 sm:gap-4 h-40">
                        {SAMPLE_EARNINGS.map((d) => (
                            <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full">
                                <div
                                    className="w-full max-w-[32px] bg-primarioBase rounded-t-[10px]"
                                    style={{ height: `${(d.value / earningsMax) * 100}%` }}
                                    title={`₡${formatPrice(d.value)}`}
                                />
                                <p className="text-[10px] font-semibold text-textoSecundario mt-2 text-center">{d.day.slice(0, 3)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
            </div>
        </div>
    );
}