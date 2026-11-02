import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import NavBar from "../components/NavBar";
import BottomNav from "../components/BottomNav";
import SideMenu from "../components/SideMenu";
import Footer from "../components/Footer";
import NotificationIcon from "../components/NotificationIcon";
import { useNotifications } from "../context/NotificationsContext";
import { formatRelativeDate, type AppNotification } from "../services/NotificationsService";

type FilterKey = "all" | "unread" | "orders" | "watering" | "pruning" | "fertilizing" | "custom";

const FILTERS: { key: FilterKey; label: string; match: (n: AppNotification) => boolean }[] = [
  { key: "all", label: "Todas", match: () => true },
  { key: "unread", label: "Sin leer", match: (n) => !n.read },
  { key: "orders", label: "Pedidos", match: (n) => n.kind === "order_accepted" || n.kind === "order_rejected" },
  { key: "watering", label: "Regar", match: (n) => n.kind === "task_watering" },
  { key: "pruning", label: "Podar", match: (n) => n.kind === "task_pruning" },
  { key: "fertilizing", label: "Abonar", match: (n) => n.kind === "task_fertilizing" },
  { key: "custom", label: "Personalizadas", match: (n) => n.kind === "task_custom" },
];

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, unreadCount, loading, markRead, markAllRead } = useNotifications();
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState<FilterKey>("all");

  const visible = useMemo(() => {
    const active = FILTERS.find((f) => f.key === filter) ?? FILTERS[0];
    return notifications.filter(active.match);
  }, [notifications, filter]);

  const openNotification = (n: AppNotification) => {
    markRead(n.id);
    navigate(n.link);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="sticky top-0 z-40">
        <NavBar onMenuClick={() => setMenuOpen(true)} />
        <BottomNav />
      </div>

      <main className="w-full flex-1 max-w-[1680px] mx-auto px-5 py-6 md:px-12 md:py-12 xl:px-[120px] flex flex-col gap-6 md:gap-8">
        <div className="flex items-center gap-4 md:gap-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#eaf1ec] text-[#527a65] flex items-center justify-center flex-shrink-0 hover:bg-[#dbe8df] transition"
            aria-label="Volver a la página anterior"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <h1 className="font-poppins text-2xl md:text-4xl font-bold text-[#0b2525]">Notificaciones</h1>
        </div>

        <section className="border border-[#d8e0d8] rounded-3xl p-5 md:p-8 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2 min-w-0">
              <h2 className="font-poppins text-lg md:text-2xl font-bold text-[#0b2525]">Notificaciones recientes</h2>
              <p className="text-sm text-[#344052]">
                Revisa el estado de tus pedidos y las tareas pendientes de tus plantas para regar, podar, abonar y tareas personalizadas.
              </p>
            </div>
            <span className="bg-[#eaf1ec] text-[#3f5f4d] text-xs font-bold rounded-full px-3 py-1.5 whitespace-nowrap">
              {unreadCount} {unreadCount === 1 ? "nueva" : "nuevas"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar notificaciones">
            {FILTERS.map((f) => {
              const active = f.key === filter;
              return (
                <button
                  key={f.key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.key)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition ${
                    active
                      ? "bg-[#527b66] text-white border-[#527b66]"
                      : "bg-white text-[#0b2525] border-[#d8e0d8] hover:border-[#527b66]"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="border border-[#d8e0d8] rounded-3xl p-4 md:p-8 flex flex-col gap-4">
          <div className="flex justify-end">
            <button
              onClick={markAllRead}
              disabled={unreadCount === 0}
              className="rounded-full border border-[#d8e0d8] px-4 py-1.5 text-xs font-bold text-[#3f5f4d] hover:bg-[#eaf1ec] disabled:opacity-50 disabled:hover:bg-transparent transition"
            >
              Marcar todas como leídas
            </button>
          </div>

          {loading && notifications.length === 0 ? (
            <p className="text-sm text-[#6b7280] py-10 text-center">Cargando notificaciones...</p>
          ) : visible.length === 0 ? (
            <p className="text-sm text-[#6b7280] py-10 text-center">No hay notificaciones en esta categoría.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {visible.map((n) => (
                <li key={n.id}>
                  <button
                    onClick={() => openNotification(n)}
                    className={`w-full text-left rounded-xl border border-[#e5e7eb] px-4 py-3 md:px-5 flex items-center gap-4 hover:border-[#527b66] transition ${
                      n.read ? "bg-white" : "bg-[#eaf1ec]"
                    }`}
                  >
                    <NotificationIcon kind={n.kind} />
                    <span className="flex-1 min-w-0 flex flex-col gap-1">
                      <span className={`text-sm md:text-base text-[#0b2525] ${n.read ? "font-medium" : "font-bold"}`}>{n.title}</span>
                      <span className="text-xs md:text-[13px] text-[#344052]">{n.message}</span>
                    </span>
                    <span className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className="text-[11px] font-bold text-[#3f5f4d]">{formatRelativeDate(n.createdAt)}</span>
                      <span className="bg-[#dbe8df] text-[#3f5f4d] text-[11px] font-semibold rounded-full px-3 py-1">
                        {n.read ? "Leída" : "Sin leer"}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <Footer />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
