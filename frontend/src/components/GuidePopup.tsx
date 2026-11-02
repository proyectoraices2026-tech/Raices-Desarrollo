import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { hasSeenGuide, markGuideSeen } from "../services/GuideService";
import { QUICK_GUIDES } from "../utils/quickGuides";
import GuideCard from "./GuideCard";

/* Pantallas donde no tiene sentido interrumpir con la guía */
const EXCLUDED_PATHS = ["/login", "/register", "/forgot-password", "/reset-password", "/guides"];

/* Popup de bienvenida: se muestra una sola vez la primera vez que el usuario entra con sesión */
export default function GuidePopup() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const userId = user?.id ?? null;
  const excluded = EXCLUDED_PATHS.includes(location.pathname);

  useEffect(() => {
    if (!loading && userId && !excluded && !hasSeenGuide(userId)) setOpen(true);
  }, [loading, userId, excluded]);

  if (!open || !userId) return null;

  const close = () => {
    markGuideSeen(userId);
    setOpen(false);
  };

  const goToFullGuide = () => {
    close();
    navigate("/guides");
  };

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-popup-title"
    >
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-5 md:p-8 flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-block bg-[#ddefe5] text-[#1c2b18] text-[11px] font-semibold uppercase tracking-widest rounded-full px-4 py-1.5">
              Recursos para nuevos usuarios
            </span>
            <h2 id="guide-popup-title" className="font-poppins text-2xl md:text-3xl text-[#1c2b18] mt-3">
              Guías Rápidas Raíces
            </h2>
          </div>
          <button onClick={close} className="p-1 rounded-full text-[#527b66] hover:bg-[#eaf1ec]" aria-label="Cerrar guía">
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {QUICK_GUIDES.map((g) => (
            <GuideCard key={g.id} guide={g} compact />
          ))}
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button onClick={close} className="rounded-full border border-[#c8ddc0] px-6 py-2.5 text-sm font-semibold text-[#3f5f4d] hover:bg-[#eaf1ec]">
            Cerrar
          </button>
          <button onClick={goToFullGuide} className="rounded-full bg-[#537a63] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#496953]">
            Ver guía completa
          </button>
        </div>
      </div>
    </div>
  );
}
