import { useLocation, useNavigate } from "react-router-dom";

import { useAlert } from "../context/AlertContext";
import { useAuth } from "../context/AuthContext";

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { role } = useAuth();

  const TABS = [
    { key: "calendar", label: "Calendario", path: "/calendar" },
    ...(role === "admin"
      ? [{ key: "dashboard", label: "Dashboard", path: "/admin" }]
      : [{ key: "my-plants", label: "Mis plantas", path: "/my-plants" }]),
    { key: "catalog", label: "Catálogo", path: "/catalog" },
    { key: "chatbot", label: "Chatbot", path: null as string | null },
  ];

  const handleClick = (path: string | null) => {
    if (!path) {
      showAlert({ title: "Próximamente", message: "Esta sección todavía no está disponible.", variant: "info" });
      return;
    }
    navigate(path);
  };

  return (
    <nav className="bg-verdePastel border-b border-extra/40 flex flex-nowrap items-center gap-2 px-3 py-3 overflow-x-auto touch-pan-x overscroll-x-contain md:justify-center md:gap-3">
      {TABS.map((tab) => {
        const isActive = tab.path === location.pathname;
        return (
          <button
            key={tab.key}
            onClick={() => handleClick(tab.path)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-sm font-semibold transition ${
              isActive ? "bg-white text-textoSecundario shadow" : "bg-verdePastel text-primarioBase hover:bg-white/60"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
