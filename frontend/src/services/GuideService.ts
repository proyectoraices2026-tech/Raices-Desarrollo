import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

/*
    Guarda si el usuario ya vio la guía rápida de bienvenida, para que salga UNA sola vez por cuenta.
*/
const KEY_PREFIX = "raices_guide_seen_";

function seenLocally(userId: string): boolean {
  try {
    return localStorage.getItem(`${KEY_PREFIX}${userId}`) === "1";
  } catch {
    return false;
  }
}

export function hasSeenGuide(user: User): boolean {
  return user.user_metadata?.guide_seen === true || seenLocally(user.id);
}

export async function markGuideSeen(user: User): Promise<void> {
  try {
    localStorage.setItem(`${KEY_PREFIX}${user.id}`, "1");
  } catch {
    /* sin almacenamiento disponible: queda solo el guardado en la cuenta */
  }

  try {
    await supabase.auth.updateUser({ data: { guide_seen: true } });
  } catch {
    /* si falla, el respaldo local evita que reaparezca en este navegador */
  }
}
