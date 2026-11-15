import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const navigate = useNavigate();
  const { user} = useAuth();
  const {role} = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose();
    navigate("/");
  };

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  /* Con el menú abierto, el contenido de fondo no se desplaza ni recibe interacción:
     se bloquea el scroll de la página (compensando el ancho de la barra para que no salte el diseño) */
  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [isOpen]);

  return (
    <>
      {/* Fondo oscuro semitransparente. Sigue montado siempre para que la
          transición se vea suave; cuando está cerrado, no bloquea clics. */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 overscroll-contain ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel que se desliza desde la derecha */}
      <aside
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 h-full w-[80%] max-w-xs bg-white z-50 shadow-xl transition-transform duration-300 ease-out flex flex-col p-5 overflow-y-auto overscroll-contain ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className="self-end flex-shrink-0 text-3xl leading-none text-[#537a63] mb-4 w-8 h-8 flex items-center justify-center"
          title="Cerrar"
        >
          ×
        </button>

        <p className="text-xs text-[#537a63] mb-1">Sesión activa</p>
        <p className="text-sm font-semibold text-[#1e2d24] mb-6 truncate">{user?.email}</p>

        <nav className="flex flex-col gap-1">
          

          <button
            onClick={() => go("/profile")}
            className="text-left px-3 py-3 rounded-xl hover:bg-[#f0f4ee] text-[#1e2d24] text-sm font-medium"
          >
            Perfil
          </button>

          <button
            onClick={() => go("/noticias")}
            className="text-left px-3 py-3 rounded-xl hover:bg-[#f0f4ee] text-[#1e2d24] text-sm font-medium"
          >
            Noticias
          </button>

          <button
            onClick={() => go("/my-plants")}
            className="text-left px-3 py-3 rounded-xl hover:bg-[#f0f4ee] text-[#1e2d24] text-sm font-medium"
          >
            Mis plantas
          </button>

          <button
            onClick={() => go("/calendar")}
            className="text-left px-3 py-3 rounded-xl hover:bg-[#f0f4ee] text-[#1e2d24] text-sm font-medium"
          >
            Calendario
          </button>

          <button
            onClick={() => go("/")}
            className="text-left px-3 py-3 rounded-xl hover:bg-[#f0f4ee] text-[#1e2d24] text-sm font-medium"
          >
            Catálogo
          </button>

          <button
            onClick={() => go("/my-requests")}
            className="text-left px-3 py-3 rounded-xl hover:bg-[#f0f4ee] text-[#1e2d24] text-sm font-medium"
          >
            Mis pedidos
          </button>

          <button
            onClick={() => {
              onClose();
              navigate("/", { state: { showFavorites: true } });
            }}
            className="text-left px-3 py-3 rounded-xl hover:bg-[#f0f4ee] text-[#1e2d24] text-sm font-medium"
          >
            Lista de deseos
          </button>

          <button
            onClick={() => go("/notifications")}
            className="text-left px-3 py-3 rounded-xl hover:bg-[#f0f4ee] text-[#1e2d24] text-sm font-medium"
          >
            Notificaciones
          </button>

          <button
            onClick={() => go("/gardening-guides")}
            className="text-left px-3 py-3 rounded-xl hover:bg-[#f0f4ee] text-[#1e2d24] text-sm font-medium"
          >
            Guías de jardinería
          </button>

          <button
            onClick={() => go("/chatbot")}
            className="text-left px-3 py-3 rounded-xl hover:bg-[#f0f4ee] text-[#1e2d24] text-sm font-medium"
          >
            Chatbot
          </button>

          {role == "admin" &&
            <>
              <button
            onClick={() => go("/admin/stats")}
            className="text-left px-3 py-3 rounded-xl hover:bg-[#f0f4ee] text-[#1e2d24] text-sm font-medium"
          >
            Dashboard
          </button>

          <button
            onClick={() => go("/admin/requests")}
            className="text-left px-3 py-3 rounded-xl hover:bg-[#f0f4ee] text-[#1e2d24] text-sm font-medium"
          >
            Gestión pedidos
          </button>

          <button
            onClick={() => go("/admin/products/new")}
            className="text-left px-3 py-3 rounded-xl hover:bg-[#f0f4ee] text-[#1e2d24] text-sm font-medium"
          >
            Gestión productos
          </button>

          <button
            onClick={() => go("/admin/plants")}
            className="text-left px-3 py-3 rounded-xl hover:bg-[#f0f4ee] text-[#1e2d24] text-sm font-medium"
          >
            Registrar plantas a usuarios
          </button>
            </>
          }

          <hr className="my-3 border-[#e8efe4]" />

          <button
            onClick={handleLogout}
            className="text-left px-3 py-3 rounded-xl hover:bg-red-50 text-red-600 text-sm font-semibold"
          >
            Cerrar sesión
          </button>
        </nav>
      </aside>
    </>
  );
}