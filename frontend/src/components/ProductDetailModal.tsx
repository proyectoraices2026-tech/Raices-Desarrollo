import { useEffect, useState } from "react";
import { Image as ImageIcon, Minus, Plus, X } from "lucide-react";
import type { Product } from "../services/ProductService";
import { useCart } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

/* Ficha de producto: se abre al tocar la imagen o el nombre de un producto en la tienda. */
export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const { showAlert } = useAlert();

  /* Igual que en el formulario de registrar planta: sin esto, en mobile el dedo
     desliza la página de fondo en vez del contenido de la ficha. */
  useEffect(() => {
    if (!product) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [product]);

  /* Cada vez que se abre un producto distinto, la cantidad vuelve a 1 */
  useEffect(() => {
    setQuantity(1);
    setImageError(false);
  }, [product]);

  if (!product) return null;

  const category = product.categories?.name || "Planta";
  const description =
    (product as any).description || "Variedad seleccionada para mantener tus espacios verdes.";

  const handleAdd = () => {
    addToCart(product, quantity);
    showAlert({ title: "Añadido al carrito", message: `${product.name} (x${quantity})`, variant: "success" });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm md:max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative md:flex md:gap-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 z-10"
          aria-label="Cerrar ficha del producto"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Imagen */}
        <div className="w-full h-48 md:h-auto md:w-64 md:flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 mb-5 md:mb-0">
          {imageError || !product.image_url ? (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <ImageIcon className="w-10 h-10" />
            </div>
          ) : (
            <img
              src={product.image_url}
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Info */}
        <div className="md:flex-1 md:min-w-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            {category}
          </span>

          <h2 id="product-detail-title" className="text-lg md:text-xl font-bold text-[#1F2937] pr-8">
            {product.name}
          </h2>

          <p className="font-extrabold text-[#2D4A3E] text-base mt-1 mb-4">
            ${product.price.toLocaleString()}
          </p>

          <h3 className="text-sm font-bold text-[#1F2937] mb-1.5">Descripción</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">{description}</p>

          <p className="text-sm font-semibold text-[#1F2937] mb-2">Cantidad</p>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-3 bg-[#f0f0ec] border border-[#dcdcd4] rounded-full px-2 py-1.5">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#2D4A3E] hover:bg-slate-100 transition"
                aria-label="Disminuir cantidad"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-semibold text-[#1F2937]" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#2D4A3E] hover:bg-slate-100 transition"
                aria-label="Aumentar cantidad"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="w-full md:w-auto md:px-10 py-3.5 rounded-full bg-[#4E705B] text-white font-semibold text-sm hover:bg-[#3A5A40] transition"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
