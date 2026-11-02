import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { getFavoriteIds, saveFavoriteIds } from "../services/FavoritesService";

interface FavoritesContextType {
  favoriteIds: string[];
  isFavorite: (productId: string) => boolean;
  /* Marca o desmarca un producto. Devuelve false si no hay sesión iniciada (no se guardó nada) */
  toggleFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  /* Al iniciar o cerrar sesión se cargan los favoritos de ese usuario (o ninguno) */
  useEffect(() => {
    setFavoriteIds(userId ? getFavoriteIds(userId) : []);
  }, [userId]);

  const isFavorite = (productId: string) => favoriteIds.includes(productId);

  const toggleFavorite = (productId: string) => {
    if (!userId) return false;

    const next = favoriteIds.includes(productId)
      ? favoriteIds.filter((id) => id !== productId)
      : [...favoriteIds, productId];

    setFavoriteIds(next);
    saveFavoriteIds(userId, next);
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
