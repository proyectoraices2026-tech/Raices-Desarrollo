import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import NavBar from "../components/NavBar";
import SideMenu from "../components/SideMenu";

export default function AboutUs() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f7f2]">
      <NavBar onMenuClick={() => setMenuOpen(true)} />

      <div className="p-6 md:max-w-5xl md:mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 mb-4 text-[#3E5C4A] rounded-full hover:bg-[#4E705B]/10"
          aria-label="Volver a la página anterior"
        >
          <ArrowLeft className="w-6 h-6" aria-hidden="true" />
        </button>

        <h1 className="text-2xl font-bold text-[#1e2d24] mb-4">Sobre nosotros</h1>
        <p className="text-sm text-[#537a63] leading-relaxed mb-6">
          Raíces es un proyecto pensado para aquellas personas amantes de las plantas, que quieran hacer crecer su colección de plantas y aprender a cuidarlas.
          Nuestra misión es brindar una plataforma donde los usuarios puedan ver y comprar plantas, además de poder monitorear el estado de sus plantas; recibiendo recordatorios de riego y fertilización.
        </p>

        <h2 className="text-lg font-bold text-[#1e2d24] mb-3">Contáctenos</h2>
        <div className="text-sm text-[#537a63] space-y-1">
          <p>📧 Correo: proyectoraices2026@gmail.com</p>
          <p>📍 Ubicación: Palmares, Costa Rica</p>
          <p>📱 Número de teléfono: +506 0000-0000</p>
        </div>
      </div>

      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
