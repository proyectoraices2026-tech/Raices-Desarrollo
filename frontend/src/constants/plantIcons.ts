import icon1 from "../assets/1.svg";
import icon2 from "../assets/2.svg";
import icon3 from "../assets/3.svg";
import icon4 from "../assets/4.svg";
import icon5 from "../assets/5.svg";
import icon6 from "../assets/6.svg";

export const PLANT_ICONS = [icon1, icon2, icon3, icon4, icon5, icon6];

export function getPlantIconUrl(
  iconIndex: string | number | null | undefined,
): string | null {
  if (iconIndex === null || iconIndex === undefined) return null;
  const index = Number(iconIndex);
  if (Number.isNaN(index) || index < 0 || index >= PLANT_ICONS.length)
    return null;
  return PLANT_ICONS[index];
}
