import GuidePage from "../components/GuidePage";
import { GARDENING_GUIDES } from "../utils/gardeningGuides";

/* Guías de jardinería (diseño "Guías" de Figma). Se abre solo desde el menú lateral */
export default function GardeningGuides() {
  return (
    <GuidePage
      label="Recursos para principiantes"
      title="Guías Rápidas de Jardinería"
      guides={GARDENING_GUIDES}
      variant="brown"
    />
  );
}
