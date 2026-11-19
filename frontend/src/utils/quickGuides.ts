export interface QuickGuide {
  id: number;
  title: string;
  description: string;
  videoUrl: string | null;
}

/* Convierte un enlace de YouTube (watch?v=ID) en el enlace para incrustarlo (embed/ID) */
export function youtubeEmbed(id: string): string {
  return `https://www.youtube.com/embed/${id}`;
}

/* Solo se muestran las guías que ya tienen video*/
export function withVideo(guides: QuickGuide[]): QuickGuide[] {
  return guides.filter((g) => g.videoUrl).map((g, i) => ({ ...g, id: i + 1 }));
}

/* Guía de uso: cómo usar la app */
const ALL_QUICK_GUIDES: QuickGuide[] = [
  {
    id: 1,
    title: "Cómo registrarte y crear tu cuenta",
    description:
      "Aprende a crear tu cuenta en Raíces paso a paso y empieza a cuidar tus plantas.",
    videoUrl: null,
  },
  {
    id: 2,
    title: "Navegando por la app: secciones principales",
    description:
      "Descubre el calendario de riegos, el catálogo y el chatbot de asesoría.",
    videoUrl: youtubeEmbed("mzCUfbtk3hU"),
  },
  {
    id: 3,
    title: "Agregar y gestionar tus plantas",
    description:
      "Añade tus plantas, personaliza sus cuidados y recibe recordatorios a tiempo.",
    videoUrl: youtubeEmbed("mwvDxFxeYEo"),
  },
  {
    id: 4,
    title: "Realizando tu primera compra",
    description:
      "Explora la tienda, agrega productos al carrito y completa tu pedido fácilmente.",
    videoUrl: youtubeEmbed("X1g6UUdxwC4"),
  },
  {
    id: 5,
    title: "Usando el Chatbot de Raíces",
    description:
      "Consulta a la asistente virtual Rut sobre cuidados, enfermedades y recomendaciones.",
    videoUrl: youtubeEmbed("3GEB8oB81q4"),
  },
];

export const QUICK_GUIDES: QuickGuide[] = withVideo(ALL_QUICK_GUIDES);
