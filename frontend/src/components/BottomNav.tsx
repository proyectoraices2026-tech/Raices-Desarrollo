import { useLocation, useNavigate } from "react-router-dom";

import { useAlert } from "../context/AlertContext";
import { useAuth } from "../context/AuthContext";

import calendarIcon from "../assets/iconsPhone/calendar.svg";
import plantsIcon from "../assets/iconsPhone/seedling.svg";
import catalogIcon from "../assets/iconsPhone/cart.svg";
import chatIcon from "../assets/iconsPhone/robot.svg";

interface NavTab {
  key: string;
  label: string;
  icon: string;
  path: string | null;
}


/* Nav para escritorio, footer para mobile */

export default function BottomNav() {

  const { role } = useAuth();
  function useNavTabs(): NavTab[] {

    return [
    
    { key: "calendar", label: "Calendario", icon: calendarIcon, path: "/calendar" },
    ...(role === "admin"
      ? [{ key: "dashboard", label: "Dashboard", icon: calendarIcon, path: "/admin" }]
      : [{ key: "my-plants", label: "Mis plantas", icon: plantsIcon, path: "/my-plants" }]),
    { key: "catalog", label: "Catálogo", icon: catalogIcon, path: "/" },
    { key: "chatbot", label: "Chatbot", icon: chatIcon, path: null as string | null },
    ];
  
  }

  const location = useLocation(); 
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const TABS = useNavTabs();

  const handleClick = (path: string | null) => {
    if (!path) {
      showAlert({ title: "Próximamente", message: "Esta sección todavía no está disponible.", variant: "info" });
      return;
    }
    navigate(path);
  };

  return (
    
    <>
    {role &&
      <>
        {/* Escritorio: franja de píldoras, oculta antes de md */}
      
      
      <nav className="hidden md:flex flex-nowrap items-center justify-center gap-3 px-3 py-3 bg-verdePastel border-b border-extra/40">
        {TABS.map((tab) => {
          const isActive = tab.path === location.pathname;
          return (
            <button
              key={tab.key}
              onClick={() => handleClick(tab.path)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition ${
                isActive ? "bg-white text-textoSecundario shadow" : "bg-verdePastel text-primarioBase hover:bg-white/60"
              }`}
            >
              <img src={tab.icon} alt="" className="w-4 h-4 object-contain" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Mobile: footer fijo al fondo de la pantalla, oculto desde md */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#e8efe4] px-2 py-2 flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.06)]"
        aria-label="Navegación principal"
      >
        {TABS.map((tab) => {
          const isActive = tab.path === location.pathname;
          return (
            <button
              key={tab.key}
              onClick={() => handleClick(tab.path)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition min-w-[64px] ${
                isActive ? "bg-verdePastel text-primarioOscuro" : "text-primarioBase"
              }`}
            >
              <img src={tab.icon} alt="" className="w-5 h-5 object-contain" />
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </nav>
      </>
    }
      
    </>
  );
}
