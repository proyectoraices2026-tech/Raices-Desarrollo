import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, X } from "lucide-react";
import bellIcon from "../assets/iconsPhone/notiBlanco.png";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import { formatRelativeDate, type AppNotification } from "../services/NotificationsService";

const PANEL_LIMIT = 3;

/* Campana del header con contador de no leídas y panel desplegable de notificaciones recientes */
export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, markRead, reload } = useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Cierra con clic fuera o con Escape */
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  const recent = notifications.slice(0, PANEL_LIMIT);

  const toggle = () => {
    if (!open) reload();
    setOpen((v) => !v);
  };

  const openNotification = (n: AppNotification) => {
    markRead(n.id);
    setOpen(false);
    navigate(n.link);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={toggle}
        className="relative p-1 text-white hover:text-white/80 transition"
        title="Notificaciones"
        aria-label={unreadCount > 0 ? `Notificaciones, ${unreadCount} sin leer` : "Notificaciones"}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <img src={bellIcon} alt="" className="w-6 h-6 object-contain" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 bg-white text-primarioBase text-[9px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center"
            aria-hidden="true"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notificaciones"
          className="fixed left-3 right-3 top-[68px] md:absolute md:left-auto md:right-0 md:top-full md:mt-3 md:w-[400px] z-50 bg-white rounded-[14px] shadow-[0_12px_16px_rgba(0,0,0,0.12)] border border-[#e5e7eb] p-5 md:p-6 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-[#111827]">Notificaciones</p>
            <button
              onClick={() => setOpen(false)}
              className="text-[#527b66] p-1 rounded-full hover:bg-[#eaf1ec]"
              aria-label="Cerrar notificaciones"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {recent.length === 0 ? (
            <p className="text-sm text-[#6b7280] py-4 text-center">No tienes notificaciones por ahora.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {recent.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => openNotification(n)}
                    className={`w-full text-left rounded-xl border border-[#e5e7eb] p-4 flex flex-col gap-2 hover:border-[#527b66] transition ${
                      n.read ? "bg-white" : "bg-[#eaf1ec]"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className={`text-[15px] text-[#111827] ${n.read ? "font-medium" : "font-bold"}`}>{n.title}</span>
                      {!n.read && <span className="w-2 h-2 rounded bg-[#527b66] flex-shrink-0" aria-label="Sin leer" />}
                    </span>
                    <span className="text-[13px] leading-5 text-[#6b7280]">{n.message}</span>
                    <span className="text-xs font-medium text-[#9ca3af]">{formatRelativeDate(n.createdAt)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => {
              setOpen(false);
              navigate("/notifications");
            }}
            className="flex items-center gap-1 text-[13px] font-semibold text-[#527b66] hover:underline underline-offset-4 pt-1"
          >
            Ver todas las notificaciones
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
