import { useAuth } from "../context/AuthContext";
import { useNavTabs } from "../hooks/UseNavTabs"

/* Navegación de escritorio: texto simple dentro del header. Oculta en mobile, donde se usa BottomNav */
export default function DesktopNavLinks() {
    const { role } = useAuth();
    const { tabs, handleClick, isActive } = useNavTabs();

    if (!role) return null;

    return (
        <nav className="hidden md:flex items-center justify-center gap-8" aria-label="Navegación principal">
            {tabs.map((tab) => {
                const active = isActive(tab);
                return (
                    <button
                        key={tab.key}
                        onClick={() => handleClick(tab.path)}
                        aria-current={active ? "page" : undefined}
                        className={`text-sm font-semibold pb-1 border-b-2 transition ${active
                                ? "text-white border-white"
                                : "text-white/75 border-transparent hover:text-white"
                            }`}
                    >
                        {tab.label}
                    </button>
                );
            })}
        </nav>
    );
}