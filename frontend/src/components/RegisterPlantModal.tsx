import { useAuth } from "../context/AuthContext";
import { registerPlant } from "../services/UserPlantsService"
import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";

interface RegisterPlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlantAdded?: () => void;
}

/* 15 espacios seleccionables para el ícono de la planta. Todavía no hay ilustraciones
   reales (tarea #11 del backlog, "Desarrollo de íconos de plantas" — pendiente de diseño),
   así que por ahora son solo círculos vacíos que marcan el lugar donde después va a ir
   cada imagen; no se dibuja ningún ícono de relleno para no dar la idea de que ya son los
   definitivos. Cuando lleguen los assets, aquí es donde se reemplaza el <div> vacío por
   la imagen correspondiente a cada `i`. */
const ICON_COUNT = 15;

/*
  Formulario para registrar una planta nueva, sin funcionalidad real (sin back todavía).
  Reproduce las 2 pantallas del diseño: el formulario y la confirmación de éxito.
  Cuando exista el backend de plantas, el "Confirmar registro" de aquí es el punto exacto
  donde se conectaría la llamada a Supabase.
*/
export default function RegisterPlantModal({ isOpen, onClose, onPlantAdded }: RegisterPlantModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "success">("form");
  const [name, setName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [wateringFreq, setWateringFreq] = useState("");
  const [pruningFreq, setPruningFreq] = useState("");
  const [fertilizingFreq, setFertilizingFreq] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<number | null>(null);

  /* Sin esto, en mobile el dedo "atraviesa" el modal y desliza la página de fondo
     (Mis Plantas) en vez del contenido del formulario. Bloqueamos el scroll del body
     mientras el modal está abierto, y lo devolvemos a la normalidad al cerrarlo. */
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
    setWateringFreq("");
    setPruningFreq("");
    setFertilizingFreq("");
    setSelectedIcon(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("Debes iniciar sesión para registrar una planta.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await registerPlant(
        {
          name,
          scientificName,
          wateringFrequency: wateringFreq,
          pruningFrequency: pruningFreq,
          fertilizingFrequency: fertilizingFreq,
          iconIndex: selectedIcon,
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
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-plant-title"
    >

      {step === "form" ? (
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm md:max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-9 relative">
          <button
            onClick={resetAndClose}
            className="absolute top-5 right-5 md:top-6 md:right-6 text-slate-400 hover:text-slate-600"
            aria-label="Cerrar formulario de registro de planta"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 id="register-plant-title" className="text-lg md:text-xl font-bold text-[#1e2d24]">
            Registrar planta
          </h2>
          <p className="text-xs md:text-sm text-[#537a63] mb-6 md:mb-8">
            Añade una nueva compañera a tu colección
          </p>

          {error && (
            <p className="text-xs text-red-600 mb-3" role="alert">
              {error}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div className="md:grid md:grid-cols-2 md:gap-x-5 space-y-4 md:space-y-0">
              <div>
                <label htmlFor="plant-name" className={labelClass}>
                  Nombre
                </label>
                <input
                  id="plant-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="plant-scientific-name" className={labelClass}>
                  Nombre científico
                </label>
                <input
                  id="plant-scientific-name"
                  type="text"
                  value={scientificName}
                  onChange={(e) => setScientificName(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="md:grid md:grid-cols-3 md:gap-x-5 space-y-4 md:space-y-0">
              <div>
                <label htmlFor="plant-watering" className={labelClass}>
                  Frecuencia de riego
                </label>
                <input
                  id="plant-watering"
                  type="text"
                  value={wateringFreq}
                  onChange={(e) => setWateringFreq(e.target.value)}
                  placeholder="Ej. cada 3 días"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="plant-pruning" className={labelClass}>
                  Frecuencia de poda
                </label>
                <input
                  id="plant-pruning"
                  type="text"
                  value={pruningFreq}
                  onChange={(e) => setPruningFreq(e.target.value)}
                  placeholder="Ej. cada 2 meses"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="plant-fertilizing" className={labelClass}>
                  Frecuencia de abono
                </label>
                <input
                  id="plant-fertilizing"
                  type="text"
                  value={fertilizingFreq}
                  onChange={(e) => setFertilizingFreq(e.target.value)}
                  placeholder="Ej. cada mes"
                  className={inputClass}
                />
              </div>
            </div>

            <fieldset>
              <legend className={labelClass}>Ícono</legend>
              <p className="text-[11px] text-[#8a8a82] -mt-1 mb-3">
                Espacio reservado para las ilustraciones (pendientes de diseño)
              </p>
              <div className="grid grid-cols-5 md:grid-cols-8 gap-3 max-w-xs md:max-w-none">
                {Array.from({ length: ICON_COUNT }).map((_, i) => {
                  const selected = selectedIcon === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedIcon(i)}
                      aria-pressed={selected}
                      aria-label={`Espacio de ícono ${i + 1}${selected ? ", seleccionado" : ""}`}
                      className={`aspect-square rounded-full border-2 transition ${selected
                        ? "bg-[#645244] border-[#645244] ring-2 ring-offset-2 ring-[#645244]"
                        : "bg-[#ece9e3] border-dashed border-[#c9c4b8] hover:border-[#645244]"
                        }`}
                    />
                  );
                })}
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#645244] text-white font-semibold text-sm hover:bg-[#2B1C1C] transition duration-200 disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Confirmar registro"}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center">
          <div
            className="w-14 h-14 rounded-full bg-[#DCE3DB] flex items-center justify-center mx-auto mb-4"
            aria-hidden="true"
          >
            <Check className="w-7 h-7 text-[#3E5C4A]" />
          </div>

          <h2 className="text-lg font-bold text-[#1e2d24]">Tu planta ha sido añadida</h2>
          <p className="text-xs text-[#537a63] mt-1 mb-5">Aparecerá entre tus plantas.</p>

          <div className="bg-[#f5f7f2] border border-[#e8efe4] rounded-xl p-3 flex items-center gap-3 mb-6 text-left">
            {/* Mismo espacio reservado para el ícono real, aquí en la vista previa */}
            <div
              className="w-10 h-10 rounded-lg bg-[#ece9e3] border-2 border-dashed border-[#c9c4b8] flex-shrink-0"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs font-bold text-[#1e2d24] uppercase tracking-wide">
                {name || "Nombre común"}
              </p>
              <p className="text-xs text-[#537a63] italic">{scientificName || "Nombre científico"}</p>
            </div>
          </div>

          <button
            onClick={resetAndClose}
            className="w-full py-3.5 rounded-full bg-[#645244] text-white font-semibold text-sm hover:bg-[#2B1C1C] transition duration-200"
          >
            Aceptar
          </button>
        </div>
      )}
    </div>
  );
}
