import GuidePage from "../components/GuidePage";
import { QUICK_GUIDES } from "../utils/quickGuides";

/* Guía de uso: cómo usar la app. Se abre desde el footer ("Guía de uso") y desde el popup de bienvenida */
export default function Guides() {
  return (
    <GuidePage
      label="Recursos para nuevos usuarios"
      title="Guía de uso"
      guides={QUICK_GUIDES}
      variant="green"
    />
  );
}
