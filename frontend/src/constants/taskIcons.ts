import regar from "../assets/tasks/regar.svg";
import regarPendiente from "../assets/tasks/regarpendiente.svg";
import poda from "../assets/tasks/poda.svg";
import podaPendiente from "../assets/tasks/podapend.svg";
import abono from "../assets/tasks/abono.svg";
import abonoPendiente from "../assets/tasks/abonopend.svg";

/* Los 3 tipos de tarea "fija" de una planta. "custom" (tareas manuales con
   nombre libre) no tiene ícono propio, se maneja aparte donde se use. */
export type CareTaskType = "watering" | "pruning" | "fertilizing";

export const CARE_TASK_LABELS: Record<CareTaskType, string> = {
  watering: "Regar",
  pruning: "Podar",
  fertilizing: "Abonar",
};

interface CareTaskIconSet {
  /* Versión a color de marca: se usa en las tarjetas de "Hoy"/"Próximas",
     y también en las tarjetas de planta cuando esa tarea NO es para hoy. */
  icon: string;
  /* Versión roja ("pendiente"): se usa en las tarjetas de planta para marcar
     que esa tarea SÍ corresponde a hoy para esa planta en concreto. */
  active: string;
  /* Fondo suave de la cajita donde va el ícono */
  boxBg: string;
}

export const CARE_TASK_ICONS: Record<CareTaskType, CareTaskIconSet> = {
  watering: { icon: regar, active: regarPendiente, boxBg: "bg-[#E3ECF5]" },
  pruning: { icon: poda, active: podaPendiente, boxBg: "bg-[#EFE9E2]" },
  fertilizing: { icon: abono, active: abonoPendiente, boxBg: "bg-[#E6EFE1]" },
};
