import { withVideo, youtubeEmbed } from "./quickGuides";
import type { QuickGuide } from "./quickGuides";

/* Guías de jardinería (página /gardening-guides). Solo se muestran las que tienen video */
const ALL_GARDENING_GUIDES: QuickGuide[] = [
  {
    id: 1,
    title: "Cómo empezar a cuidar tu primera planta",
    description:
      "Aprende lo básico para empezar a cuidar tu primera planta con confianza.",
    videoUrl: youtubeEmbed("pcBzhPOBITQ"),
  },
];

export const GARDENING_GUIDES: QuickGuide[] = withVideo(ALL_GARDENING_GUIDES);
