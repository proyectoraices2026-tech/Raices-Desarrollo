import { Sparkles, X } from "lucide-react";
import { CARE_TASK_ICONS, type CareTaskType } from "../constants/taskIcons";
import type { PlantTask } from "../services/PlantTasksService";

interface TaskActionPopupProps {
  isOpen: boolean;
  task: PlantTask | null;
  subtitle: string;
  /* Solo las tareas de hoy o anteriores (atrasadas) se pueden marcar como hechas */
  canComplete: boolean;
  completing?: boolean;
  onClose: () => void;
  onMarkDone: () => void;
  onViewPlant: () => void;
}

/* Pop-up de acción para una sola tarea: aparece al tocar una tarjeta de "Hoy" o
   "Próximas". Si la tarea ya se puede completar (hoy o atrasada) muestra
   "Marcar hecha" + "Ver planta"; si es futura, solo "Cerrar" + "Ver planta". */
export default function TaskActionPopup({
  isOpen,
  task,
  subtitle,
  canComplete,
  completing,
  onClose,
  onMarkDone,
  onViewPlant,
}: TaskActionPopupProps) {
  if (!isOpen || !task) return null;

  const isCareTask = task.task_type !== "custom";
  const meta = isCareTask ? CARE_TASK_ICONS[task.task_type as CareTaskType] : null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[70]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-action-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <span
          className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${meta?.boxBg ?? "bg-[#f0f0ec]"}`}
          aria-hidden="true"
        >
          {meta ? (
            <img src={meta.icon} alt="" className="w-6 h-6 object-contain" />
          ) : (
            <Sparkles className="w-6 h-6 text-[#8a7a68]" />
          )}
        </span>

        <h2 id="task-action-title" className="text-sm font-bold text-[#1e2d24]">
          {task.plant_name}
        </h2>
        <p className="text-xs text-primarioBase mb-5">{subtitle}</p>

        <div className="flex flex-col gap-2">
          {canComplete && (
            <button
              type="button"
              onClick={onMarkDone}
              disabled={completing}
              className="w-full py-3 rounded-full bg-[#645244] text-white font-semibold text-sm hover:bg-[#2B1C1C] transition disabled:opacity-60"
            >
              {completing ? "Guardando..." : "Marcar hecha"}
            </button>
          )}

          <button
            type="button"
            onClick={onViewPlant}
            className="w-full py-3 rounded-full border border-[#645244] text-[#645244] font-semibold text-sm hover:bg-[#f5f3ee] transition"
          >
            Ver planta
          </button>

          {!canComplete && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs font-semibold text-primarioBase hover:underline"
            >
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
