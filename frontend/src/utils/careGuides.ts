/*
    Mini guías de texto para la sección "Recursos para el cuido de plantas" de la Guía rápida.
*/
export type CareBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "tip"; text: string };

export interface CareGuide {
  id: number;
  title: string;
  description: string;
  blocks: CareBlock[];
}

export const CARE_GUIDES: CareGuide[] = [
  {
    id: 1,
    title: "Riega cuando la planta lo pide, no por costumbre",
    description:
      "Aprende a saber si toca regar y evita el error más común: el exceso de agua.",
    blocks: [
      {
        type: "p",
        text: "Antes de regar, mete un dedo en el sustrato hasta unos 2 o 3 cm de profundidad.",
      },
      {
        type: "list",
        items: [
          "Si sale seco, riega hasta que el agua salga por los huecos de drenaje.",
          "Si sale húmedo, espera un día y vuelve a revisar.",
          "Vacía el plato después de 15 minutos: las raíces no deben quedar en agua.",
          "Riega por la mañana o al atardecer, nunca bajo el sol fuerte del mediodía.",
        ],
      },
      {
        type: "table",
        headers: ["Tipo de planta", "Frecuencia orientativa"],
        rows: [
          [
            "Suculentas (Corona de Cristo, Rosa del Desierto)",
            "Cada 7 a 10 días, con el sustrato seco",
          ],
          ["Plantas de flor (Ixora, Guineas, Anturio)", "Cada 2 a 4 días"],
          ["Orquídeas", "Cada 7 días"],
          ["Hortalizas y hierbas (lechuga, culantro, apio)", "Cada 1 a 2 días"],
        ],
      },
      {
        type: "tip",
        text: "Hojas amarillas y blandas suelen indicar exceso de agua; hojas secas y crujientes, falta. En época de lluvia, riega menos.",
      },
    ],
  },
  {
    id: 2,
    title: "Dale la luz justa a cada planta",
    description:
      "Elige el mejor lugar de tu casa o jardín según cuánta luz necesita cada tipo de planta.",
    blocks: [
      {
        type: "table",
        headers: ["Tipo de luz", "Qué significa", "Ejemplos"],
        rows: [
          [
            "Sol directo",
            "6 horas o más de sol sin filtro",
            "Ixora, Rosa del Desierto, Corona de Cristo",
          ],
          [
            "Luz brillante indirecta",
            "Mucha claridad, sin sol directo sobre las hojas",
            "Anturio, Orquídea Phalaenopsis",
          ],
          [
            "Media sombra",
            "Sol suave de mañana o luz filtrada",
            "Guineas, culantro, lechuga",
          ],
        ],
      },
      {
        type: "list",
        items: [
          "Tallos largos, delgados y pálidos: le falta luz, acércala a una ventana.",
          "Manchas marrones o blancas en las hojas: recibe demasiado sol, aléjala o dale sombra al mediodía.",
          "Gira la maceta un cuarto de vuelta cada semana para que crezca pareja.",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Elige bien la maceta y el sustrato",
    description:
      "Una buena base evita problemas de raíces y hace que tu planta crezca más fuerte.",
    blocks: [
      {
        type: "list",
        items: [
          "La maceta siempre debe tener huecos de drenaje.",
          "Elige una maceta solo 2 a 4 cm más ancha que la anterior; una muy grande retiene demasiada agua.",
          "Trasplanta cuando las raíces salgan por los huecos o el sustrato se seque en pocas horas.",
          "Trasplanta en la mañana y riega ligeramente después.",
        ],
      },
      {
        type: "table",
        headers: ["Planta", "Sustrato recomendado"],
        rows: [
          ["Suculentas", "Tierra con arena o perlita (drena muy rápido)"],
          ["Orquídeas", "Corteza de pino, nunca tierra común"],
          ["Anturio", "Tierra suelta con fibra de coco y corteza"],
          [
            "Hortalizas, hierbas y plantas de flor",
            "Tierra negra con compost, suelta y fértil",
          ],
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Abona con medida: menos es más",
    description:
      "Cuándo y cuánto fertilizante usar para que tu planta crezca sin quemarse.",
    blocks: [
      {
        type: "list",
        items: [
          "Abona siempre con el sustrato húmedo, nunca seco.",
          "Sigue la dosis de la etiqueta; si dudas, usa la mitad.",
          "No abones una planta enferma, recién comprada o recién trasplantada: espera unas 4 semanas.",
          "Reduce el abono cuando la planta casi no crece.",
        ],
      },
      {
        type: "table",
        headers: ["Planta", "Frecuencia orientativa"],
        rows: [
          ["Anturio, Ixora, Rosa del Desierto", "Cada mes"],
          ["Guineas y Orquídeas (dosis diluida a la mitad)", "Cada 2 semanas"],
          ["Corona de Cristo", "Cada 2 meses"],
          ["Hortalizas y hierbas", "Cada 2 a 3 semanas"],
        ],
      },
      {
        type: "tip",
        text: "Puntas de hojas quemadas o una costra blanca sobre la tierra indican exceso de abono: riega abundante para lavar el sustrato.",
      },
    ],
  },
  {
    id: 5,
    title: "Poda para que crezca más sana",
    description:
      "Cortes simples que estimulan nuevo crecimiento y mantienen tu planta ordenada.",
    blocks: [
      {
        type: "list",
        ordered: true,
        items: [
          "Desinfecta las tijeras con alcohol antes y después de usarlas.",
          "Quita primero hojas y flores secas, amarillas o dañadas.",
          "Corta justo encima de una hoja o un nudo para que brote desde ahí.",
          "No cortes más de un tercio de la planta de una sola vez.",
        ],
      },
      {
        type: "table",
        headers: ["Planta", "Qué y cuándo podar"],
        rows: [
          ["Anturio", "Hojas y flores secas, cada 3 meses"],
          ["Guineas", "Pellizca las puntas y quita flores marchitas, cada mes"],
          ["Ixora", "Da forma al arbusto, cada 2 meses"],
          [
            "Orquídea Phalaenopsis",
            "Solo el tallo floral cuando se seque, cada 6 meses",
          ],
          [
            "Corona de Cristo y Rosa del Desierto",
            "Ramas secas o muy largas, cada 3 a 6 meses",
          ],
        ],
      },
      {
        type: "tip",
        text: "La savia de la Corona de Cristo y de la Rosa del Desierto es irritante y tóxica: usa guantes y lávate las manos después.",
      },
    ],
  },
  {
    id: 6,
    title: "Detecta plagas a tiempo",
    description:
      "Revisa tus plantas cada semana y actúa al primer síntoma, antes de que se propague.",
    blocks: [
      {
        type: "table",
        headers: ["Señal", "Posible causa", "Primera acción"],
        rows: [
          [
            "Motas blancas como algodón en tallos y hojas",
            "Cochinilla",
            "Limpia con un algodón con alcohol al 70%",
          ],
          [
            "Brotes nuevos pegajosos o con insectos pequeños",
            "Pulgones",
            "Lava con agua y jabón suave",
          ],
          [
            "Manchas negras o marrones en las hojas",
            "Hongos",
            "Quita las hojas afectadas, reduce el riego y mejora la ventilación",
          ],
          [
            "Telarañas finas y hojas con puntitos",
            "Ácaros",
            "Aumenta la humedad y lava las hojas por debajo",
          ],
        ],
      },
      {
        type: "tip",
        text: "Aísla de las demás la planta afectada hasta que se recupere. Si la plaga no cede en dos semanas, consulta en el vivero.",
      },
    ],
  },
];
