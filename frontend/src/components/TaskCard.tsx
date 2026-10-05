import { Sparkles } from "lucide-react";
import { CARE_TASK_ICONS, type CareTaskType } from "../constants/taskIcons";
import type { PlantTask } from "../services/PlantTasksService";

interface TaskCardProps {
  task: PlantTask;
  /* Texto de abajo, ya armado afuera (cambia según sea "Hoy" o "Próximas") */
  subtitle: string;
  onClick?: () => void;
}

/* Tarjeta compacta para una tarea: ícono según el tipo, nombre de la planta
   y un subtítulo. Se usa tanto en las secciones "Hoy"/"Próximas" de
   Mis Plantas como dentro del pop-up de "ver más". */
export default function TaskCard({ task, subtitle, onClick }: TaskCardProps) {
  const isCareTask = task.task_type !== "custom";
  const meta = isCareTask ? CARE_TASK_ICONS[task.task_type as CareTaskType] : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 bg-white border border-[#e8efe4] rounded-xl px-3.5 py-3 text-left hover:border-primarioClaro hover:bg-tarjeta/60 transition"
    >
      <span
        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${meta?.boxBg ?? "bg-[#f0f0ec]"}`}
        aria-hidden="true"
      >
        {meta ? (
          <img src={meta.icon} alt="" className="w-4 h-4 object-contain" />
        ) : (
          <Sparkles className="w-4 h-4 text-[#8a7a68]" />
        )}
      </span>
      <span className="min-w-0">
        <p className="text-xs font-bold text-[#1e2d24] truncate">{task.plant_name}</p>
        <p className="text-[11px] text-primarioBase truncate">{subtitle}</p>
      </span>
    </button>
  );
}
