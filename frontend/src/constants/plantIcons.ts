import icon_anturio_rojo from "../assets/plants/anturio-rojo.png";
import icon_apio from "../assets/plants/apio.png";
import icon_cebolla from "../assets/plants/cebolla.png";
import icon_cebollin from "../assets/plants/cebollin.png";
import icon_chile_dulce from "../assets/plants/chile-dulce.png";
import icon_corona_de_cristo from "../assets/plants/corona-de-cristo.png";
import icon_culantro_castilla from "../assets/plants/culantro-castilla.png";
import icon_espinaca from "../assets/plants/espinaca.png";
import icon_guineas from "../assets/plants/guineas.png";
import icon_ixora from "../assets/plants/ixora.png";
import icon_lechuga from "../assets/plants/lechuga.png";
import icon_orquidea_phalaenopsis from "../assets/plants/orquidea-phalaenopsis.png";
import icon_rosa_del_desierto from "../assets/plants/rosa-del-desierto.png";

export const PLANT_ICONS = [
  icon_anturio_rojo,
  icon_apio,
  icon_cebolla,
  icon_cebollin,
  icon_chile_dulce,
  icon_corona_de_cristo,
  icon_culantro_castilla,
  icon_espinaca,
  icon_guineas,
  icon_ixora,
  icon_lechuga,
  icon_orquidea_phalaenopsis,
  icon_rosa_del_desierto,
];

export function getPlantIconUrl(
  iconIndex: string | number | null | undefined,
): string | null {
  if (iconIndex === null || iconIndex === undefined) return null;
  const index = Number(iconIndex);
  if (Number.isNaN(index) || index < 0 || index >= PLANT_ICONS.length)
    return null;
  return PLANT_ICONS[index];
}
