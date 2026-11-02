/*
    Favoritos (lista de deseos) de cada usuario.

    Por ahora NO hay tabla de favoritos ni endpoint así que los favoritos se guardan en el navegador.
    Eso significa que no viajan entre dispositivos ni se pueden compartir todavía.

    Todo el acceso a los datos está en estas dos funciones a propósito: cuando exista la tabla o el
    endpoint real, solo hay que cambiar el interior de getFavoriteIds / saveFavoriteIds
    (y volverlas async) sin tocar los componentes.
*/

const storageKey = (userId: string) => `raices_favorites_${userId}`;

/* Ids de los productos que el usuario marcó como favoritos */
export function getFavoriteIds(userId: string): string[] {
    try {
        const raw = localStorage.getItem(storageKey(userId));
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
    } catch {
        /* localStorage puede estar bloqueado (modo privado) o tener datos dañados: se parte de cero */
        return [];
    }
}

/* Guarda la lista completa de favoritos del usuario */
export function saveFavoriteIds(userId: string, ids: string[]): void {
    try {
        localStorage.setItem(storageKey(userId), JSON.stringify(ids));
    } catch {
        /* Si no se puede guardar, los favoritos siguen funcionando mientras la página esté abierta */
    }
}
