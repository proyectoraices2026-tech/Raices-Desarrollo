import { useLocation, useNavigate } from "react-router-dom";

import { useAlert } from "../context/AlertContext";

const TABS = [
  { key: "calendar", label: "Calendario", icon: "📅", path: null },
  { key: "my-plants", label: "Mis Plantas", icon: "🪴", path: "/my-plants" },
  { key: "catalog", label: "Tienda", icon: "🛍️", path: "/catalog" },
  { key: "chatbot", label: "Chatbot", icon: "💬", path: null },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleClick = (path: string | null) => {
    if (!path) {
      showAlert({ title: "Próximamente", message: "Esta sección todavía no está disponible.", variant: "info" });
      return;
    }
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#dce3db]/95 backdrop-blur-md border-t border-[#e8efe4] flex justify-around items-center py-2 z-50">
      {TABS.map((tab) => {
        const isActive = tab.path === location.pathname;
        return (
          <button
            key={tab.key}
            onClick={() => handleClick(tab.path)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition ${
              isActive ? "bg-[#87c6a1] text-[#1e2d24]" : "text-[#537a63]"
            }`}
          >
            <span className="text-xl leading-none">{tab.icon}</span>
            <span className="text-[10px] font-semibold">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}