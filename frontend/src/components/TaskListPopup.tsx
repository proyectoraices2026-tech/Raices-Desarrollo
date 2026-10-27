import { X } from "lucide-react";
import type { PlantTask } from "../services/PlantTasksService";
import TaskCard from "./TaskCard";

interface TaskListPopupProps {
  isOpen: boolean;
  title: string;
  tasks: PlantTask[];
  getSubtitle: (task: PlantTask) => string;
  onClose: () => void;
  onTaskClick: (task: PlantTask) => void;
}

/* Pop-up de "ver más": lista, hacia abajo y en el mismo formato de tarjeta,
   todas las tareas de esa sección (ya sea "Hoy" o "Próximas"). */
export default function TaskListPopup({
  isOpen,
  title,
  tasks,
  getSubtitle,
  onClose,
  onTaskClick,
}: TaskListPopupProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-list-popup-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm md:max-w-md max-h-[80vh] overflow-y-auto p-5 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          aria-label="Cerrar lista de tareas"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 id="task-list-popup-title" className="text-base font-bold text-[#1e2d24] mb-4 pr-6">
          {title}
        </h2>

        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              subtitle={getSubtitle(task)}
              onClick={() => onTaskClick(task)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
