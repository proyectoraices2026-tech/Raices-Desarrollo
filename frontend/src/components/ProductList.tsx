import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveProducts } from "../services/ProductService";
import type { Product } from "../services/ProductService";
import { ChevronLeft, ChevronRight, Image as ImageIcon, Plus, Search} from "lucide-react";

import { useCart } from "../context/CartContext";
import { useAlert } from "../context/AlertContext";


const ITEMS_PER_PAGE = 5;

/* Categorías */
const DEFAULT_CATEGORIES = ["Todo", "Plantas", "Macetas", "Sustratos", "Herramientas", "Accesorios"];

/* Card Horizontal */
function ProductCard({
  product,
  onProductClick,
  onAddToCart,
}: {
  product: Product;
  onProductClick: (id: string) => void;
  onAddToCart: (product: Product) => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4  hover:shadow-md transition duration-200 flex items-center justify-between gap-4 relative w-full">
      
      {/* Contenedor de Imagen + Info */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
        
        {/* Imagen del Producto */}
        <div
          onClick={() => onProductClick(product.id)}
          className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 cursor-pointer"
        >
        
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-slate-400" />
            </div>
          )}

          {imageError || !product.image_url ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
              <ImageIcon className="w-6 h-6" />
            </div>
          ) : (
            <img
              src={product.image_url}
              alt={product.name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}
        </div>

        {/* Información textual */}
        <div className="flex-1 min-w-0 space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {(product as any).category || "PLANTAS"}
          </span>

          <h3
            onClick={() => onProductClick(product.id)}
            className="font-bold text-[#1F2937] text-sm sm:text-base truncate cursor-pointer hover:underline"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-1 hidden sm:block">
            {(product as any).description || "Variedad seleccionada para mantener tus espacios verdes."}
          </p>

        

          <p className="font-extrabold text-[#2D4A3E] text-sm sm:text-base pt-0.5">
            ${product.price.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Botón Circular con '+' */}
      <button
        type="button"
        onClick={() => onAddToCart(product)}
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#4E705B] hover:bg-[#3A5A40] text-white flex items-center justify-center shadow-sm transition flex-shrink-0"
        title="Agregar"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}

export function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todo");
  const [currentPage, setCurrentPage] = useState(1);

  const { addToCart } = useCart();
  const { showAlert } = useAlert();

  useEffect(() => {
    getActiveProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);



  /* Filtrado combinado por buscador y categoría */
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const productCat = (product as any).category || "Plantas";
      const matchesCategory =
        selectedCategory === "Todo" ||
        productCat.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  /* Paginación va a salir con 5 productos */
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-sm font-semibold text-[#2D4A3E] animate-pulse">
          Cargando productos de Raíces...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-xl text-center my-4">
        <p role="alert" className="text-xs font-semibold text-red-600">
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      
      {/* Buscador */}
      <div className="relative w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar productos..."
          className="w-full pl-4 pr-10 py-2.5 bg-white rounded-full text-xs sm:text-sm  focus:outline-none focus:ring-2 focus:ring-[#4E705B] text-slate-700 placeholder-slate-400"
        />
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Chips de Categorías */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none justify-start sm:justify-center">
        {DEFAULT_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap ${
                isActive
                  ? "bg-[#4E705B] text-white "
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Contador de Productos */}
      <p className="text-xs text-slate-500 font-medium">
        {filteredProducts.length} productos
      </p>

      {/* Lista Vertical de Tarjetas Horizontales */}
      {paginatedProducts.length > 0 ? (
        <div className="space-y-3">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={(id) => navigate(`/product/${id}`)}
              onAddToCart={(p) => {
                addToCart(p);
                showAlert({ title: "Añadido al carrito", message: p.name, variant: "success" });
              }}            />
          ))}
        </div>
      ) : (
        <div className="bg-white/60 rounded-2xl p-8 text-center text-slate-500 text-xs font-medium">
          No se encontraron productos disponibles.
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-3">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="p-2 rounded-xl bg-white text-[#2D4A3E] hover:bg-slate-50 disabled:opacity-40 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold text-[#2D4A3E]">
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="p-2 rounded-xl bg-white text-[#2D4A3E] hover:bg-slate-50 disabled:opacity-40 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}