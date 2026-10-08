import { useAuth } from "../context/AuthContext";
import { registerPlant } from "../services/UserPlantsService";
import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import TaskFrequencyField, { type TaskUnit } from "./TaskFrequencyField";
import { PLANT_ICONS } from "../constants/plantIcons";

interface RegisterPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlantAdded?: () => void;
}

interface FrequencyState {
  enabled: boolean;
  interval: number | "";
  unit: TaskUnit;
}

const defaultWatering: FrequencyState = { enabled: true, interval: 3, unit: "day" };
const defaultPruning: FrequencyState = { enabled: true, interval: 2, unit: "month" };
const defaultFertilizing: FrequencyState = { enabled: true, interval: 1, unit: "month" };

export default function RegisterPlantModal({ isOpen, onClose, onPlantAdded }: RegisterPlantModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "success">("form");
  const [name, setName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [watering, setWatering] = useState<FrequencyState>(defaultWatering);
  const [pruning, setPruning] = useState<FrequencyState>(defaultPruning);
  const [fertilizing, setFertilizing] = useState<FrequencyState>(defaultFertilizing);
  const [selectedIcon, setSelectedIcon] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setStep("form");
    setName("");
    setScientificName("");
    setWatering(defaultWatering);
    setPruning(defaultPruning);
    setFertilizing(defaultFertilizing);
    setSelectedIcon(null);
    setError(null);
    onClose();
  };

  const validate = (freq: FrequencyState) => !freq.enabled || (freq.interval !== "" && freq.interval > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("Debes iniciar sesión para registrar una planta.");
      return;
    }

    /* El nombre científico es el único campo de texto opcional; todo lo demás
       (nombre, al menos una tarea de cuidado, e ícono) es obligatorio */
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

    setLoading(true);
    setError(null);

    try {
      await registerPlant(
        {
          name,
          scientificName,
          iconIndex: selectedIcon,
          watering: { enabled: watering.enabled, interval: watering.enabled ? Number(watering.interval) : null, unit: watering.enabled ? watering.unit : null },
          pruning: { enabled: pruning.enabled, interval: pruning.enabled ? Number(pruning.interval) : null, unit: pruning.enabled ? pruning.unit : null },
          fertilizing: { enabled: fertilizing.enabled, interval: fertilizing.enabled ? Number(fertilizing.interval) : null, unit: fertilizing.enabled ? fertilizing.unit : null },
        },
        user.id
      );
      setStep("success");
      onPlantAdded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar la planta.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-[#f0f0ec] border border-[#dcdcd4] rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4E705B] focus:border-transparent text-sm transition";
  const labelClass = "block text-xs font-semibold text-[#2D4A3E] mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]" role="dialog" aria-modal="true" aria-labelledby="register-plant-title">
      {step === "form" ? (
        <div className="bg-verdePastel rounded-2xl shadow-xl w-full max-w-sm md:max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-9 relative">
          <button onClick={resetAndClose} className="absolute top-5 right-5 md:top-6 md:right-6 text-slate-400 hover:text-slate-600" aria-label="Cerrar formulario de registro de planta">
            <X className="w-5 h-5" />
          </button>

          <h2 id="register-plant-title" className="text-lg md:text-xl font-bold text-[#1e2d24]">Registrar planta</h2>
          <p className="text-xs md:text-sm text-[#537a63] mb-6 md:mb-8">Añade una nueva compañera a tu colección</p>

          {error && <p className="text-xs text-red-600 mb-3" role="alert">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div className="space-y-4">
              <div>
                <label htmlFor="plant-name" className={labelClass}>Nombre</label>
                <input id="plant-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label htmlFor="plant-scientific-name" className={labelClass}>Nombre científico (opcional)</label>
                <input id="plant-scientific-name" type="text" value={scientificName} onChange={(e) => setScientificName(e.target.value)} className={inputClass} />
              </div>
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

            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-full bg-[#645244] text-white font-semibold text-sm hover:bg-[#2B1C1C] transition duration-200 disabled:opacity-60">
              {loading ? "Guardando..." : "Confirmar registro"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-verdePastel rounded-2xl shadow-xl w-full max-w-sm p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-[#DCE3DB] flex items-center justify-center mx-auto mb-4" aria-hidden="true">
            <Check className="w-7 h-7 text-[#3E5C4A]" />
          </div>

          <h2 className="text-lg font-bold text-[#1e2d24]">Tu planta ha sido añadida</h2>
          <p className="text-xs text-[#537a63] mt-1 mb-5">Aparecerá entre tus plantas.</p>

          <div className="bg-[#f5f7f2] border border-[#e8efe4] rounded-xl p-3 flex items-center gap-3 mb-6 text-left">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0" aria-hidden="true">
              {selectedIcon !== null && (
                <img src={PLANT_ICONS[selectedIcon]} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-[#1e2d24] uppercase tracking-wide">{name || "Nombre común"}</p>
              <p className="text-xs text-[#537a63] italic">{scientificName || "Nombre científico"}</p>
            </div>
          </div>

          <button onClick={resetAndClose} className="w-full py-3.5 rounded-full bg-[#645244] text-white font-semibold text-sm hover:bg-[#2B1C1C] transition duration-200">
            Aceptar
          </button>
        </div>
      )}
    </div>
  );
}