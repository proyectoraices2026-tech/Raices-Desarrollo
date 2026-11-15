import { useId, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

interface GuideSectionProps {
  /* Título de la sección (se muestra en mayúsculas dentro del botón que recoge el contenido) */
  title: string;
  /* Subtítulo que va encima de las tarjetas */
  heading: string;
  /* Las tarjetas de la sección */
  children: ReactNode;
}

export default function GuideSection({ title, heading, children }: GuideSectionProps) {
  const [open, setOpen] = useState(true);
  const contentId = useId();

  return (
    <section className="flex flex-col min-w-0">
      <h2>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={contentId}
          className="text-[11px] md:text-xs font-semibold uppercase tracking-widest text-[#1c2b18] w-full flex items-center justify-between gap-3 bg-[#ddefe5] rounded-2xl px-4 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#527a65]"
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
          <div className="flex flex-col gap-5 pt-5">
            <h3 className="font-poppins text-xl md:text-2xl text-[#1c2b18]">{heading}</h3>
            <div className="flex flex-col gap-5 lg:grid lg:grid-cols-3 lg:gap-6 lg:items-stretch lg:[&>article]:h-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
