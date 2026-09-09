import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, subtotal, totalItems, clearCart } = useCart();
  const { showAlert } = useAlert();

  const handleConfirm = () => {
    if (items.length === 0) return;
    showAlert({
      title: "Tu pedido ha sido solicitado",
      message: "Se te notificará cuando el producto esté listo.",
      variant: "success",
    });
    clearCart();
    navigate("/catalog");
  };

  return (
    <div className="min-h-screen bg-[#F4F6F3] pb-28">
      <header className="bg-[#DCE3DB] px-5 py-4 flex items-center justify-between border-b border-slate-100">
        <button onClick={() => navigate(-1)} className="p-1 text-[#26623f]">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-bold text-[#1e2d24]">Lista de pedidos</h1>
          <p className="text-[11px] text-[#537a63]">
            {totalItems} producto{totalItems !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="w-6" />
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
          <span className="text-5xl mb-3">🛒</span>
          <p className="text-sm font-semibold text-[#537a63]">Tu lista está vacía</p>
        </div>
      ) : (
        <>
          <div className="p-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-3 flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{item.category}</span>
                  <p className="text-sm font-bold text-[#1e2d24] truncate">{item.name}</p>
                  <p className="text-sm font-extrabold text-[#2D4A3E]">${item.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 rounded-full bg-[#F4F6F3] flex items-center justify-center text-[#4E705B]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold text-[#1e2d24] w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 rounded-full bg-[#4E705B] flex items-center justify-center text-white"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 ml-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 font-semibold">Subtotal</p>
              <p className="text-lg font-extrabold text-[#1e2d24]">${subtotal.toLocaleString()}</p>
            </div>
            <button
              onClick={handleConfirm}
              className="px-6 py-3 rounded-full bg-[#4E705B] text-white font-semibold text-sm hover:bg-[#3E5C4A] transition"
            >
              Confirmar pedido
            </button>
          </div>
        </>
      )}
    </div>
  );
}