import { useAuth } from "../context/AuthContext";
import { useNavTabs } from "../hooks/UseNavTabs";

/* Navegación mobile: footer fijo al fondo. En escritorio la navegación vive en el header (DesktopNavLinks) */
export default function BottomNav() {
  const { role } = useAuth();
  const { tabs, handleClick, isActive } = useNavTabs();

  if (!role) return null;

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#e8efe4] px-2 py-2 flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.06)]"
      aria-label="Navegación principal"
    >
      {tabs.map((tab) => {
        const active = isActive(tab);
        return (
          <button
            key={tab.key}
            onClick={() => handleClick(tab.path)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition min-w-[64px] ${
              active ? "bg-verdePastel text-primarioOscuro" : "text-primarioBase"
            }`}
          >
            <img src={tab.icon} alt="" className="w-5 h-5 object-contain" />
            <span className="text-[10px] font-semibold">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}