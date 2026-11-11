// src/components/TaskFrequencyField.tsx

export type TaskUnit = "day" | "week" | "month";

interface TaskFrequencyFieldProps {
    label: string;
    enabled: boolean;
    interval: number | "";
    unit: TaskUnit;
    onEnabledChange: (enabled: boolean) => void;
    onIntervalChange: (interval: number | "") => void;
    onUnitChange: (unit: TaskUnit) => void;
}

export default function TaskFrequencyField({
    label,
    enabled,
    interval,
    unit,
    onEnabledChange,
    onIntervalChange,
    onUnitChange,
}: TaskFrequencyFieldProps) {
    return (
        <div className="border border-[#e8efe4] rounded-xl p-3.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#2D4A3E] mb-2">
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => onEnabledChange(e.target.checked)}
                    className="w-4 h-4"
                />
                {label}
            </label>

            {enabled && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-[#537a63] whitespace-nowrap">Cada</span>
                    <input
                        type="number"
                        min={1}
                        value={interval}
                        onChange={(e) => onIntervalChange(e.target.value === "" ? "" : Number(e.target.value))}
                        className="w-16 px-2 py-2 bg-[#f0f0ec] border border-[#dcdcd4] rounded-lg text-sm text-center"
                    />
                    <select
                        value={unit}
                        onChange={(e) => onUnitChange(e.target.value as TaskUnit)}
                        className="min-w-[92px] flex-1 px-2 py-2 bg-[#f0f0ec] border border-[#dcdcd4] rounded-lg text-sm"
                    >
                        <option value="day">día(s)</option>
                        <option value="week">semana(s)</option>
                        <option value="month">mes(es)</option>
                    </select>
                </div>
            )}
        </div>
    );
}