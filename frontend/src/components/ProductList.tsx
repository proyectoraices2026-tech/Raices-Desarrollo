import { useEffect, useState, useMemo } from "react";
import { getActiveProducts } from "../services/ProductService";
import type { Product } from "../services/ProductService";
import { ChevronLeft, ChevronRight, Image as ImageIcon, Plus, Search} from "lucide-react";

import ProductDetailModal from "./ProductDetailModal";

const ITEMS_PER_PAGE = 25;

/* Categorías */
const DEFAULT_CATEGORIES = ["Todo", "Plantas", "Macetas", "Sustratos", "Herramientas", "Accesorios"];
function ProductCard({
  product,
  onProductClick,
  onAddToCart,
}: {
  product: Product;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-md transition duration-200 flex flex-col w-full">
      <div
        onClick={() => onProductClick(product)}
        className="relative w-full aspect-[4/3] bg-slate-100 cursor-pointer flex-shrink-0 overflow-hidden"
      >
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-slate-400" />
          </div>
        )}

        {imageError || !product.image_url ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <ImageIcon className="w-7 h-7" />
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
      <div className="flex flex-col p-2.5 space-y-0.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          {product.categories?.name || "Plantas"}
        </span>

        <h3
          onClick={() => onProductClick(product)}
          className="font-bold text-[#1F2937] text-sm truncate cursor-pointer hover:underline"
        >
          {product.name}
        </h3>

        <p className="text-xs text-slate-500 line-clamp-1">
          {(product as any).description || "Variedad seleccionada para mantener tus espacios verdes."}
        </p>

        {/* Precio + botón de agregar */}
        <div className="flex items-center justify-between pt-1">
          <p className="font-extrabold text-[#2D4A3E] text-sm">
            ${product.price.toLocaleString()}
          </p>

          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="w-9 h-9 rounded-full bg-[#4E705B] hover:bg-[#3A5A40] text-white flex items-center justify-center shadow-sm transition flex-shrink-0"
            title="Agregar"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todo");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

      // El nombre de la categoría viene de la relación con la tabla `categories`
      // (product.categories.name), igual que en la etiqueta que se muestra en la tarjeta.
      const productCat = product.categories?.name || "Plantas";

      // En la base de datos las categorías están en singular ("Planta", "Herramienta"),
      // pero los chips de filtro están en plural ("Plantas", "Herramientas"). Se le quita
      // la "s" final a ambos lados antes de comparar para que sí coincidan.
      const normalize = (value: string) => value.toLowerCase().trim().replace(/s$/, "");
      const matchesCategory =
        selectedCategory === "Todo" ||
        normalize(productCat) === normalize(selectedCategory);

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
    <div className="w-full max-w-6xl mx-auto space-y-5">
      
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

      {/* Cuadrícula de Tarjetas */}
      {paginatedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={(p) => setSelectedProduct(p)}
              /* El "+" ya no agrega directo al carrito: abre la ficha del producto,
                 igual que si se tocara la imagen o el nombre */
              onAddToCart={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white/60 rounded-2xl p-8 text-center text-slate-500 text-xs font-medium">
          No se encontraron productos disponibles.
        </div>
      )}

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

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