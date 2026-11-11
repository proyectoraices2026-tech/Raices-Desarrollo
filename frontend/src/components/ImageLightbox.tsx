import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from "react";
import { createPortal } from "react-dom";
import { Minus, Plus, X } from "lucide-react";

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const DOUBLE_TAP_SCALE = 2.5;
const DOUBLE_TAP_MS = 300;

interface ImageLightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

type Point = { x: number; y: number };

/* Visor de imagen a pantalla completa con zoom.
   - Celular: pellizcar con dos dedos para acercar/alejar, arrastrar con un dedo para moverla
     (cuando está ampliada) y tocar dos veces para acercar o volver al tamaño normal.
   - Computadora: rueda del mouse, botones +/−, doble clic y arrastrar.
   - Se cierra con la X o con la tecla Escape. */
export default function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  /* Dedos / puntero que están tocando la pantalla ahora mismo */
  const pointers = useRef(new Map<number, Point>());
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null);
  const dragStart = useRef<{ pointer: Point; offset: Point } | null>(null);
  const moved = useRef(false);
  const lastTap = useRef(0);

  /* Evita que la imagen se pueda arrastrar fuera de la pantalla: solo se puede mover
     lo que "sobra" de la imagen al estar ampliada */
  const clampOffset = (next: Point, nextScale: number): Point => {
    const stage = stageRef.current;
    if (!stage || nextScale <= 1) return { x: 0, y: 0 };
    const maxX = ((nextScale - 1) * stage.clientWidth) / 2;
    const maxY = ((nextScale - 1) * stage.clientHeight) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, next.x)),
      y: Math.max(-maxY, Math.min(maxY, next.y)),
    };
  };

  const applyScale = (nextScale: number) => {
    const clamped = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));
    setScale(clamped);
    setOffset((current) => clampOffset(current, clamped));
  };

  const reset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  /* Escape cierra solo el visor, no la ficha del producto que está detrás */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  const distance = () => {
    const [a, b] = [...pointers.current.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved.current = false;

    if (pointers.current.size === 2) {
      pinchStart.current = { distance: distance(), scale };
      dragStart.current = null;
    } else if (pointers.current.size === 1) {
      dragStart.current = { pointer: { x: e.clientX, y: e.clientY }, offset };
      setDragging(true);
    }
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinchStart.current) {
      moved.current = true;
      applyScale(pinchStart.current.scale * (distance() / pinchStart.current.distance));
      return;
    }

    if (pointers.current.size === 1 && dragStart.current) {
      const dx = e.clientX - dragStart.current.pointer.x;
      const dy = e.clientY - dragStart.current.pointer.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved.current = true;
      if (scale > 1) {
        setOffset(clampOffset({ x: dragStart.current.offset.x + dx, y: dragStart.current.offset.y + dy }, scale));
      }
    }
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
    pinchStart.current = null;

    if (pointers.current.size === 1) {
      /* Si soltó un dedo del pellizco, el otro sigue arrastrando desde donde está */
      const [remaining] = [...pointers.current.values()];
      dragStart.current = { pointer: remaining, offset };
      return;
    }

    if (pointers.current.size === 0) {
      dragStart.current = null;
      setDragging(false);

      /* Doble toque / doble clic: acerca o vuelve al tamaño normal */
      if (!moved.current) {
        const now = Date.now();
        if (now - lastTap.current < DOUBLE_TAP_MS) {
          if (scale > 1) reset();
          else applyScale(DOUBLE_TAP_SCALE);
          lastTap.current = 0;
        } else {
          lastTap.current = now;
        }
      }
    }
  };

  const handleWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    applyScale(scale * (e.deltaY < 0 ? 1.15 : 1 / 1.15));
  };

  const buttonClass =
    "w-11 h-11 rounded-full bg-white/95 text-[#1e2d24] flex items-center justify-center shadow-md hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-40";

  return createPortal(
    <div
      className="fixed inset-0 z-[70] bg-black/85 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={`Imagen ampliada: ${alt}`}
      /* Los clics aquí no deben llegar a la ficha del producto de atrás (que se cierra al tocar el fondo) */
      onClick={(e) => e.stopPropagation()}
    >
      <div
        ref={stageRef}
        className="flex-1 min-h-0 flex items-center justify-center overflow-hidden touch-none select-none"
        style={{ cursor: scale > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="max-w-full max-h-full object-contain bg-white select-none"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: dragging ? "none" : "transform 150ms ease-out",
          }}
        />
      </div>

      <button
        type="button"
        onClick={onClose}
        autoFocus
        className={`${buttonClass} absolute top-4 right-4`}
        aria-label="Cerrar imagen ampliada"
      >
        <X className="w-5 h-5" aria-hidden="true" />
      </button>

      <div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-2 pointer-events-none">
        <p className="text-xs text-white/80 px-4 text-center">
          Pellizca o toca dos veces para acercar
        </p>
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            type="button"
            onClick={() => applyScale(scale / 1.5)}
            disabled={scale <= MIN_SCALE}
            className={buttonClass}
            aria-label="Alejar"
          >
            <Minus className="w-5 h-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={scale === 1}
            className="min-w-[64px] h-11 px-3 rounded-full bg-white/95 text-sm font-semibold text-[#1e2d24] shadow-md hover:bg-white disabled:opacity-40"
            aria-label="Volver al tamaño normal"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            type="button"
            onClick={() => applyScale(scale * 1.5)}
            disabled={scale >= MAX_SCALE}
            className={buttonClass}
            aria-label="Acercar"
          >
            <Plus className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
