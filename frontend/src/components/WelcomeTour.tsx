import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useWelcomeTour } from "../hooks/useWelcomeTour";
import seedy from "../assets/seedy.svg";

/* target = valor del atributo data-tour del elemento a iluminar (null = solo saludo, sin elemento) */
interface TourStep {
    target: string | null;
    text: string;
}

const STEPS: TourStep[] = [
    { target: null, text: "Hola, soy Seedy y vengo a enseñarte cómo navegar por la web de Raíces." },
    { target: "nav-news", text: "En la sección “Noticias” podrás ver las últimas novedades del vivero." },
    { target: "nav-my-requests", text: "Cuando realices un pedido, vas a poder hacerle seguimiento en la sección “Mis pedidos”." },
    { target: "nav-my-plants", text: "Dentro de la sección “Mis plantas” podrás ver todas las plantas que tengas registradas y registrar nuevas." },
    { target: "nav-calendar", text: "Dentro del calendario podrás ver recordatorios para regar tus plantas, abonarlas o podarlas según lo prefieras." },
    { target: "bell", text: "La campana maneja las notificaciones, te dará recordatorios y avisará cuando tus pedidos sean procesados." },
    { target: "favorites", text: "En el corazón se guardarán los productos que marques con el mismo, para que puedas comprarlos después." },
    { target: "chatbot", text: "Si algo no te quedó claro puedes pedirle ayuda a Rut, nuestra asistente de inteligencia artificial." },
];

interface Rect {
    top: number;
    left: number;
    width: number;
    height: number;
}

const SPOTLIGHT_PADDING = 8;
const ARROW_COLOR = "#f0ff1a";
const ARROW_WIDTH = 40;
const ARROW_HEIGHT = 24;
const ARROW_GAP = 6;
const TYPING_SPEED_MS = 22;

/* Punto de entrada: solo monta el overlay cuando el hook indica que hay que mostrar el tour */
export default function WelcomeTour() {
    const { open, close } = useWelcomeTour();
    if (!open) return null;
    return <TourOverlay onClose={close} />;
}

function TourOverlay({ onClose }: { onClose: () => void }) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const [index, setIndex] = useState(0);
    const [rect, setRect] = useState<Rect | null>(null);
    /* Sonda invisible de 100px: permite detectar si el overlay se dibuja escalado (CSS zoom en algún ancestro) */
    const probeRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    /* Si el usuario prefiere menos movimiento, el texto aparece completo de una vez */
    const [reduceMotion] = useState(
        () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    /* Cantidad de letras visibles del texto actual (efecto máquina de escribir) */
    const [shown, setShown] = useState(() => (reduceMotion ? STEPS[0].text.length : 0));

    const step = STEPS[index];
    const isLast = index === STEPS.length - 1;
    const typing = shown < step.text.length;

    /* Busca el elemento del paso y guarda su posición. Hay elementos duplicados (menú de escritorio y
       de mobile), así que se toma el que realmente está visible */
    const measure = useCallback(() => {
        /* Factor de escala con el que se dibuja el overlay (1 si no hay zoom en ningún ancestro) */
        const probe = probeRef.current;
        const s = probe ? probe.getBoundingClientRect().width / 100 || 1 : 1;
        setScale(s);

        if (!step.target) {
            setRect(null);
            return;
        }
        const candidates = Array.from(
            document.querySelectorAll<HTMLElement>(`[data-tour="${step.target}"]`)
        );
        for (const el of candidates) {
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.height > 0) {
                /* Se divide entre la escala para convertir a las unidades en que se dibuja el overlay */
                setRect({
                    top: r.top / s,
                    left: r.left / s,
                    width: r.width / s,
                    height: r.height / s,
                });
                return;
            }
        }
        setRect(null);
    }, [step.target]);

    useLayoutEffect(() => {
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, [measure]);

    /* Al abrir: sube al inicio (el header debe verse), bloquea el scroll y toma el foco del teclado */
    useEffect(() => {
        window.scrollTo({ top: 0 });
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        overlayRef.current?.focus();
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    /* Efecto máquina de escribir */
    useEffect(() => {
        if (!typing) return;
        const timer = setTimeout(() => setShown((s) => s + 1), TYPING_SPEED_MS);
        return () => clearTimeout(timer);
    }, [typing, shown]);

    /* Si el texto aún se está escribiendo, lo completa; si no, avanza (o cierra en el último paso) */
    const next = useCallback(() => {
        if (typing) {
            setShown(step.text.length);
            return;
        }
        if (isLast) {
            onClose();
            return;
        }
        const nextIndex = index + 1;
        setIndex(nextIndex);
        setShown(reduceMotion ? STEPS[nextIndex].text.length : 0);
    }, [typing, isLast, index, step.text.length, reduceMotion, onClose]);

    /* Teclado: Escape omite; Enter, espacio o flecha derecha avanzan */
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).closest("button")) return;
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "Enter" || e.key === " " || e.key === "ArrowRight") {
                e.preventDefault();
                next();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [next, onClose]);

    /* Spotlight: sobre el elemento si existe; si no, un punto en el centro (la sombra cubre toda la pantalla) */
    const spotlightStyle = rect
        ? {
            top: rect.top - SPOTLIGHT_PADDING,
            left: rect.left - SPOTLIGHT_PADDING,
            width: rect.width + SPOTLIGHT_PADDING * 2,
            height: rect.height + SPOTLIGHT_PADDING * 2,
        }
        : { top: "50%", left: "50%", width: 0, height: 0 };

    /* Tamaño de la ventana expresado en las mismas unidades en que se dibuja el overlay */
    const viewportW = window.innerWidth / scale;
    const viewportH = window.innerHeight / scale;

    /* La flecha va debajo del elemento (apuntando arriba) si está en la mitad superior; si no, encima (apuntando abajo) */
    const arrowPointsUp = rect ? rect.top + rect.height / 2 < viewportH / 2 : true;
    const arrowStyle = rect
        ? {
            left: Math.min(
                Math.max(rect.left + rect.width / 2 - ARROW_WIDTH / 2, 4),
                viewportW - ARROW_WIDTH - 4
            ),
            top: arrowPointsUp
                ? rect.top + rect.height + SPOTLIGHT_PADDING + ARROW_GAP
                : rect.top - SPOTLIGHT_PADDING - ARROW_GAP - ARROW_HEIGHT,
            width: ARROW_WIDTH,
            height: ARROW_HEIGHT,
        }
        : null;

    return (
        <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Tutorial de bienvenida"
            tabIndex={-1}
            onClick={next}
            className="tour-fade-in fixed inset-0 z-[9998] cursor-pointer outline-none"
        >
            {/* Sonda invisible para calcular la escala del overlay (ver measure) */}
            <div
                ref={probeRef}
                aria-hidden="true"
                className="pointer-events-none invisible absolute left-0 top-0"
                style={{ width: 100, height: 100 }}
            />
            {/* Spotlight: el interior es transparente y la sombra gigante oscurece el resto de la pantalla */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute rounded-xl transition-all duration-300 ease-out"
                style={{ ...spotlightStyle, boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.65)" }}
            />

            {/* Flecha amarilla que rebota hacia el elemento */}
            {arrowStyle && (
                <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute transition-[top,left] duration-300 ease-out ${arrowPointsUp ? "tour-arrow-up" : "tour-arrow-down"
                        }`}
                    style={arrowStyle}
                >
                    <svg
                        viewBox="0 0 40 24"
                        width={ARROW_WIDTH}
                        height={ARROW_HEIGHT}
                        className={arrowPointsUp ? "" : "rotate-180"}
                        fill="none"
                        stroke={ARROW_COLOR}
                        strokeWidth={3.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="3,21 20,4 37,21" />
                    </svg>
                </div>
            )}

            {/* Seedy y su globo: quedan fijos en el centro, solo cambia el texto */}
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center md:flex-row">
                <img
                    src={seedy}
                    alt=""
                    aria-hidden="true"
                    className="tour-hop order-2 w-28 drop-shadow-lg md:order-1 md:w-64"
                />

                <div className="order-1 flex flex-col items-center gap-3 md:order-2 md:-ml-8">
                    {/* key={index} reinicia la animación de entrada del globo en cada paso */}
                    <div
                        key={index}
                        className="tour-pop flex h-[190px] w-[min(82vw,320px)] items-center justify-center rounded-[50%] bg-white px-[15%] text-center text-[14px] leading-snug text-textoNegro shadow-xl md:h-[240px] md:w-[390px] md:text-lg"
                    >
                        {/* El texto restante va invisible para que el globo no cambie de forma mientras se escribe */}
                        <p aria-hidden="true">
                            {step.text.slice(0, shown)}
                            <span className="invisible">{step.text.slice(shown)}</span>
                        </p>
                        <span className="sr-only" aria-live="polite">
                            {step.text}
                        </span>
                    </div>

                    <p className="text-xs text-white/80">
                        {isLast ? "Toca para finalizar" : "Toca en cualquier lugar para continuar"}
                    </p>

                    {!isLast && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className="rounded-full border border-white/70 px-4 py-1 text-sm text-white transition hover:bg-white/15"
                        >
                            Omitir
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}