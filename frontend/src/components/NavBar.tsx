import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import logoIcon from "../assets/logo-icon.png";
import { useCart } from "../context/CartContext";

interface NavBarProps {
  /* Abre el panel lateral (SideMenu); cada página sigue siendo dueña de ese estado */
  onMenuClick: () => void;
  /* Muestra una flecha de "volver" a la izquierda del logo, para pantallas sin bottom nav */
  showBack?: boolean;
  /* Permite sobreescribir a dónde regresa la flecha; por defecto usa el historial del navegador */
  onBack?: () => void;
  /* Oculta el ícono del carrito (por ejemplo, en pantallas donde no aplica comprar) */
  hideCart?: boolean;
  /* Espacio para botones adicionales específicos de una página (ej. "Añadir" del admin) */
  extraActions?: ReactNode;
}

/*
  Navbar estandarizado de Raíces.

  Antes cada página (MyPlants, Catalog, etc.) tenía su propio header copiado y pegado,
  con pequeñas diferencias entre sí (por ejemplo, a Catalog se le vació por accidente el
  texto "Raíces" en un merge). Este componente centraliza esa barra para que solo exista
  una fuente de verdad del diseño, y agregar/cambiar algo aquí lo actualiza en todas las
  páginas que lo usan.
*/
export default function NavBar({
  onMenuClick,
  showBack = false,
  onBack,
  hideCart = false,
  extraActions,
}: NavBarProps) {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-[#DCE3DB] px-6 md:px-12 py-4 md:py-6 border-b border-slate-100 flex justify-between items-center">
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={onBack ?? (() => navigate(-1))}
            className="p-1 -ml-1 text-[#3E5C4A] rounded-full hover:bg-white/40 transition"
            title="Volver"
            aria-label="Volver a la página anterior"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
        )}

        <button
          onClick={() => navigate("/my-plants")}
          className="flex items-center gap-1.5"
          aria-label="Ir al inicio, Mis Plantas"
        >
          <img src={logoIcon} alt="" className="h-7 w-auto object-contain" aria-hidden="true" />
          <span className="text-2xl font-semibold text-[#537A63]">Raíces</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        {extraActions}

        {!hideCart && (
          <button
            onClick={() => navigate("/cart")}
            className="relative p-1 text-[#537A63]"
            title="Carrito"
            aria-label={
              totalItems > 0
                ? `Carrito, ${totalItems} producto${totalItems === 1 ? "" : "s"}`
                : "Carrito, vacío"
            }
          >
            <ShoppingCart className="w-6 h-6" aria-hidden="true" />
            {totalItems > 0 && (
              <span
                className="absolute -top-1 -right-1 bg-[#537A63] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                aria-hidden="true"
              >
                {totalItems}
              </span>
            )}
          </button>
        )}

        <button
          onClick={onMenuClick}
          className="p-1"
          title="Menú"
          aria-label="Abrir menú"
        >
          <div className="flex flex-col gap-[3px]" aria-hidden="true">
            <span className="block w-6 h-[2.5px] bg-[#26623f]" />
            <span className="block w-6 h-[2.5px] bg-[#26623f]" />
            <span className="block w-6 h-[2.5px] bg-[#26623f]" />
          </div>
        </button>
      </div>
    </header>
  );
}
