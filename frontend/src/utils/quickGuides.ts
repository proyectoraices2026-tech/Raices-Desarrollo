export interface QuickGuide {
  id: number;
  title: string;
  description: string;
  videoUrl: string | null;
}

export const QUICK_GUIDES: QuickGuide[] = [
  { id: 1, title: "Cómo registrarte y crear tu cuenta", description: "Aprende a crear tu cuenta en Raíces paso a paso y empieza a cuidar tus plantas.", videoUrl: null },
  { id: 2, title: "Navegando por la app: secciones principales", description: "Descubre el calendario de riegos, el catálogo y el chatbot de asesoría.", videoUrl: null },
  { id: 3, title: "Agregar y gestionar tus plantas", description: "Añade tus plantas, personaliza sus cuidados y recibe recordatorios a tiempo.", videoUrl: null },
  { id: 4, title: "Realizando tu primera compra", description: "Explora la tienda, agrega productos al carrito y completa tu pedido fácilmente.", videoUrl: null },
  { id: 5, title: "Usando el Chatbot de Raíces", description: "Consulta a la asistente virtual Rut sobre cuidados, enfermedades y recomendaciones.", videoUrl: null },
];
