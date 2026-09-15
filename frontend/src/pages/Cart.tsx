import { useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, subtotal, totalItems, clearCart } = useCart();
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
    <div className="min-h-screen bg-white pb-28 flex flex-col">
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
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <ShoppingCart className="w-12 h-12 text-[#c8dcc2] mb-4" strokeWidth={1.5} />
          <p className="text-sm font-bold text-[#1e2d24] mb-1">Tu lista está vacía</p>
          <p className="text-xs text-[#537a63]">Agrega productos desde la tienda</p>
        </div>
      ) : (
        
        <>
        <div className="flex items-center gap-4 md:max-w-2xl md:mx-auto md:w-full">
          <div className="flex-1 p-5 md:px-0 space-y-3 md:space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[#f5f7f2] border border-[#e8efe4] rounded-2xl p-3 md:p-4 flex gap-3 md:gap-4 items-start"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#e8efe4] overflow-hidden flex-shrink-0">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-[#537a63] uppercase tracking-wide">
                    {item.category}
                  </p>
                  <p className="text-sm font-bold text-[#1e2d24] truncate">{item.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm font-bold text-[#537a63]">${item.price.toLocaleString()}</p>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-[#537a63] hover:opacity-70"
                        title="Quitar uno"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="bg-white border border-[#e8efe4] rounded-full px-2 py-0.5 text-xs font-semibold text-[#537a63]">
                        ×{item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-[#537a63] hover:opacity-70"
                        title="Agregar uno"
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
              <p className="text-xs font-medium text-[#537a63]">Subtotal</p>
              <p className="text-xs text-[#537a63]">
                {totalItems} artículo{totalItems !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex justify-between items-center pt-1 pb-4">
              <p className="text-xl text-[#1e2d24]">${subtotal.toLocaleString()}</p>
              <span className="bg-[#e8efe4] text-[#5a7a54] text-[10px] font-semibold rounded-full px-2 py-0.5">
                CLP
              </span>
            </div>
            
            <button
              onClick={handleConfirm}
              className="w-full h-12 rounded-2xl bg-[#537a63] text-white font-semibold text-sm shadow-md hover:opacity-90 transition"
            >
              Confirmar pedido
            </button>
          </div>
        </>
      )}
      
    </div>
  );
}