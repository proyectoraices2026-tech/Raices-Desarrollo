import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";
import { createOrderRequest } from "../services/RequestService";
import { formatPrice } from "../utils/formatPrice";
import NavBar from "../components/NavBar";
import SideMenu from "../components/SideMenu";
export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, subtotal, totalItems, clearCart } = useCart();
  const { showAlert } = useAlert();
  const [menuOpen, setMenuOpen] = useState(false);
  /* Evita que se pueda mandar el mismo pedido dos veces mientras se espera la respuesta del backend */
  const [submitting, setSubmitting] = useState(false);
  /* Pide confirmación antes de vaciar, para que un clic accidental no borre todo el carrito*/
  const [confirmingClear, setConfirmingClear] = useState(false);

  const handleClearCart = () => {
    clearCart();
    setConfirmingClear(false);
    showAlert({ title: "Carrito vacío", message: "Se quitaron todos los productos.", variant: "success" });
  };

  const handleClose = () => navigate("/catalog");

  const handleConfirm = async () => {
    if (items.length === 0 || submitting) return;

    setSubmitting(true);
    try {
      await createOrderRequest(
        items.map((item) => ({ productId: item.id, quantity: item.quantity }))
      );

      showAlert({
        title: "Tu pedido ha sido solicitado",
        message: "Se te notificará cuando el producto esté listo.",
        variant: "success",
      });
      clearCart();
      navigate("/catalog");
    } catch (err) {
      showAlert({
        title: "No se pudo enviar el pedido",
        message: err instanceof Error ? err.message : "Intenta de nuevo en unos minutos.",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="sticky top-0 z-40">
        <NavBar onMenuClick={() => setMenuOpen(true)} />
      </div>

      <div className="bg-white border-b border-[#e8efe4] px-5 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold text-[#1e2d24]">Lista de pedidos</h1>
            <p className="text-xs text-primarioBase mt-0.5">{totalItems} producto{totalItems !== 1 ? "s" : ""}</p>
          </div>

          <div className="flex items-center gap-4">
            {items.length > 0 && !confirmingClear && (
              <button
                onClick={() => setConfirmingClear(true)}
                className="text-xs font-semibold text-primarioBase hover:underline underline-offset-2"
              >
                Vaciar carrito
              </button>
            )}
            {confirmingClear && (
              <div className="flex items-center gap-2 text-xs text-primarioBase">
                <span>¿Seguro?</span>
                <button onClick={handleClearCart} className="font-bold underline">Sí, vaciar</button>
                <button onClick={() => setConfirmingClear(false)} className="text-primarioBase/70 underline">Cancelar</button>
              </div>
            )}

            {/* Cierra el carrito y vuelve al catálogo */}
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-full bg-verdePastel hover:bg-[#c5dcb9] text-primarioBase flex items-center justify-center transition flex-shrink-0"
              aria-label="Cerrar carrito"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <ShoppingCart className="w-12 h-12 text-white mb-4" strokeWidth={1.5} />
          <p className="text-sm font-bold text-[#1e2d24] mb-1">Tu lista está vacía</p>
          <p className="text-xs text-primarioBase">Agrega productos desde la tienda</p>
        </div>
      ) : (
        <>
          <div className="flex-1 md:max-w-2xl md:mx-auto md:w-full">
            <div className="p-5 md:px-0 space-y-3 md:space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-[#e8efe4] rounded-2xl p-3 md:p-4 flex gap-3 md:gap-4 items-start shadow-sm"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#e8efe4] overflow-hidden flex-shrink-0">
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-primarioBase uppercase tracking-wide">
                      {item.category}
                    </p>
                    <p className="text-sm font-bold text-[#1e2d24] truncate">{item.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm font-bold text-primarioBase">₡{formatPrice(item.price)}</p>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-primarioBase hover:opacity-70"
                          title="Quitar uno"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="bg-verdePastel rounded-full px-2 py-0.5 text-xs font-semibold text-primarioBase">
                          ×{item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="text-primarioBase hover:opacity-70 disabled:opacity-30 disabled:hover:opacity-30"
                          title={item.quantity >= item.stock ? "No hay más stock disponible" : "Agregar uno"}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border-t border-[#e8efe4] px-5 py-4 md:max-w-2xl md:mx-auto md:w-full">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs font-medium text-primarioBase">Subtotal</p>
              <p className="text-xs text-primarioBase">
                {totalItems} artículo{totalItems !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex justify-between items-center pt-1 pb-4">
              <p className="text-xl text-[#1e2d24]">₡{formatPrice(subtotal)}</p>
            </div>

            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="w-full h-12 rounded-2xl bg-primarioBase text-white font-semibold text-sm shadow-md hover:opacity-90 transition disabled:opacity-60"
            >
              {submitting ? "Enviando..." : "Confirmar pedido"}
            </button>
          </div>
        </>
      )}

      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
