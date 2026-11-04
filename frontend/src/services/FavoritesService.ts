import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

/*
    Favoritos (lista de deseos) de cada usuario.

    Funciones públicas (lo único que usa el resto de la app):
      getFavoriteIds(user)              -> ids de los productos favoritos
      addFavorite(user, productId)      -> marca un favorito
      removeFavorite(user, productId)   -> quita un favorito

    HOY (solo front): se guardan en la cuenta de Supabase Auth (user_metadata.favorites), así se ven en
    cualquier navegador o dispositivo, con respaldo en localStorage.

    PARA CONECTAR AL BACKEND: reemplazar el interior de estas 3 funciones por llamadas a los endpoints
    del backend (el resto de la app no cambia). Contrato sugerido para Ricardo:
      GET    /api/favorites              -> { data: ["productId", ...] }
      POST   /api/favorites              body { "productId": "..." }
      DELETE /api/favorites/:productId
    El backend toma el usuario del token de Supabase (header Authorization: Bearer ...).
    A futuro (compartir la lista): se agregaría aquí, por ejemplo, getShareLink(user).
*/

const LOCAL_KEY_PREFIX = "raices_favorites_";
const METADATA_KEY = "favorites";
const MAX_FAVORITES = 200;

const cache = new Map<string, string[]>();
let saveQueue: Promise<unknown> = Promise.resolve();

function readLocal(userId: string): string[] | null {
  try {
    const raw = localStorage.getItem(`${LOCAL_KEY_PREFIX}${userId}`);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : null;
  } catch {
    return null;
  }
}

function writeLocal(userId: string, ids: string[]) {
  try {
    localStorage.setItem(`${LOCAL_KEY_PREFIX}${userId}`, JSON.stringify(ids));
  } catch {
    /* sin almacenamiento disponible: queda solo el guardado en la cuenta */
  }
}

/* La cuenta manda; si todavía no tiene favoritos guardados se usan los del navegador (migración) */
function accountGet(user: User): string[] {
  const fromAccount = user.user_metadata?.[METADATA_KEY];
  const ids = Array.isArray(fromAccount)
    ? fromAccount.filter((id: unknown): id is string => typeof id === "string")
    : (readLocal(user.id) ?? []);
  cache.set(user.id, ids);
  return ids;
}

function accountSave(user: User, ids: string[]): Promise<void> {
  const next = ids.slice(-MAX_FAVORITES);
  cache.set(user.id, next);
  writeLocal(user.id, next);
  /* Las actualizaciones se encadenan para que siempre se guarde la lista más reciente */
  saveQueue = saveQueue
    .then(() =>
      supabase.auth.updateUser({
        data: { [METADATA_KEY]: cache.get(user.id) ?? next },
      }),
    )
    .then(() => undefined);
  return saveQueue as Promise<void>;
}

export async function getFavoriteIds(user: User): Promise<string[]> {
  return accountGet(user);
}

export async function addFavorite(
  user: User,
  productId: string,
): Promise<void> {
  const current = cache.get(user.id) ?? accountGet(user);
  if (current.includes(productId)) return;
  return accountSave(user, [...current, productId]);
}

export async function removeFavorite(
  user: User,
  productId: string,
): Promise<void> {
  const current = cache.get(user.id) ?? accountGet(user);
  return accountSave(
    user,
    current.filter((id) => id !== productId),
  );
}
