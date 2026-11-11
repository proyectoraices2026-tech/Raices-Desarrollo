// src/components/ManualTaskModal.tsx

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { createManualTask, updateManualTask, type ManualTaskInput, type PlantTask } from "../services/PlantTasksService";
import { getUserPlants, type UserPlant } from "../services/UserPlantsService";

interface ManualTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    defaultDate: Date | null;
    onTaskAdded: () => void;
    editingTask?: PlantTask | null;
}

const TASK_TYPES: { value: ManualTaskInput["taskType"]; label: string }[] = [
    { value: "watering", label: "Regar" },
    { value: "pruning", label: "Podar" },
    { value: "fertilizing", label: "Abonar" },
    { value: "custom", label: "Personalizada" },
];

export default function ManualTaskModal({ isOpen, onClose, userId, defaultDate, onTaskAdded, editingTask }: ManualTaskModalProps) {
    const [plants, setPlants] = useState<UserPlant[]>([]);
    const [plantId, setPlantId] = useState("");
    const [taskType, setTaskType] = useState<ManualTaskInput["taskType"]>("watering");
    const [label, setLabel] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen || !userId) return;
        getUserPlants(userId).then(setPlants).catch(() => setPlants([]));
    }, [isOpen, userId]);

    useEffect(() => {
        if (!isOpen) return;
        if (editingTask) {
            setPlantId(editingTask.plant_id);
            setTaskType(editingTask.task_type as ManualTaskInput["taskType"]);
            setLabel(editingTask.label ?? "");
        } else {
            setPlantId("");
            setTaskType("watering");
            setLabel("");
        }
        setError(null);
    }, [isOpen, editingTask]);

    if (!isOpen) return null;

    const dueDate = editingTask ? editingTask.due_date : defaultDate ? format(defaultDate, "yyyy-MM-dd") : "";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!plantId || !dueDate) {
            setError("Selecciona una planta.");
            return;
        }
        if (taskType === "custom" && !label.trim()) {
            setError("Escribe una descripción para la tarea personalizada.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const input: ManualTaskInput = {
                plantId,
                taskType,
                label: taskType === "custom" ? label.trim() : null,
                dueDate,
            };

            if (editingTask) {
                await updateManualTask(editingTask.id, input, userId);
            } else {
                await createManualTask(input, userId);
            }

            onTaskAdded();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "No se pudo guardar la tarea.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-5 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-lg font-bold text-[#1e2d24] mb-1">{editingTask ? "Editar tarea" : "Agregar tarea"}</h2>
                {defaultDate && !editingTask && (
                    <p className="text-xs text-[#537a63] mb-4 capitalize">{format(defaultDate, "EEEE d 'de' MMMM", { locale: es })}</p>
                )}

                {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="text-xs font-semibold text-[#537a63] block mb-1">Planta</label>
                        <select value={plantId} onChange={(e) => setPlantId(e.target.value)} className="w-full border border-[#e8efe4] rounded-lg px-3 py-2 text-sm">
                            <option value="">Selecciona una planta</option>
                            {plants.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-[#537a63] block mb-1">Tipo de tarea</label>
                        <select value={taskType} onChange={(e) => setTaskType(e.target.value as ManualTaskInput["taskType"])} className="w-full border border-[#e8efe4] rounded-lg px-3 py-2 text-sm">
                            {TASK_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>

                    {taskType === "custom" && (
                        <div>
                            <label className="text-xs font-semibold text-[#537a63] block mb-1">Descripción</label>
                            <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Ej. Revisar plagas" className="w-full border border-[#e8efe4] rounded-lg px-3 py-2 text-sm" />
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={onClose} className="text-sm font-semibold text-[#537a63] px-4 py-2">Cancelar</button>
                        <button type="submit" disabled={loading} className="text-sm font-semibold bg-[#645244] text-white rounded-full px-5 py-2 hover:bg-[#2B1C1C] transition disabled:opacity-60">
                            {loading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}