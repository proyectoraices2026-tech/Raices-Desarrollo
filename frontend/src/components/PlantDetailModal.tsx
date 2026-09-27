// src/components/PlantDetailModal.tsx

import { useEffect, useState } from "react";
import { useAlert } from "../context/AlertContext";
import TaskFrequencyField, { type TaskUnit } from "./TaskFrequencyField";
import { deletePlant, updatePlant, type UpdatePlantInput, type UserPlant } from "../services/UserPlantsService";

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

export default function PlantDetailModal({ plant, userId, isOpen, onClose, onChanged }: PlantDetailModalProps) {
    const { showAlert } = useAlert();
    const [name, setName] = useState("");
    const [scientificName, setScientificName] = useState("");
    const [watering, setWatering] = useState<FrequencyState>(emptyFrequency);
    const [pruning, setPruning] = useState<FrequencyState>(emptyFrequency);
    const [fertilizing, setFertilizing] = useState<FrequencyState>(emptyFrequency);
    const [saving, setSaving] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (plant && isOpen) {
            setName(plant.name ?? "");
            setScientificName(plant.scientific_name ?? "");
            setWatering({ enabled: plant.watering_enabled, interval: plant.watering_interval ?? 1, unit: plant.watering_unit ?? "day" });
            setPruning({ enabled: plant.pruning_enabled, interval: plant.pruning_interval ?? 1, unit: plant.pruning_unit ?? "month" });
            setFertilizing({ enabled: plant.fertilizer_enabled, interval: plant.fertilizer_interval ?? 1, unit: plant.fertilizer_unit ?? "month" });
            setConfirmingDelete(false);
            setError(null);
        }
    }, [plant, isOpen]);

    if (!isOpen || !plant) return null;

    const validate = (freq: FrequencyState) => !freq.enabled || (freq.interval !== "" && freq.interval > 0);

    const handleSave = async () => {
        if (!validate(watering) || !validate(pruning) || !validate(fertilizing)) {
            setError("Completa el intervalo de cada tarea activada.");
            return;
        }

        setSaving(true);
        setError(null);

        const input: UpdatePlantInput = {
            name,
            scientificName,
            iconIndex: plant.icon !== null ? Number(plant.icon) : null,
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

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-5 max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-bold text-[#1e2d24] mb-4">Editar planta</h2>

                {!confirmingDelete ? (
                    <>
                        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-[#537a63]">Nombre</label>
                                <input className="w-full border border-[#e8efe4] rounded-lg px-3 py-2 text-sm" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-[#537a63]">Nombre científico</label>
                                <input className="w-full border border-[#e8efe4] rounded-lg px-3 py-2 text-sm" value={scientificName} onChange={(e) => setScientificName(e.target.value)} />
                            </div>

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

                        <div className="flex justify-between items-center mt-5">
                            <button onClick={() => setConfirmingDelete(true)} disabled={saving} className="text-sm font-semibold text-red-600 hover:underline">
                                Eliminar planta
                            </button>
                            <div className="flex gap-2">
                                <button onClick={onClose} disabled={saving} className="text-sm font-semibold text-[#537a63] px-4 py-2">
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
            </div>
        </div>
    );
}