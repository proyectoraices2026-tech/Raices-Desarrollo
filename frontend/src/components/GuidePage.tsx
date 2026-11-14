import { useState } from "react";
import NavBar from "./NavBar";
import BottomNav from "./BottomNav";
import SideMenu from "./SideMenu";
import Footer from "./Footer";
import GuideCard from "./GuideCard";
import type { GuideCardVariant } from "./GuideCard";
import type { QuickGuide } from "../utils/quickGuides";

interface GuidePageProps {
  /* Texto de la etiqueta que va encima del título */
  label: string;
  title: string;
  guides: QuickGuide[];
  variant: GuideCardVariant;
}

const PAGE_STYLES: Record<GuideCardVariant, { pill: string; title: string; heading: string; note: string }> = {
  green: {
    pill: "bg-[#ddefe5] text-[#1c2b18]",
    title: "text-[#1c2b18]",
    heading: "text-[#1c2b18]",
    note: "text-[#537a63]",
  },
  brown: {
    pill: "bg-[#ddd4cd] text-[#1c2b18]",
    title: "text-[#645244]",
    heading: "text-[#645244]",
    note: "text-[#645244]",
  },
};

/* Estructura compartida por "Guía de uso" y "Guías de jardinería":
   etiqueta, título y tarjetas; una debajo de otra en mobile y en filas de 3 en escritorio */
export default function GuidePage({ label, title, guides, variant }: GuidePageProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const s = PAGE_STYLES[variant];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="sticky top-0 z-40">
        <NavBar onMenuClick={() => setMenuOpen(true)} />
        <BottomNav />
      </div>

      <main className="w-full flex-1 max-w-6xl lg:max-w-[1680px] mx-auto px-5 lg:px-12 xl:px-[120px] py-10 md:py-16 flex flex-col gap-8 md:gap-10">
        <header className="flex flex-col items-center gap-4 text-center">
          <span className={`inline-block ${s.pill} text-[11px] md:text-xs font-semibold uppercase tracking-[0.1em] rounded-full px-4 py-1.5`}>
            {label}
          </span>
          <h1 className={`font-poppins text-3xl md:text-5xl ${s.title}`}>{title}</h1>
        </header>

        <section className="flex flex-col gap-5" aria-labelledby="guide-videos-heading">
          <h2 id="guide-videos-heading" className={`font-poppins text-xl md:text-2xl ${s.heading}`}>Videos disponibles</h2>
          <div className="flex flex-col gap-5 lg:grid lg:grid-cols-3 lg:gap-6 lg:items-stretch lg:[&>article]:h-full">
            {guides.map((g) => (
              <GuideCard key={g.id} guide={g} variant={variant} />
            ))}
          </div>
        </section>

        <p className={`text-sm ${s.note} text-center`}>
          Más guías estarán disponibles próximamente. ¡Mantente al tanto!
        </p>
      </main>

      <Footer />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
