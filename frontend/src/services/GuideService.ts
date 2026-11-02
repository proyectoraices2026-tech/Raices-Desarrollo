/*
    Guarda si el usuario ya vio la guía rápida de bienvenida.
    TEMPORAL (solo frontend): se guarda en localStorage por usuario, así que si cambia de
    navegador o dispositivo la guía vuelve a aparecer una vez. 
*/
const KEY_PREFIX = "raices_guide_seen_";

export function hasSeenGuide(userId: string): boolean {
  try {
    return localStorage.getItem(`${KEY_PREFIX}${userId}`) === "1";
  } catch {
    return true; /* sin almacenamiento: mejor no mostrar el popup en cada carga */
  }
}

export function markGuideSeen(userId: string) {
  try {
    localStorage.setItem(`${KEY_PREFIX}${userId}`, "1");
  } catch {
    /* sin almacenamiento disponible */
  }
}
