import { useEffect, useMemo, useState, useRef } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus, CheckCircle, Trash2, Edit3 } from "lucide-react";
import NavBar from "../components/NavBar";
import BottomNav from "../components/BottomNav";
import SideMenu from "../components/SideMenu";
import ManualTaskModal from "../components/ManualTaskModal";
import { useAuth } from "../context/AuthContext";
import {
  getPlantTasksForMonth,
  toggleTaskCompletion,
  deleteManualTask,
  type PlantTask,
} from "../services/PlantTasksService";
import { getUserPlants, type UserPlant } from "../services/UserPlantsService";
import { getPlantIconUrl } from "../constants/plantIcons";

const TASK_TYPE_LABELS: Record<string, string> = {
  watering: "Regar",
  pruning: "Podar",
  fertilizing: "Abonar",
  custom: "Personalizada",
};

const TASK_TYPE_COLORS: Record<string, string> = {
  watering: "bg-[#7FA8C9]",
  pruning: "bg-[#8FAF7B]",
  fertilizing: "bg-[#C9A272]",
  custom: "bg-[#B49BC9]",
};

export default function Calendar() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Estados de datos
  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<PlantTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de selección y modales
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTask, setSelectedTask] = useState<PlantTask | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<PlantTask | null>(null);

  const pendingTaskIdsRef = useRef<Set<string>>(new Set());
  const [pendingTaskIds, setPendingTaskIds] = useState<Set<string>>(new Set());

  // Cargar plantas del usuario
  useEffect(() => {
    if (!user) return;
    getUserPlants(user.id)
      .then(setPlants)
      .catch(() => setPlants([]));
  }, [user]);

  // Cargar tareas del mes
  const loadTasks = () => {
    if (!user) return;
    setLoading(true);
    getPlantTasksForMonth(user.id, currentMonth)
      .then(setTasks)
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentMonth]);

  // Filtrar tareas por planta seleccionada (si hay alguna seleccionada)
  const filteredTasks = useMemo(() => {
    if (!selectedPlantId) return tasks;
    return tasks.filter((t) => t.plant_id === selectedPlantId);
  }, [tasks, selectedPlantId]);

  // Agrupar tareas por día
  const tasksByDay = useMemo(() => {
    const map = new Map<string, PlantTask[]>();
    filteredTasks.forEach((task) => {
      if (!map.has(task.due_date)) map.set(task.due_date, []);
      map.get(task.due_date)!.push(task);
    });
    return map;
  }, [filteredTasks]);

  // Días del calendario
  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  // Cambi para tareas para el día seleccionado
  const selectedDayTasks = useMemo(() => {
    const key = format(selectedDate, "yyyy-MM-dd");
    return tasksByDay.get(key) ?? [];
  }, [selectedDate, tasksByDay]);

  // Auto-seleccionar la primera tarea del día si cambia el día o las tareas
  useEffect(() => {
    if (selectedDayTasks.length > 0) {
      if (!selectedTask || !selectedDayTasks.some((t) => t.id === selectedTask.id)) {
        setSelectedTask(selectedDayTasks[0]);
      }
    } else {
      setSelectedTask(null);
    }
  }, [selectedDayTasks, selectedTask]);

  const handleToggleComplete = async (task: PlantTask) => {
    if (!user) return;
    if (pendingTaskIdsRef.current.has(task.id)) return;

    pendingTaskIdsRef.current.add(task.id);
    setPendingTaskIds(new Set(pendingTaskIdsRef.current));

    try {
      await toggleTaskCompletion(task.id, user.id, !task.completed);
      await loadTasks();
    } finally {
      pendingTaskIdsRef.current.delete(task.id);
      setPendingTaskIds(new Set(pendingTaskIdsRef.current));
    }
  };

  const handleDeleteManual = async (task: PlantTask) => {
    if (!user) return;
    await deleteManualTask(task.id, user.id);
    if (selectedTask?.id === task.id) setSelectedTask(null);
    loadTasks();
  };

  const openAddModal = () => {
    setEditingTask(null);
    setAssignOpen(true);
  };

  const openEditModal = (task: PlantTask) => {
    setEditingTask(task);
    setAssignOpen(true);
  };

  const selectedPlantObj = plants.find((p) => p.id === selectedPlantId);

  return (
    <div className="min-h-screen bg-[#ffffff] pb-28">
      <div className="sticky top-0 z-40">
        <NavBar onMenuClick={() => setMenuOpen(true)} />
        <BottomNav />
      </div>

      <main className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
          
        
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-[#e2eae1]">
              <h2 className="text-base font-bold text-[#1e2d24] mb-1">Mis plantas</h2>
              <p className="text-xs text-[#537a63] mb-4">
                Selecciona una planta para ver sus fechas y tareas pendientes.
              </p>

              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                
                <button
                  onClick={() => setSelectedPlantId(null)}
                  className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                    selectedPlantId === null
                      ? "bg-[#e2efe0] border-[#8faf7b] text-[#1e2d24] font-semibold"
                      : "bg-white border-[#e8efe4] hover:bg-[#f8faf7] text-[#33463a]"
                  }`}
                >
                  <span className="text-xs">Todas las plantas</span>
                  <span className="text-[10px] bg-[#d3e4cf] text-[#2b4232] px-2 py-0.5 rounded-full font-medium">
                    {plants.length}
                  </span>
                </button>

                {plants.map((plant) => {
                  const isSelected = selectedPlantId === plant.id;
                  const plantTaskCount = tasks.filter((t) => t.plant_id === plant.id && !t.completed).length;

                  return (
                    <button
                      key={plant.id}
                      onClick={() => setSelectedPlantId(plant.id)}
                      className={`w-full text-left p-3 rounded-xl border transition flex items-center gap-3 ${
                        isSelected
                          ? "bg-[#e2efe0] border-[#8faf7b] text-[#1e2d24]"
                          : "bg-white border-[#e8efe4] hover:bg-[#f8faf7] text-[#33463a]"
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                        {getPlantIconUrl(plant.icon) ? (
                          <img src={getPlantIconUrl(plant.icon)!} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{plant.name}</p>
                        <p className="text-[10px] text-[#537a63]">
                          {plantTaskCount} tareas pendientes
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

         
          <div className="lg:col-span-6 space-y-6">
            {/* Calendario Mensual */}
            <div className="bg-white rounded-2xl p-5 border border-[#e2eae1]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-base font-bold text-[#1e2d24] capitalize">
                    {format(currentMonth, "MMMM yyyy", { locale: es })}
                  </h1>
                  <p className="text-xs text-[#537a63]">
                    Calendario mensual {selectedPlantObj ? `filtrado por ${selectedPlantObj.name}` : "general"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
                    className="p-1.5 rounded-lg hover:bg-[#e8efe4] text-[#1e2d24]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
                    className="p-1.5 rounded-lg hover:bg-[#e8efe4] text-[#1e2d24]"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-[#537a63] mb-2">
                {["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>

              {/* Grid de Días */}
              <div className="grid grid-cols-7 gap-1.5">
                {days.map((day) => {
                  const key = format(day, "yyyy-MM-dd");
                  const dayTasks = tasksByDay.get(key) ?? [];
                  const inMonth = isSameMonth(day, currentMonth);
                  const isToday = isSameDay(day, new Date());
                  const isSelected = isSameDay(day, selectedDate);

                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedDate(day)}
                      className={`h-11 rounded-xl p-1 flex flex-col items-center justify-between border text-xs transition relative ${
                        inMonth
                          ? "bg-white border-[#e8efe4] text-[#1e2d24]"
                          : "bg-[#f8faf7] border-transparent text-[#c8d4c0]"
                      } ${isToday ? "border-[#4E705B] font-bold" : ""} ${
                        isSelected ? "ring-2 ring-[#4E705B] bg-[#f0f6ef]" : ""
                      }`}
                    >
                      <span className="text-[11px] leading-tight">{format(day, "d")}</span>
                      <div className="flex gap-0.5 justify-center w-full pb-0.5">
                        {dayTasks.slice(0, 3).map((t) => (
                          <span
                            key={t.id}
                            className={`w-1.5 h-1.5 rounded-full ${
                              TASK_TYPE_COLORS[t.task_type] || "bg-gray-400"
                            } ${t.completed ? "opacity-30" : ""}`}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          
            <div className="bg-white rounded-2xl p-5 border border-[#e2eae1]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-[#1e2d24]">Tareas pendientes</h2>
                  <p className="text-xs text-[#537a63] capitalize">
                    {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
                  </p>
                </div>
                <button
                  onClick={openAddModal}
                  className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#5e7765] hover:bg-[#4a6151] rounded-full px-3.5 py-2 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar tarea
                </button>
              </div>

              {loading ? (
                <p className="text-xs text-[#537a63] text-center py-4">Cargando tareas...</p>
              ) : selectedDayTasks.length === 0 ? (
                <p className="text-xs text-[#537a63] py-4 text-center">No hay tareas para este día.</p>
              ) : (
                <div className="space-y-2.5">
                  {selectedDayTasks.map((task) => {
                    const isTaskSelected = selectedTask?.id === task.id;
                    const label =
                      task.task_type === "custom"
                        ? task.label
                        : TASK_TYPE_LABELS[task.task_type] || "Tarea";

                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          isTaskSelected
                            ? "bg-[#f2f7f1] border-[#7ba278]"
                            : "bg-[#f9faf8] border-[#e8efe4] hover:bg-[#f0f4ef]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                              TASK_TYPE_COLORS[task.task_type] || "bg-gray-400"
                            }`}
                          />
                          <div>
                            <p
                              className={`text-xs font-bold ${
                                task.completed ? "line-through text-gray-400" : "text-[#1e2d24]"
                              }`}
                            >
                              {label}
                            </p>
                            <p className="text-[10px] text-[#537a63]">{task.plant_name}</p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleComplete(task);
                          }}
                          disabled={pendingTaskIds.has(task.id)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition ${
                            task.completed
                              ? "bg-gray-100 text-gray-500 border-gray-200"
                              : "bg-white text-[#2b4232] border-[#c2d8be] hover:bg-[#e2efe0]"
                          }`}
                        >
                          {task.completed ? "Hecha" : "✓ Marcar hecha"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-5 border border-[#e2eae1] sticky top-20">
              <h2 className="text-base font-bold text-[#1e2d24] mb-1">Detalle de tarea</h2>

              {selectedTask ? (
                <div>
                  <p className="text-xs text-[#537a63] mb-4">
                    Tarea seleccionada:{" "}
                    <span className="font-medium text-[#1e2d24]">
                      {selectedTask.task_type === "custom"
                        ? selectedTask.label
                        : TASK_TYPE_LABELS[selectedTask.task_type]}
                    </span>
                  </p>

                  <div className="bg-[#f8faf7] rounded-xl p-4 border border-[#e8efe4] space-y-3 mb-5">
                    <div>
                      <h3 className="text-sm font-bold text-[#1e2d24]">
                        {selectedTask.task_type === "custom"
                          ? selectedTask.label
                          : TASK_TYPE_LABELS[selectedTask.task_type]}
                      </h3>
                      <p className="text-[11px] text-[#537a63]">
                        {selectedTask.plant_name} · {format(selectedDate, "dd 'de' MMMM", { locale: es })}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e8efe4] text-xs">
                      <div>
                        <span className="text-[10px] text-[#6d8c78] block font-semibold">Planta</span>
                        <span className="font-bold text-[#1e2d24]">{selectedTask.plant_name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#6d8c78] block font-semibold">Fecha</span>
                        <span className="font-bold text-[#1e2d24]">
                          {format(selectedDate, "dd 'de' MMMM", { locale: es })}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#6d8c78] block font-semibold">Estado</span>
                        <span
                          className={`font-bold ${
                            selectedTask.completed ? "text-green-600" : "text-[#c28438]"
                          }`}
                        >
                          {selectedTask.completed ? "Completado" : "Pendiente"}
                        </span>
                      </div>
                    </div>

                    {selectedTask.notes && (
                      <div className="pt-2 border-t border-[#e8efe4]">
                        <span className="text-[10px] text-[#6d8c78] block font-semibold">Notas</span>
                        <p className="text-xs text-[#33463a] mt-0.5">{selectedTask.notes}</p>
                      </div>
                    )}
                  </div>

                 
                  <div className="space-y-2">
                    <button
                      onClick={() => handleToggleComplete(selectedTask)}
                      disabled={pendingTaskIds.has(selectedTask.id)}
                      className="w-full py-2.5 rounded-xl bg-[#5e7765] hover:bg-[#4a6151] text-white font-semibold text-xs transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      {selectedTask.completed ? "Marcar como pendiente" : "Marcar hecha"}
                    </button>

                    {!selectedTask.is_automatic && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => openEditModal(selectedTask)}
                          className="py-2 rounded-xl bg-white border border-[#c2d8be] text-[#2b4232] hover:bg-[#f0f4ef] font-semibold text-xs transition flex items-center justify-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Editar
                        </button>
                        <button
                          onClick={() => handleDeleteManual(selectedTask)}
                          className="py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-xs transition flex items-center justify-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#537a63] py-8 text-center">
                  Selecciona una tarea para ver su detalle y opciones.
                </p>
              )}
            </div>
          </div>

        </div>
      </main>

      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <ManualTaskModal
        isOpen={assignOpen}
        onClose={() => setAssignOpen(false)}
        userId={user?.id ?? ""}
        defaultDate={selectedDate}
        editingTask={editingTask}
        onTaskAdded={loadTasks}
      />
    </div>
  );
}