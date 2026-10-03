
import { useEffect, useMemo, useState, useRef } from "react";
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import NavBar from "../components/NavBar";
import BottomNav from "../components/BottomNav";
import SideMenu from "../components/SideMenu";
import ManualTaskModal from "../components/ManualTaskModal";
import { useAuth } from "../context/AuthContext";
import { getPlantTasksForMonth, toggleTaskCompletion, deleteManualTask, type PlantTask } from "../services/PlantTasksService";

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
    const [tasks, setTasks] = useState<PlantTask[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [assignOpen, setAssignOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<PlantTask | null>(null);
    const pendingTaskIdsRef = useRef<Set<string>>(new Set());
    const [pendingTaskIds, setPendingTaskIds] = useState<Set<string>>(new Set());

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

    const days = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
        const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
        return eachDayOfInterval({ start, end });
    }, [currentMonth]);

    const tasksByDay = useMemo(() => {
        const map = new Map<string, PlantTask[]>();
        tasks.forEach((task) => {
            if (!map.has(task.due_date)) map.set(task.due_date, []);
            map.get(task.due_date)!.push(task);
        });
        return map;
    }, [tasks]);

    const selectedDayTasks = selectedDate ? tasksByDay.get(format(selectedDate, "yyyy-MM-dd")) ?? [] : [];

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

    return (
        <div className="min-h-screen bg-white">
            <div className="sticky top-0 z-40">
                <NavBar onMenuClick={() => setMenuOpen(true)} />
                <BottomNav />
            </div>

            <div className="md:max-w-4xl md:mx-auto p-5 md:px-12 md:py-8">
                <div className="flex items-center justify-between mb-5">
                    <button onClick={() => setCurrentMonth((m) => subMonths(m, 1))} className="p-2 rounded-full hover:bg-[#e8efe4]">
                        <ChevronLeft className="w-5 h-5 text-[#1e2d24]" />
                    </button>
                    <h1 className="text-lg font-bold text-[#1e2d24] capitalize">{format(currentMonth, "MMMM yyyy", { locale: es })}</h1>
                    <button onClick={() => setCurrentMonth((m) => addMonths(m, 1))} className="p-2 rounded-full hover:bg-[#e8efe4]">
                        <ChevronRight className="w-5 h-5 text-[#1e2d24]" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-[#537a63] mb-1">
                    {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
                        <span key={d}>{d}</span>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {days.map((day) => {
                        const key = format(day, "yyyy-MM-dd");
                        const dayTasks = tasksByDay.get(key) ?? [];
                        const inMonth = isSameMonth(day, currentMonth);
                        const isToday = isSameDay(day, new Date());

                        return (
                            <button
                                key={key}
                                onClick={() => setSelectedDate(day)}
                                className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-start border text-xs transition ${inMonth ? "bg-white border-[#e8efe4]" : "bg-[#f5f7f2] border-transparent text-[#c8d4c0]"
                                    } ${isToday ? "ring-2 ring-[#645244]" : ""} ${selectedDate && isSameDay(day, selectedDate) ? "ring-2 ring-[#4E705B]" : ""}`}
                            >
                                <span className={`font-semibold ${inMonth ? "text-[#1e2d24]" : ""}`}>{format(day, "d")}</span>
                                <div className="flex flex-wrap gap-0.5 justify-center mt-1">
                                    {dayTasks.slice(0, 4).map((t) => (
                                        <span key={t.id} className={`w-1.5 h-1.5 rounded-full ${TASK_TYPE_COLORS[t.task_type]} ${t.completed ? "opacity-30" : ""}`} />
                                    ))}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {selectedDate && (
                    <div className="mt-5 bg-white rounded-2xl border border-[#e8efe4] p-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-bold text-[#1e2d24] capitalize">{format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}</p>
                            <button onClick={openAddModal} className="flex items-center gap-1 text-xs font-semibold text-white bg-[#645244] hover:bg-[#2B1C1C] rounded-full px-3 py-1.5 transition">
                                <Plus className="w-3.5 h-3.5" /> Agregar
                            </button>
                        </div>

                        {selectedDayTasks.length === 0 ? (
                            <p className="text-xs text-[#537a63]">No hay tareas para este día.</p>
                        ) : (
                            <ul className="space-y-2">
                                {selectedDayTasks.map((task) => (
                                    <li key={task.id} className="flex items-center justify-between gap-2 bg-[#f5f7f2] rounded-xl px-3 py-2">
                                        <label className="flex items-center gap-2 flex-1 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                disabled={pendingTaskIds.has(task.id)}
                                                onChange={() => handleToggleComplete(task)}
                                                className="w-4 h-4"
                                            />
                                            <span className={`text-xs ${task.completed ? "line-through text-[#a3b3a3]" : "text-[#1e2d24]"}`}>
                                                <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${TASK_TYPE_COLORS[task.task_type]}`} />
                                                {task.task_type === "custom" ? task.label : TASK_TYPE_LABELS[task.task_type]}
                                                {" — "}
                                                <span className="text-[#537a63]">{task.plant_name}</span>
                                            </span>
                                        </label>
                                        {!task.is_automatic && (
                                            <div className="flex gap-2 flex-shrink-0">
                                                <button onClick={() => openEditModal(task)} className="text-[10px] text-[#537a63] font-semibold hover:underline">Editar</button>
                                                <button onClick={() => handleDeleteManual(task)} className="text-[10px] text-red-500 font-semibold hover:underline">Eliminar</button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {loading && <p className="text-xs text-[#537a63] text-center mt-4">Cargando calendario...</p>}
            </div>

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