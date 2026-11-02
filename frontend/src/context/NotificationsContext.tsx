import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import {
  getNotifications,
  markAsRead as markAsReadInService,
  type AppNotification,
} from "../services/NotificationsService";

interface NotificationsContextType {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  reload: () => Promise<void>;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

/* Valor por defecto: si por algún motivo falta el Provider (ej. main.tsx sin actualizar),
   la campana se muestra vacía en vez de romper toda la app con pantalla en blanco. */
const EMPTY_CONTEXT: NotificationsContextType = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  reload: async () => {},
  markRead: () => {},
  markAllRead: () => {},
};

const NotificationsContext = createContext<NotificationsContextType>(EMPTY_CONTEXT);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!userId) {
      setNotifications([]);
      return;
    }
    setLoading(true);
    try {
      setNotifications(await getNotifications(userId));
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /* Se carga al iniciar sesión y se refresca cada 2 minutos */
  useEffect(() => {
    reload();
    if (!userId) return;
    const timer = setInterval(reload, 120000);
    return () => clearInterval(timer);
  }, [reload, userId]);

  const markRead = (id: string) => {
    if (!userId) return;
    markAsReadInService(userId, [id]);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllRead = () => {
    if (!userId) return;
    markAsReadInService(userId, notifications.map((n) => n.id));
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, loading, reload, markRead, markAllRead }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationsContext);
}
