import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { useAlert } from "./AlertContext";
import { addFavorite, getFavoriteIds, removeFavorite } from "../services/FavoritesService";

interface FavoritesContextType {
  favoriteIds: string[];
  isFavorite: (productId: string) => boolean;
  /* Marca o desmarca un producto. Devuelve false si no hay sesión iniciada (no se guardó nada) */
  toggleFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const userId = user?.id ?? null;
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  /* Al iniciar o cerrar sesión se cargan los favoritos de ese usuario (o ninguno) */
  useEffect(() => {
    if (!user) {
      setFavoriteIds([]);
      return;
    }
    let cancelled = false;
    getFavoriteIds(user)
      .then((ids) => {
        if (!cancelled) setFavoriteIds(ids);
      })
      .catch(() => {
        if (!cancelled) setFavoriteIds([]);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const isFavorite = (productId: string) => favoriteIds.includes(productId);

  /* El cambio se ve al instante (optimista); si falla el guardado, se revierte y se avisa */
  const toggleFavorite = (productId: string) => {
    if (!user) return false;

    const wasFavorite = favoriteIds.includes(productId);
    setFavoriteIds((prev) => (wasFavorite ? prev.filter((id) => id !== productId) : [...prev, productId]));

    const save = wasFavorite ? removeFavorite(user, productId) : addFavorite(user, productId);
    save.catch(() => {
      setFavoriteIds((prev) =>
        wasFavorite ? [...prev, productId] : prev.filter((id) => id !== productId)
      );
      showAlert({
        title: "No se pudo guardar",
        message: "No se pudo actualizar tus favoritos. Inténtalo de nuevo.",
        variant: "error",
      });
    });
    return true;
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites debe usarse dentro de <FavoritesProvider>");
  return ctx;
}
