import { ShoppingCart, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { type ReactNode } from "react";
import logoIcon from "../assets/iconoraicesblanco.png";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

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

export default function NavBar({
  onMenuClick,
  showBack = false,
  onBack,
  hideCart = false,
  extraActions,
}: NavBarProps) {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { user } = useAuth();

  const handleLogin = () => {navigate ("/login")}
      
  

  return (
    <header className="bg-primarioBase px-6 md:px-10 py-3 md:py-4 border-b border-primarioOscuro/20 flex justify-between items-center">
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={onBack ?? (() => navigate(-1))}
            className="p-1 -ml-1 text-white rounded-full hover:bg-white/15 transition"
            title="Volver"
            aria-label="Volver a la página anterior"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
        )}

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5"
          aria-label="Ir al inicio, Mis Plantas"
        >
          <img src={logoIcon} alt="" className="h-7 w-auto object-contain" aria-hidden="true" />
          <span className="text-2xl font-semibold text-white">Raíces</span>
        </button>
      </div>

      <div className="flex items-center gap-4">

        {!user && <>
          <button className="
        btn btn-Secondary btn-sm md:btn-md
        bg-white border-0 text-textoNegro
        hover:bg-fondoGlobal hover:border-0
        transition-all duration-300" onClick={handleLogin}>
            Iniciar Sesión
          </button>
        </>}


        {extraActions}

        {!hideCart && (
          <button
            onClick={() => navigate("/cart")}
            className="relative p-1 text-white"
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
                className="absolute -top-1 -right-1 bg-white text-primarioBase text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                aria-hidden="true"
              >
                {totalItems}
              </span>
            )}
          </button>
        )}
        {user && <>
          <button
            onClick={onMenuClick}
            className="p-1"
            title="Menú"
            aria-label="Abrir menú"
          >
            <div className="flex flex-col gap-[3px]" aria-hidden="true">
              <span className="block w-6 h-[2.5px] bg-white" />
              <span className="block w-6 h-[2.5px] bg-white" />
              <span className="block w-6 h-[2.5px] bg-white" />
            </div>
          </button>
        </>}

      </div>
    </header>
  );
}