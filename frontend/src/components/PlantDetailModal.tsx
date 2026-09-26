// src/components/PlantDetailModal.tsx

import { useEffect, useState } from "react";
import { useAlert } from "../context/AlertContext";
import {
    deletePlant,
    updatePlant,
    type UpdatePlantInput,
    type UserPlant,
} from "../services/UserPlantsService";

interface PlantDetailModalProps {
    plant: UserPlant | null;
    userId: string;
    isOpen: boolean;
    onClose: () => void;
    onChanged: () => void; 
}

export default function PlantDetailModal({
    plant,
    userId,
    isOpen,
    onClose,
    onChanged,
}: PlantDetailModalProps) {
    const { showAlert } = useAlert();
    const [form, setForm] = useState<UpdatePlantInput>({
        name: "",
        scientificName: "",
        wateringFrequency: "",
        pruningFrequency: "",
        fertilizingFrequency: "",
        iconIndex: null,
    });
    const [saving, setSaving] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    useEffect(() => {
        if (plant) {
            setForm({
                name: plant.name ?? "",
                scientificName: plant.scientific_name ?? "",
                wateringFrequency: plant.watering_frequency ?? "",
                pruningFrequency: plant.pruning_frequency ?? "",
                fertilizingFrequency: plant.fertilizer_frequency ?? "",
                iconIndex: plant.icon !== null ? Number(plant.icon) : null,
            });
            setConfirmingDelete(false);
        }
    }, [plant, isOpen]);

    if (!isOpen || !plant) return null;

    const handleChange = (field: keyof UpdatePlantInput, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updatePlant(plant.id, form, userId);
            showAlert({ title: "Planta actualizada", message: "Los cambios se guardaron correctamente.", variant: "success" });
            onChanged();
            onClose();
        } catch (err) {
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
        } catch (err) {
            showAlert({ title: "Error", message: "No se pudo eliminar la planta.", variant: "error" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-5">
                <h2 className="text-lg font-bold text-[#1e2d24] mb-4">Editar planta</h2>

                {!confirmingDelete ? (
                    <>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-semibold text-[#537a63]">Nombre</label>
                                <input
                                    className="w-full border border-[#e8efe4] rounded-lg px-3 py-2 text-sm"
                                    value={form.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-[#537a63]">Nombre científico</label>
                                <input
                                    className="w-full border border-[#e8efe4] rounded-lg px-3 py-2 text-sm"
                                    value={form.scientificName}
                                    onChange={(e) => handleChange("scientificName", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-[#537a63]">Frecuencia de riego</label>
                                <input
                                    className="w-full border border-[#e8efe4] rounded-lg px-3 py-2 text-sm"
                                    value={form.wateringFrequency}
                                    onChange={(e) => handleChange("wateringFrequency", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-[#537a63]">Frecuencia de poda</label>
                                <input
                                    className="w-full border border-[#e8efe4] rounded-lg px-3 py-2 text-sm"
                                    value={form.pruningFrequency}
                                    onChange={(e) => handleChange("pruningFrequency", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-[#537a63]">Frecuencia de abono</label>
                                <input
                                    className="w-full border border-[#e8efe4] rounded-lg px-3 py-2 text-sm"
                                    value={form.fertilizingFrequency}
                                    onChange={(e) => handleChange("fertilizingFrequency", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-5">
                            <button
                                onClick={() => setConfirmingDelete(true)}
                                disabled={saving}
                                className="text-sm font-semibold text-red-600 hover:underline"
                            >
                                Eliminar planta
                            </button>
                            <div className="flex gap-2">
                                <button
                                    onClick={onClose}
                                    disabled={saving}
                                    className="text-sm font-semibold text-[#537a63] px-4 py-2"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="text-sm font-semibold bg-[#645244] text-white rounded-full px-5 py-2 hover:bg-[#2B1C1C] transition disabled:opacity-60"
                                >
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
                            <button
                                onClick={() => setConfirmingDelete(false)}
                                disabled={saving}
                                className="text-sm font-semibold text-[#537a63] px-4 py-2"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={saving}
                                className="text-sm font-semibold bg-red-600 text-white rounded-full px-5 py-2 hover:bg-red-700 transition disabled:opacity-60"
                            >
                                {saving ? "Eliminando..." : "Sí, eliminar"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}