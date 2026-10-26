// src/components/PlantDefaultsFields.tsx

import TaskFrequencyField from "./TaskFrequencyField";
import type { FrequencyState, PlantDefaultsState } from "../utils/plantDefaults";

interface PlantDefaultsFieldsProps {
    value: PlantDefaultsState;
    onChange: (next: PlantDefaultsState) => void;
    inputClass: string;
    labelClass: string;
}

const FREQUENCIES = [
    ["watering", "Regar"],
    ["pruning", "Podar"],
    ["fertilizing", "Abonar"],
] as const;

export default function PlantDefaultsFields({ value, onChange, inputClass, labelClass }: PlantDefaultsFieldsProps) {
    const updateFrequency = (key: (typeof FREQUENCIES)[number][0], patch: Partial<FrequencyState>) =>
        onChange({ ...value, [key]: { ...value[key], ...patch } });

    return (
        <div className="border-2 border-[#c8dcc2] rounded-xl p-4 space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#2D4A3E]">
                <input
                    type="checkbox"
                    checked={value.isPlant}
                    onChange={(e) => onChange({ ...value, isPlant: e.target.checked })}
                    className="w-4 h-4"
                />
                Es una planta
            </label>

            {value.isPlant && (
                <>
                    <p className="text-xs text-[#537a63]">
                        Estos datos precargan el registro cuando le asignes esta planta a un usuario. Todos son opcionales.
                    </p>

                    <div>
                        <label htmlFor="default-scientific-name" className={labelClass}>Nombre científico</label>
                        <input
                            id="default-scientific-name"
                            value={value.scientificName}
                            onChange={(e) => onChange({ ...value, scientificName: e.target.value })}
                            className={inputClass}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {FREQUENCIES.map(([key, label]) => (
                            <TaskFrequencyField
                                key={key}
                                label={label}
                                enabled={value[key].enabled}
                                interval={value[key].interval}
                                unit={value[key].unit}
                                onEnabledChange={(enabled) => updateFrequency(key, { enabled })}
                                onIntervalChange={(interval) => updateFrequency(key, { interval })}
                                onUnitChange={(unit) => updateFrequency(key, { unit })}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}