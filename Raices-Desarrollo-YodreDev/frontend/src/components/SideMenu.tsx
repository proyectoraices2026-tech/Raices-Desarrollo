import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideMenu({ isOpen, onClose }: SideMenuProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showInfo, setShowInfo] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose();
    navigate("/login");
  };

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <>
      {/* Fondo oscuro semitransparente. Sigue montado siempre para que la
          transición se vea suave; cuando está cerrado, no bloquea clics. */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel que se desliza desde la derecha */}
      <aside
        className={`fixed top-0 right-0 h-full w-[80%] max-w-xs bg-white z-50 shadow-xl transition-transform duration-300 ease-out flex flex-col p-5 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={onClose}
          className="self-end text-3xl leading-none text-[#537a63] mb-4 w-8 h-8 flex items-center justify-center"
          title="Cerrar"
        >
          ×
        </button>

        <p className="text-xs text-[#537a63] mb-1">Sesión activa</p>
        <p className="text-sm font-semibold text-[#1e2d24] mb-6 truncate">{user?.email}</p>

        <nav className="flex flex-col gap-1">
          <button
            onClick={() => setShowInfo((v) => !v)}
            className="text-left px-3 py-3 rounded-xl hover:bg-[#f0f4ee] text-[#1e2d24] text-sm font-medium"
          >
            Ver información del perfil
          </button>

          {showInfo && (
            <div className="bg-[#f0f4ee] rounded-xl px-3 py-3 -mt-1 mb-1 text-xs text-[#537a63] space-y-1">
              <p><span className="font-semibold">Nombre:</span> {(user?.user_metadata?.name as string) ?? "—"}</p>
              <p><span className="font-semibold">Correo:</span> {user?.email}</p>
              <p><span className="font-semibold">Teléfono:</span> {(user?.user_metadata?.phone as string) ?? "—"}</p>
            </div>
          )}

          <button
            onClick={() => go("/profile")}
            className="text-left px-3 py-3 rounded-xl hover:bg-[#f0f4ee] text-[#1e2d24] text-sm font-medium"
          >
            Editar perfil
          </button>

          <button
            onClick={() => go("/about")}
            className="text-left px-3 py-3 rounded-xl hover:bg-[#f0f4ee] text-[#1e2d24] text-sm font-medium"
          >
            Sobre nosotros / Contáctenos
          </button>

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