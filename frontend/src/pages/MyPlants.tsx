import BottomNav from "../components/BottomNav";
import NavBar from "../components/NavBar";
import RegisterPlantModal from "../components/RegisterPlantModal";
import { useNavigate } from "react-router-dom";

import { useEffect, useMemo, useState } from "react";
import { addDays, format, isTomorrow } from "date-fns";
import { es } from "date-fns/locale";
import SideMenu from "../components/SideMenu";
import { useAuth } from "../context/AuthContext";
import { getUserPlants, type UserPlant } from "../services/UserPlantsService";
import { getPlantTasksInRange, toggleTaskCompletion, type PlantTask } from "../services/PlantTasksService";

import PlantDetailModal from "../components/PlantDetailModal";
import TaskActionPopup from "../components/TaskActionPopup";
import TaskCard from "../components/TaskCard";
import TaskListPopup from "../components/TaskListPopup";
import { getPlantIconUrl } from "../constants/plantIcons";
import { CARE_TASK_ICONS, CARE_TASK_LABELS, type CareTaskType } from "../constants/taskIcons";

const CARE_TYPES: CareTaskType[] = ["watering", "pruning", "fertilizing"];

/* Cota inferior amplia para incluir tareas atrasadas (vencidas antes de hoy) dentro
   de la sección "Hoy", en vez de solo las que vencen exactamente hoy. */
const FAR_PAST_DATE = "2000-01-01";

export default function MyPlants() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const { user, role } = useAuth();

  const [plants, setPlants] = useState<UserPlant[]>([]);
  const [loading, setLoading] = useState(true);

  const [tasks, setTasks] = useState<PlantTask[]>([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  const [selectedPlant, setSelectedPlant] = useState<UserPlant | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [hoyPopupOpen, setHoyPopupOpen] = useState(false);
  const [proximasPopupOpen, setProximasPopupOpen] = useState(false);

  /* Pop-up de acción de una sola tarea (se abre al tocar cualquier tarjeta de tarea) */
  const [actionTask, setActionTask] = useState<PlantTask | null>(null);
  const [actionPopupOpen, setActionPopupOpen] = useState(false);
  const [actionSubtitle, setActionSubtitle] = useState("");
  const [completingTask, setCompletingTask] = useState(false);

  const navigate = useNavigate();

  /* "Hoy" y "en una semana" se calculan una sola vez al montar la página */
  const todayStr = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const weekAheadStr = useMemo(() => format(addDays(new Date(), 7), "yyyy-MM-dd"), []);

  const loadPlants = () => {
    if (!user) return;
    setLoading(true);
    getUserPlants(user.id)
      .then(setPlants)
      .catch(() => setPlants([]))
      .finally(() => setLoading(false));
  };

  const loadTasks = () => {
    if (!user) return;
    setTasksLoading(true);
    getPlantTasksInRange(user.id, FAR_PAST_DATE, weekAheadStr)
      .then(setTasks)
      .catch(() => setTasks([]))
      .finally(() => setTasksLoading(false));
  };

  useEffect(() => {
    loadPlants();
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const plantsById = useMemo(() => new Map(plants.map((p) => [p.id, p])), [plants]);

  /* "Hoy" incluye las tareas que vencen hoy Y las atrasadas (vencidas antes de hoy) */
  const todayTasks = useMemo(
    () => tasks.filter((t) => t.due_date <= todayStr && !t.completed),
    [tasks, todayStr]
  );

  /* Tareas de los próximos 7 días (sin incluir hoy ni atrasadas), sin las ya completadas, ordenadas por fecha */
  const upcomingTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.due_date > todayStr && t.due_date <= weekAheadStr && !t.completed)
        .sort((a, b) => a.due_date.localeCompare(b.due_date)),
    [tasks, todayStr, weekAheadStr]
  );

  const careVerb = (task: PlantTask) =>
    task.task_type === "custom" ? task.label || "Tarea" : CARE_TASK_LABELS[task.task_type as CareTaskType];

  const hoySubtitle = (task: PlantTask) => (task.due_date < todayStr ? `${careVerb(task)} — atrasada` : `${careVerb(task)} hoy`);

  const proximaSubtitle = (task: PlantTask) => {
    const date = new Date(`${task.due_date}T00:00:00`);
    const when = isTomorrow(date) ? "Mañana" : format(date, "dd 'de' MMMM", { locale: es });
    return `${careVerb(task)} · ${when}`;
  };

  /* Si la planta tiene esa tarea de cuidado habilitada (el ícono solo aparece
     cuando corresponde; si la planta no tiene esa tarea programada, no se muestra) */
  const isCareEnabled = (plant: UserPlant, type: CareTaskType) =>
    type === "watering" ? plant.watering_enabled : type === "pruning" ? plant.pruning_enabled : plant.fertilizer_enabled;

  /* Abre el pop-up de acción de una tarea (desde una tarjeta o desde el "ver más") */
  const openTaskAction = (task: PlantTask, subtitle: string) => {
    setActionTask(task);
    setActionSubtitle(subtitle);
    setActionPopupOpen(true);
    setHoyPopupOpen(false);
    setProximasPopupOpen(false);
  };

  const closeTaskAction = () => {
    setActionPopupOpen(false);
    setActionTask(null);
  };

  const handleMarkDone = async () => {
    if (!actionTask || !user) return;
    setCompletingTask(true);
    try {
      await toggleTaskCompletion(actionTask.id, user.id, true);
      closeTaskAction();
      loadTasks();
    } catch {
      // Silencioso: si falla, la tarea simplemente sigue apareciendo como pendiente
    } finally {
      setCompletingTask(false);
    }
  };

  const openPlantFromAction = () => {
    if (!actionTask) return;
    const plant = plantsById.get(actionTask.plant_id);
    closeTaskAction();
    if (!plant) return;
    setSelectedPlant(plant);
    setDetailOpen(true);
  };

  const sections = [
    {
      key: "hoy",
      title: "Hoy",
      tasks: todayTasks,
      emptyMessage: "No tienes tareas pendientes para hoy.",
      subtitle: hoySubtitle,
      popupOpen: hoyPopupOpen,
      setPopupOpen: setHoyPopupOpen,
      popupTitle: "Tareas de hoy",
    },
    {
      key: "proximas",
      title: "Actividades próximas",
      tasks: upcomingTasks,
      emptyMessage: "No tienes actividades próximas esta semana.",
      subtitle: proximaSubtitle,
      popupOpen: proximasPopupOpen,
      setPopupOpen: setProximasPopupOpen,
      popupTitle: "Actividades próximas",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-white pb-28">
      <div className="sticky top-0 z-40">
        <NavBar onMenuClick={() => setMenuOpen(true)} />
        <BottomNav />
      </div>

      <div className="md:max-w-5xl md:mx-auto">
        {/* Solo visible para administradores: revisar y aprobar/rechazar pedidos */}
        {role === "admin" && (
          <button
            onClick={() => navigate("/admin")}
            className="text-left px-3 py-3 rounded-xl hover:bg-primarioClaro text-[#1e2d24] text-sm font-medium bg-primarioOscuro text-white mt-8 m-4"
          >
            Volver al Dashboard de admin
          </button>
        )}
        <div className="p-5 md:px-12 md:py-8">
          {/* Secciones "Hoy" y "Actividades próximas", con datos reales */}
          {sections.map((section) => (
            <div key={section.key} className="mb-6">
              <h2 className="text-lg font-bold text-textoSecundario mb-3">{section.title}</h2>

              {tasksLoading ? (
                <p className="text-xs text-primarioBase">Cargando...</p>
              ) : section.tasks.length === 0 ? (
                <div className="bg-white border border-dashed border-[#c8dcc2] rounded-xl px-4 py-5 text-center">
                  <p className="text-xs text-primarioBase">{section.emptyMessage}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {section.tasks.slice(0, 3).map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      subtitle={section.subtitle(task)}
                      onClick={() => openTaskAction(task, section.subtitle(task))}
                    />
                  ))}
                  {section.tasks.length > 3 && (
                    <button
                      type="button"
                      onClick={() => section.setPopupOpen(true)}
                      className="w-full flex items-center justify-center gap-1.5 bg-tarjeta border border-dashed border-primarioClaro rounded-xl px-3.5 py-3 text-xs font-semibold text-primarioBase hover:bg-verdePastel transition"
                    >
                      Ver más ({section.tasks.length - 3})
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Plantas del usuario, o el estado vacío si aún no tiene ninguna */}
        <div className="px-5 md:px-12 pb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-primarioBase">Mis plantas</h2>
            <button
              onClick={() => setRegisterOpen(true)}
              className="flex items-center gap-1.5 bg-[#645244] text-white text-xs font-semibold rounded-full px-4 py-2.5 hover:bg-[#2B1C1C] transition flex-shrink-0"
            >
              <span className="text-base leading-none" aria-hidden="true">+</span>
              Añadir planta
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-[#537a63] text-center py-8">Cargando tus plantas...</p>
          ) : plants.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-[#c8dcc2] flex flex-col items-center justify-center gap-2 py-12 px-6 text-center">
              <p className="text-sm font-semibold text-[#1e2d24]">Todavía no tienes plantas registradas</p>
              <p className="text-xs text-[#537a63] max-w-xs">
                Registra tu primera planta para empezar a llevar su seguimiento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:max-w-3xl md:mx-auto">
              {plants.map((plant) => (
                <div
                  key={plant.id}
                  onClick={() => {
                    setSelectedPlant(plant);
                    setDetailOpen(true);
                  }}
                  className="bg-white rounded-2xl border border-[#e8efe4] flex items-center gap-4 p-4 cursor-pointer hover:border-[#c8dcc2] transition"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0">
                    {getPlantIconUrl(plant.icon) && (
                      <img src={getPlantIconUrl(plant.icon)!} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1e2d24] truncate">{plant.name}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    {CARE_TYPES.filter((type) => isCareEnabled(plant, type)).map((type) => {
                      /* "Pendiente" = esta planta tiene una tarea de este tipo para hoy (o atrasada) */
                      const dueToday = todayTasks.some((t) => t.plant_id === plant.id && t.task_type === type);
                      const meta = CARE_TASK_ICONS[type];
                      return (
                        <span
                          key={type}
                          title={`${CARE_TASK_LABELS[type]}${dueToday ? " — pendiente" : ""}`}
                          className={`w-9 h-9 rounded-full flex items-center justify-center ${
                            dueToday ? meta.boxBg : "bg-[#f0f0ec]"
                          }`}
                        >
                          <img
                            src={dueToday ? meta.active : meta.icon}
                            alt=""
                            className="w-4 h-4 object-contain"
                          />
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        <RegisterPlantModal
          isOpen={registerOpen}
          onClose={() => setRegisterOpen(false)}
          onPlantAdded={() => {
            loadPlants();
            loadTasks();
          }}
        />

        <PlantDetailModal
          plant={selectedPlant}
          userId={user?.id ?? ""}
          isOpen={detailOpen}
          onClose={() => setDetailOpen(false)}
          onChanged={() => {
            loadPlants();
            loadTasks();
          }}
        />

        <TaskActionPopup
          isOpen={actionPopupOpen}
          task={actionTask}
          subtitle={actionSubtitle}
          canComplete={!!actionTask && actionTask.due_date <= todayStr}
          completing={completingTask}
          onClose={closeTaskAction}
          onMarkDone={handleMarkDone}
          onViewPlant={openPlantFromAction}
        />

        <TaskListPopup
          isOpen={hoyPopupOpen}
          title="Tareas de hoy"
          tasks={todayTasks}
          getSubtitle={hoySubtitle}
          onClose={() => setHoyPopupOpen(false)}
          onTaskClick={(task) => openTaskAction(task, hoySubtitle(task))}
        />
        <TaskListPopup
          isOpen={proximasPopupOpen}
          title="Actividades próximas"
          tasks={upcomingTasks}
          getSubtitle={proximaSubtitle}
          onClose={() => setProximasPopupOpen(false)}
          onTaskClick={(task) => openTaskAction(task, proximaSubtitle(task))}
        />
      </div>
    </div>
  );
}

