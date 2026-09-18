//Paginita para probar


import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";

import { ShoppingCart } from "lucide-react";
import logoIcon from "../assets/logo-icon.png";

import { useState } from "react";
import SideMenu from "../components/SideMenu";
import { useAlert } from "../context/AlertContext";

import { useCart } from "../context/CartContext";

const MOCK_PLANTS = [
  { id: 1, name: "Monstera Deliciosa", status: "Regar en 2 días" },
  { id: 2, name: "Pothos Dorado", status: "Mismo estado esta semana" },
  { id: 3, name: "Ficus Lyrata", status: "Al día" },
  { id: 4, name: "Ficus Lyrata", status: "Al día" },
  { id: 5, name: "Ficus Lyrata", status: "Al día" },
  { id: 6, name: "Monstera Deliciosa", status: "Regar en 3 días" },
  { id: 7, name: "Ficus Lyrata", status: "Al día" },
  { id: 8, name: "Monstera Deliciosa", status: "Regar en 1 día" },
  { id: 9, name: "Ficus Lyrata", status: "Al día" },
  { id: 10, name: "Ficus Lyrata", status: "Al día" },
  { id: 11, name: "Pothos Dorado", status: "Ahorra esta semana" },
  { id: 12, name: "Ficus Lyrata", status: "Al día" },
];

export default function MyPlants() {

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const { showAlert } = useAlert();

  const { totalItems } = useCart();

  return (
    <div className="min-h-screen bg-[#f5f7f2] pb-28">
      <header className="bg-[#DCE3DB] px-6 md:px-12 py-4 md:py-6 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <img src={logoIcon} alt="Raíces logo" className="h-7 w-auto object-contain" />
            <span className="text-2xl font-semibold text-[#537A63]">Raíces</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/cart")}
              className="relative p-1 text-[#537A63]"
              title="Carrito"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#537A63] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(true)}
              className="p-1"
              title="Menú"
            >
              <div className="flex flex-col gap-[3px]">
                <span className="block w-6 h-[2.5px] bg-[#26623f]" />
                <span className="block w-6 h-[2.5px] bg-[#26623f]" />
                <span className="block w-6 h-[2.5px] bg-[#26623f]" />
              </div>
            </button>
          </div>
        </header>

      <div className="md:max-w-5xl md:mx-auto">

        {/* Hero */}
        <div className="p-5 md:px-12 md:py-8">
          <span className="inline-block bg-white text-[#5a7a54] text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Tu jardín interior te espera
          </span>
          <h1 className="text-2xl font-bold text-[#1e2d24] mb-1">
            Cuida tus plantas <span className="text-[#537a63] italic">con intención</span>
          </h1>
          <p className="text-sm md:text-base text-[#537a63] mb-4 md:max-w-md">
            Seguimiento personalizado, recordatorios inteligentes y diagnósticos visuales
            para que cada hoja prospere.
          </p>

          {/* Widget de tareas — texto fijo, sin datos reales */}
          <div className="bg-[#929487] rounded-2xl p-4 text-white mb-4">
            <p className="text-xs font-semibold opacity-80 mb-1">HOY · LUN 1 SEP</p>
            <p className="text-sm font-bold mb-2">3 tareas pendientes</p>
            <ul className="text-xs space-y-1 mb-3">
              <li>💧 Regar Monstera Deliciosa</li>
              <li>☀️ Rotar Ficus hacia la ventana</li>
              <li>🌱 Fertilizar Pothos</li>
            </ul>
            <button
              onClick={() => showAlert({ title: "Próximamente", message: "Esta función todavía no está disponible.", variant: "info" })}
              className="text-xs font-semibold underline"
            >
              Ver calendario completo →
            </button>
          </div>
        </div>

        {/* Grid de plantas */}
        <div className="px-5 md:px-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {MOCK_PLANTS.map((plant) => (
            <div
              key={plant.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#e8efe4]"
            >
              <div className="h-24 md:h-32 bg-[#e8efe4]" />
              <div className="p-2">
                <p className="text-xs font-bold text-[#1e2d24] truncate">{plant.name}</p>
                <p className="text-[10px] text-[#537a63]">{plant.status}</p>
              </div>
            </div>
          ))}

          <button
            onClick={() => showAlert({ title: "Próximamente", message: "Esta función todavía no está disponible.", variant: "info" })}
            className="bg-white rounded-2xl border border-dashed border-[#c8dcc2] flex flex-col items-center justify-center gap-1 py-8 text-[#537a63]"
          >
            <span className="text-2xl">+</span>
            <span className="text-xs font-semibold">Añadir planta</span>
          </button>
        </div>
        <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        <BottomNav />

      </div>
    </div>
  );
}