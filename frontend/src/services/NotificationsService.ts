import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";
import { getMyRequests } from "./RequestService";
import { getPlantTasksInRange, type PlantTask } from "./PlantTasksService";

/*
    Servicio de notificaciones.

    Mientras tanto las notificaciones se DERIVAN de datos que ya existen:
      - Pedidos aceptados o rechazados
      - Tareas de plantas de hoy y de los próximos días, o atrasadas.
    El estado "leída" se guarda en la cuenta de Supabase Auth (user_metadata) y en localStorage como respaldo.
*/

export type NotificationKind =
  | "order_accepted"
  | "order_rejected"
  | "task_watering"
  | "task_pruning"
  | "task_fertilizing"
  | "task_custom";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  createdAt: string; // ISO
  read: boolean;
  /* A dónde lleva al hacer clic */
  link: string;
}

const READ_KEY_PREFIX = "raices_notifications_read_";
const READ_METADATA_KEY = "notifications_read";
/* Máximo de ids "leídos" que se guardan en la cuenta (se descartan los más antiguos) */
const MAX_READ_IDS = 100;

/* Cache en memoria por usuario, para que varios clics seguidos no se pisen entre sí */
const readCache = new Map<string, string[]>();
let saveQueue: Promise<unknown> = Promise.resolve();

function readLocalIds(userId: string): string[] {
  try {
    const raw = localStorage.getItem(`${READ_KEY_PREFIX}${userId}`);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLocalIds(userId: string, ids: string[]) {
  try {
    localStorage.setItem(`${READ_KEY_PREFIX}${userId}`, JSON.stringify(ids));
  } catch {
    /* sin almacenamiento disponible: queda solo el guardado en la cuenta */
  }
}

/* Ids leídos = los de la cuenta de Supabase (user_metadata) + los del navegador + los marcados en esta sesión */
function getReadIds(user: User): string[] {
  const fromAccount = user.user_metadata?.[READ_METADATA_KEY];
  const merged = [
    ...(Array.isArray(fromAccount) ? fromAccount : []),
    ...readLocalIds(user.id),
    ...(readCache.get(user.id) ?? []),
  ];
  const unique = [...new Set(merged)].slice(-MAX_READ_IDS);
  readCache.set(user.id, unique);
  return unique;
}

/* Días hacia atrás y hacia adelante que se consideran para las tareas de plantas */
const TASK_DAYS_BACK = 7;
const TASK_DAYS_AHEAD = 3;
/* Máximo de pedidos recientes que se muestran */
const MAX_ORDERS = 10;

const TASK_VERBS: Record<
  string,
  { today: string; week: string; kind: NotificationKind; text: string }
> = {
  watering: {
    today: "Regar hoy",
    week: "Regar",
    kind: "task_watering",
    text: "La planta necesita agua. Revisa el sustrato y riega cuando esté seco al tacto.",
  },
  pruning: {
    today: "Podar hoy",
    week: "Podar",
    kind: "task_pruning",
    text: "Es momento de cortar tallos largos y estimular el crecimiento lateral.",
  },
  fertilizing: {
    today: "Abonar hoy",
    week: "Abonar",
    kind: "task_fertilizing",
    text: "Aplica fertilizante equilibrado para impulsar el crecimiento de hojas y tallos.",
  },
};

function taskToNotification(
  task: PlantTask,
  todayStr: string,
): AppNotification {
  const base = TASK_VERBS[task.task_type];
  const diff = differenceInCalendarDays(
    parseISO(task.due_date),
    parseISO(todayStr),
  );

  let title: string;
  if (task.task_type === "custom") {
    title = `Tarea personalizada: ${task.label ?? "tarea"} (${task.plant_name})`;
  } else if (diff === 0) {
    title = `${base.today}: ${task.plant_name}`;
  } else if (diff > 0) {
    title = `${base.week} pronto: ${task.plant_name}`;
  } else {
    title = `${base.week} pendiente: ${task.plant_name}`;
  }

  return {
    id: `task-${task.id}`,
    kind: task.task_type === "custom" ? "task_custom" : base.kind,
    title,
    message:
      task.task_type === "custom"
        ? (task.notes ?? "Revisa esta tarea en tu calendario.")
        : base.text,
    createdAt: `${task.due_date}T00:00:00`,
    read: false,
    link: "/calendar",
  };
}

export async function getNotifications(user: User): Promise<AppNotification[]> {
  const userId = user.id;
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const from = format(addDays(today, -TASK_DAYS_BACK), "yyyy-MM-dd");
  const to = format(addDays(today, TASK_DAYS_AHEAD), "yyyy-MM-dd");

  /* Cada fuente falla por separado: si el backend de pedidos no responde, igual se ven las tareas */
  const [requests, tasks] = await Promise.all([
    getMyRequests().catch(() => []),
    getPlantTasksInRange(userId, from, to).catch(() => []),
  ]);

  const orderNotifications: AppNotification[] = requests
    .filter((r) => r.status === "accepted" || r.status === "rejected")
    .slice(0, MAX_ORDERS)
    .map((r) => {
      const shortId = r.id.slice(0, 4).toUpperCase();
      const accepted = r.status === "accepted";
      return {
        id: `order-${r.id}-${r.status}`,
        kind: accepted ? "order_accepted" : "order_rejected",
        title: accepted
          ? `Pedido #${shortId} aceptado por el dueño`
          : `Pedido #${shortId} rechazado por el dueño`,
        message: r.adminMessage
          ? r.adminMessage
          : accepted
            ? "El dueño confirmó tu pedido. Ya puedes coordinar la entrega."
            : "El dueño canceló este pedido. La orden quedó anulada.",
        createdAt: r.updatedAt,
        read: false,
        link: "/my-requests",
      };
    });

  const taskNotifications = tasks
    .filter((t) => !t.completed)
    .map((t) => taskToNotification(t, todayStr));

  const readIds = new Set(getReadIds(user));

  return [...orderNotifications, ...taskNotifications]
    .map((n) => ({ ...n, read: readIds.has(n.id) }))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/*
    Marca notificaciones como leídas. Se guarda en la cuenta de Supabase Auth (user_metadata.notifications_read),
    así el "leída" se mantiene en cualquier navegador o dispositivo.
*/
export function markAsRead(user: User, ids: string[]): Promise<void> {
  const next = [...new Set([...getReadIds(user), ...ids])].slice(-MAX_READ_IDS);
  readCache.set(user.id, next);
  saveLocalIds(user.id, next);

  /* Las actualizaciones se encadenan para que se guarde siempre la lista más reciente */
  saveQueue = saveQueue
    .then(() =>
      supabase.auth.updateUser({
        data: { [READ_METADATA_KEY]: readCache.get(user.id) ?? next },
      }),
    )
    .catch(() => undefined);
  return saveQueue as Promise<void>;
}

/* Texto relativo para la fecha: "Hoy", "Ayer", "3 días", "Mañana", "En 2 días" */
export function formatRelativeDate(iso: string): string {
  const diff = differenceInCalendarDays(new Date(), parseISO(iso));
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Ayer";
  if (diff > 1) return `Hace ${diff} días`;
  if (diff === -1) return "Mañana";
  return `En ${Math.abs(diff)} días`;
}
