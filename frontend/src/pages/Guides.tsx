import { useState } from "react";
import NavBar from "../components/NavBar";
import BottomNav from "../components/BottomNav";
import SideMenu from "../components/SideMenu";
import Footer from "../components/Footer";
import GuideCard from "../components/GuideCard";
import GuideSection from "../components/GuideSection";
import CareGuideCard from "../components/CareGuideCard";
import { QUICK_GUIDES } from "../utils/quickGuides";
import { CARE_GUIDES } from "../utils/careGuides";

export default function Guides() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="sticky top-0 z-40">
        <NavBar onMenuClick={() => setMenuOpen(true)} />
        <BottomNav />
      </div>

      <main className="w-full flex-1 max-w-6xl mx-auto px-5 py-10 md:py-16 flex flex-col gap-8 md:gap-10">
        <h1 className="font-poppins text-3xl md:text-5xl text-[#1c2b18] text-center">Guías Rápidas Raíces</h1>

        {/* Escritorio: dos columnas independientes. Mobile: una sobre la otra, cada una se puede minimizar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <GuideSection title="Recursos para nuevos usuarios">
            <h3 className="font-poppins text-xl md:text-2xl text-[#1c2b18]">Videos disponibles</h3>
            {QUICK_GUIDES.map((g) => (
              <GuideCard key={g.id} guide={g} />
            ))}
          </GuideSection>

          <GuideSection title="Recursos para el cuido de plantas">
            <h3 className="font-poppins text-xl md:text-2xl text-[#1c2b18]">Guías de cuidado</h3>
            {CARE_GUIDES.map((g) => (
              <CareGuideCard key={g.id} guide={g} />
            ))}
          </GuideSection>
        </div>

        <p className="text-sm text-[#537a63] text-center">
          Más guías estarán disponibles próximamente. ¡Mantente al tanto!
        </p>
      </main>

      <Footer />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
