import { useId, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useMediaQuery } from "../hooks/UseMediaQuery";

interface GuideSectionProps {
  /* Título de la columna (se muestra en mayúsculas) */
  title: string;
  children: ReactNode;
}

/*
    Una columna de la Guía rápida.
    - Escritorio (lg y más): el título se ve como una etiqueta centrada y el contenido siempre está visible.
    - Mobile / tablet: el título es un botón que recoge hacia arriba o despliega hacia abajo el contenido.
*/
export default function GuideSection({ title, children }: GuideSectionProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [open, setOpen] = useState(true);
  const contentId = useId();

  const titleClass = "text-[11px] md:text-xs font-semibold uppercase tracking-widest text-[#1c2b18]";

  if (isDesktop) {
    return (
      <section className="flex flex-col gap-5 min-w-0">
        <div className="flex justify-center">
          <h2 className={`${titleClass} bg-[#ddefe5] rounded-full px-4 py-1.5 text-center`}>{title}</h2>
        </div>
        {children}
      </section>
    );
  }

  return (
    <section className="flex flex-col min-w-0">
      <h2>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={contentId}
          className={`${titleClass} w-full flex items-center justify-between gap-3 bg-[#ddefe5] rounded-2xl px-4 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#527a65]`}
        >
          <span>{title}</span>
          <ChevronDown
            className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      </h2>

      {/* grid-rows 0fr -> 1fr anima la altura: el contenido se recoge hacia arriba y se despliega hacia abajo */}
      <div
        id={contentId}
        className={`grid transition-[grid-template-rows,visibility] duration-300 ${
          open ? "grid-rows-[1fr] visible" : "grid-rows-[0fr] invisible"
        }`}
      >
        <div className="overflow-hidden min-h-0">
          <div className="flex flex-col gap-5 pt-5">{children}</div>
        </div>
      </div>
    </section>
  );
}
