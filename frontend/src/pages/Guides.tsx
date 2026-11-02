import { useState } from "react";
import NavBar from "../components/NavBar";
import BottomNav from "../components/BottomNav";
import SideMenu from "../components/SideMenu";
import Footer from "../components/Footer";
import GuideCard from "../components/GuideCard";
import { QUICK_GUIDES } from "../utils/quickGuides";

export default function Guides() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="sticky top-0 z-40">
        <NavBar onMenuClick={() => setMenuOpen(true)} />
        <BottomNav />
      </div>

      <main className="w-full flex-1 max-w-3xl mx-auto px-5 py-10 md:py-16 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="bg-[#ddefe5] text-[#1c2b18] text-[11px] md:text-xs font-semibold uppercase tracking-widest rounded-full px-4 py-1.5">
            Recursos para nuevos usuarios
          </span>
          <h1 className="font-poppins text-3xl md:text-5xl text-[#1c2b18]">Guías Rápidas Raíces</h1>
        </div>

        <section aria-labelledby="guides-list" className="flex flex-col gap-5">
          <h2 id="guides-list" className="font-poppins text-xl md:text-2xl text-[#1c2b18]">Videos disponibles</h2>
          {QUICK_GUIDES.map((g) => (
            <GuideCard key={g.id} guide={g} />
          ))}
          <p className="text-sm text-[#537a63] text-center pt-6">
            Más guías estarán disponibles próximamente. ¡Mantente al tanto!
          </p>
        </section>
      </main>

      <Footer />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
