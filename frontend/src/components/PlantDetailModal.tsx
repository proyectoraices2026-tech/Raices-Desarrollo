import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useAlert } from "../context/AlertContext";
import TaskFrequencyField, { type TaskUnit } from "./TaskFrequencyField";
import { deletePlant, updatePlant, type UpdatePlantInput, type UserPlant } from "../services/UserPlantsService";
import { getCustomTasksForPlant, type PlantTask } from "../services/PlantTasksService";
import { getPlantIconUrl, PLANT_ICONS } from "../constants/plantIcons";
import { CARE_TASK_ICONS, CARE_TASK_LABELS, type CareTaskType } from "../constants/taskIcons";

interface FrequencyState {
    enabled: boolean;
    interval: number | "";
    unit: TaskUnit;
}

interface PlantDetailModalProps {
    plant: UserPlant | null;
    userId: string;
    isOpen: boolean;
    onClose: () => void;
    onChanged: () => void;
}

const emptyFrequency: FrequencyState = { enabled: false, interval: 1, unit: "day" };

const CARE_TYPES: CareTaskType[] = ["watering", "pruning", "fertilizing"];

const inputClass =
    "w-full px-4 py-3 bg-[#f0f0ec] border border-[#dcdcd4] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4E705B] focus:border-transparent text-sm transition";
const labelClass = "block text-xs font-semibold text-[#2D4A3E] mb-1.5";

const unitLabel = (unit: TaskUnit, interval: number) => {
    const plural = interval !== 1;
    if (unit === "day") return plural ? "días" : "día";
    if (unit === "week") return plural ? "semanas" : "semana";
    return plural ? "meses" : "mes";
};

export default function PlantDetailModal({ plant, userId, isOpen, onClose, onChanged }: PlantDetailModalProps) {
    const { showAlert } = useAlert();

    const [mode, setMode] = useState<"view" | "edit">("view");

    const [name, setName] = useState("");
    const [scientificName, setScientificName] = useState("");
    const [watering, setWatering] = useState<FrequencyState>(emptyFrequency);
    const [pruning, setPruning] = useState<FrequencyState>(emptyFrequency);
    const [fertilizing, setFertilizing] = useState<FrequencyState>(emptyFrequency);
    const [selectedIcon, setSelectedIcon] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [customTasks, setCustomTasks] = useState<PlantTask[]>([]);
    const [customTasksLoading, setCustomTasksLoading] = useState(false);

    useEffect(() => {
        if (plant && isOpen) {
            setMode("view");
            setName(plant.name ?? "");
            setScientificName(plant.scientific_name ?? "");
            setWatering({ enabled: plant.watering_enabled, interval: plant.watering_interval ?? 1, unit: plant.watering_unit ?? "day" });
            setPruning({ enabled: plant.pruning_enabled, interval: plant.pruning_interval ?? 1, unit: plant.pruning_unit ?? "month" });
            setFertilizing({ enabled: plant.fertilizer_enabled, interval: plant.fertilizer_interval ?? 1, unit: plant.fertilizer_unit ?? "month" });
            setSelectedIcon(plant.icon !== null && plant.icon !== undefined ? Number(plant.icon) : null);
            setConfirmingDelete(false);
            setError(null);

            setCustomTasksLoading(true);
            getCustomTasksForPlant(userId, plant.id)
                .then(setCustomTasks)
                .catch(() => setCustomTasks([]))
                .finally(() => setCustomTasksLoading(false));
        }
    }, [plant, isOpen, userId]);

    if (!isOpen || !plant) return null;

    const validate = (freq: FrequencyState) => !freq.enabled || (freq.interval !== "" && freq.interval > 0);

    const handleSave = async () => {
        if (!name.trim()) {
            setError("El nombre de la planta es obligatorio.");
            return;
        }

        if (!watering.enabled && !pruning.enabled && !fertilizing.enabled) {
            setError("Marca al menos una tarea de cuidado (regar, podar o abonar).");
            return;
        }

        if (selectedIcon === null) {
            setError("Selecciona un ícono para tu planta.");
            return;
        }

        if (!validate(watering) || !validate(pruning) || !validate(fertilizing)) {
            setError("Completa el intervalo de cada tarea activada.");
            return;
        }

        setSaving(true);
        setError(null);

        const input: UpdatePlantInput = {
            name,
            scientificName,
            iconIndex: selectedIcon,
            watering: { enabled: watering.enabled, interval: watering.enabled ? Number(watering.interval) : null, unit: watering.enabled ? watering.unit : null },
            pruning: { enabled: pruning.enabled, interval: pruning.enabled ? Number(pruning.interval) : null, unit: pruning.enabled ? pruning.unit : null },
            fertilizing: { enabled: fertilizing.enabled, interval: fertilizing.enabled ? Number(fertilizing.interval) : null, unit: fertilizing.enabled ? fertilizing.unit : null },
        };

        try {
            await updatePlant(plant.id, input, userId);
            showAlert({ title: "Planta actualizada", message: "Los cambios se guardaron correctamente.", variant: "success" });
            onChanged();
            onClose();
        } catch {
            showAlert({ title: "Error", message: "No se pudo actualizar la planta.", variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setSaving(true);
        try {
            await deletePlant(plant.id, userId);
            showAlert({ title: "Planta eliminada", message: "La planta se eliminó correctamente.", variant: "success" });
            onChanged();
            onClose();
        } catch {
            showAlert({ title: "Error", message: "No se pudo eliminar la planta.", variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    const iconUrl = getPlantIconUrl(plant.icon);

    const containerClass =
        mode === "edit"
            ? "bg-verdePastel rounded-2xl shadow-xl w-full max-w-sm md:max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-9 relative"
            : "bg-white rounded-2xl w-full max-w-sm p-5 max-h-[90vh] overflow-y-auto relative";

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="plant-detail-title">
            <div className={containerClass}>
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 md:top-6 md:right-6 text-slate-400 hover:text-slate-600"
                    aria-label="Cerrar"
                >
                    <X className="w-5 h-5" />
                </button>

                {mode === "view" ? (
                    <>
                        <div className="flex flex-col items-center text-center mb-4 pr-6">
                            <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center mb-3" aria-hidden="true">
                                {iconUrl && <img src={iconUrl} alt="" className="w-full h-full object-cover" />}
                            </div>
                            <h2 id="plant-detail-title" className="text-lg font-bold text-[#1e2d24]">{plant.name}</h2>
                            {plant.scientific_name && (
                                <p className="text-xs text-[#537a63] italic">{plant.scientific_name}</p>
                            )}
                        </div>

                        <div className="space-y-2 mb-4">
                            {CARE_TYPES.map((type) => {
                                const enabled =
                                    type === "watering" ? plant.watering_enabled : type === "pruning" ? plant.pruning_enabled : plant.fertilizer_enabled;
                                const interval =
                                    type === "watering" ? plant.watering_interval : type === "pruning" ? plant.pruning_interval : plant.fertilizer_interval;
                                const unit =
                                    type === "watering" ? plant.watering_unit : type === "pruning" ? plant.pruning_unit : plant.fertilizer_unit;
                                const meta = CARE_TASK_ICONS[type];

                                return (
                                    <div key={type} className="flex items-center gap-3 border border-[#e8efe4] rounded-xl px-3 py-2.5">
                                        <span className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${meta.boxBg}`}>
                                            <img src={meta.icon} alt="" className="w-4 h-4 object-contain" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-[#1e2d24]">{CARE_TASK_LABELS[type]}</p>
                                            <p className="text-[11px] text-[#537a63]">
                                                {enabled && interval && unit
                                                    ? `Cada ${interval} ${unitLabel(unit, interval)}`
                                                    : "No programada"}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Tareas personalizadas creadas desde el Calendario para esta planta */}
                        <div className="mb-5">
                            <p className="text-xs font-semibold text-[#537a63] mb-1.5">Tareas personalizadas</p>
                            {customTasksLoading ? (
                                <p className="text-[11px] text-primarioBase">Cargando...</p>
                            ) : customTasks.length === 0 ? (
                                <p className="text-[11px] text-[#8a8a82]">No hay tareas personalizadas para esta planta.</p>
                            ) : (
                                <div className="space-y-1.5">
                                    {customTasks.map((task) => (
                                        <div key={task.id} className="flex items-center justify-between text-[11px] bg-[#f5f7f2] border border-[#e8efe4] rounded-lg px-3 py-2">
                                            <span className={`font-semibold text-[#1e2d24] ${task.completed ? "line-through opacity-60" : ""}`}>
                                                {task.label || "Tarea personalizada"}
                                            </span>
                                            <span className="text-[#537a63]">{task.due_date}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setMode("edit")}
                            className="w-full py-3 rounded-full bg-[#645244] text-white font-semibold text-sm hover:bg-[#2B1C1C] transition"
                        >
                            Editar
                        </button>
                    </>
                ) : (
                    <>
                        <h2 className="text-lg md:text-xl font-bold text-[#1e2d24] pr-6">Editar planta</h2>
                        <p className="text-xs md:text-sm text-[#537a63] mb-6 md:mb-8">Actualiza los datos de tu planta</p>

                        {!confirmingDelete ? (
                            <>
                                {error && <p className="text-xs text-red-600 mb-3" role="alert">{error}</p>}

                                <div className="space-y-4 md:space-y-5">
                                    <div>
                                        <label htmlFor="edit-plant-name" className={labelClass}>Nombre</label>
                                        <input id="edit-plant-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                                    </div>
                                    <div>
                                        <label htmlFor="edit-plant-scientific-name" className={labelClass}>Nombre científico (opcional)</label>
                                        <input id="edit-plant-scientific-name" type="text" value={scientificName} onChange={(e) => setScientificName(e.target.value)} className={inputClass} />
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        <TaskFrequencyField
                                            label="Regar"
                                            enabled={watering.enabled}
                                            interval={watering.interval}
                                            unit={watering.unit}
                                            onEnabledChange={(enabled) => setWatering((s) => ({ ...s, enabled }))}
                                            onIntervalChange={(interval) => setWatering((s) => ({ ...s, interval }))}
                                            onUnitChange={(unit) => setWatering((s) => ({ ...s, unit }))}
                                        />
                                        <TaskFrequencyField
                                            label="Podar"
                                            enabled={pruning.enabled}
                                            interval={pruning.interval}
                                            unit={pruning.unit}
                                            onEnabledChange={(enabled) => setPruning((s) => ({ ...s, enabled }))}
                                            onIntervalChange={(interval) => setPruning((s) => ({ ...s, interval }))}
                                            onUnitChange={(unit) => setPruning((s) => ({ ...s, unit }))}
                                        />
                                        <TaskFrequencyField
                                            label="Abonar"
                                            enabled={fertilizing.enabled}
                                            interval={fertilizing.interval}
                                            unit={fertilizing.unit}
                                            onEnabledChange={(enabled) => setFertilizing((s) => ({ ...s, enabled }))}
                                            onIntervalChange={(interval) => setFertilizing((s) => ({ ...s, interval }))}
                                            onUnitChange={(unit) => setFertilizing((s) => ({ ...s, unit }))}
                                        />
                                    </div>

                                    <fieldset>
                                        <legend className={labelClass}>Ícono</legend>
                                        <p className="text-[11px] text-[#8a8a82] -mt-1 mb-3">Elige el ícono que mejor represente a tu planta</p>
                                        <div className="grid grid-cols-5 gap-3 max-w-xs md:max-w-sm">
                                            {PLANT_ICONS.map((icon, i) => {
                                                const selected = selectedIcon === i;
                                                return (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => setSelectedIcon(i)}
                                                        aria-pressed={selected}
                                                        aria-label={`Ícono ${i + 1}${selected ? ", seleccionado" : ""}`}
                                                        className={`aspect-square rounded-full border-2 overflow-hidden transition ${
                                                            selected ? "border-[#645244] ring-2 ring-offset-2 ring-[#645244]" : "border-transparent hover:border-[#c9c4b8]"
                                                        }`}
                                                    >
                                                        <img src={icon} alt="" className="w-full h-full object-cover rounded-full" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </fieldset>
                                </div>

                                <div className="flex justify-between items-center mt-5">
                                    <button onClick={() => setConfirmingDelete(true)} disabled={saving} className="text-sm font-semibold text-red-600 hover:underline">
                                        Eliminar planta
                                    </button>
                                    <div className="flex gap-2">
                                        <button onClick={() => setMode("view")} disabled={saving} className="text-sm font-semibold text-[#537a63] px-4 py-2">
                                            Cancelar
                                        </button>
                                        <button onClick={handleSave} disabled={saving} className="text-sm font-semibold bg-[#645244] text-white rounded-full px-5 py-2 hover:bg-[#2B1C1C] transition disabled:opacity-60">
                                            {saving ? "Guardando..." : "Guardar"}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-[#1e2d24] mb-5">
                                    ¿Seguro que quieres eliminar <strong>{plant.name}</strong>? Esta acción no se puede deshacer desde la app.
                                </p>
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setConfirmingDelete(false)} disabled={saving} className="text-sm font-semibold text-[#537a63] px-4 py-2">
                                        Cancelar
                                    </button>
                                    <button onClick={handleDelete} disabled={saving} className="text-sm font-semibold bg-red-600 text-white rounded-full px-5 py-2 hover:bg-red-700 transition disabled:opacity-60">
                                        {saving ? "Eliminando..." : "Sí, eliminar"}
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}