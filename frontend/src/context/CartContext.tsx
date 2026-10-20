import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { getAvailableStock } from "../services/ProductService";
import type { Product } from "../services/ProductService";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  category: string;
  quantity: number;
  /* Unidades disponibles (stock menos lo apartado por pedidos pendientes) al momento de
     agregarlo, para no dejar subir la cantidad en el carrito más allá de lo que se puede pedir */
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  /* Cuántas unidades de un producto ya hay en el carrito (0 si no está) */
  getQuantityInCart: (id: string) => number;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number = 1) => {
    const available = getAvailableStock(product);
    if (available <= 0) return;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        /* Nunca deja que la suma pase de lo disponible, aunque ya hubiera algo en el carrito
           de una visita anterior a la ficha del producto */
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, available), stock: available }
            : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          category: product.categories?.name || "Plantas",
          quantity: Math.min(quantity, available),
          stock: available,
        },
      ];
    });
  };

  const getQuantityInCart = (id: string) => items.find((i) => i.id === id)?.quantity ?? 0;

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    /* Mismo tope de stock aquí, que es lo que usan los botones +/- del carrito */
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.min(quantity, i.stock) } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, getQuantityInCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}