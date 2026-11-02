import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight, PawPrint } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";

import { getActiveProducts } from "../services/ProductService";
import type { Product } from "../services/ProductService";
import { ProductCard } from "./ProductList";
import ProductDetailModal from "./ProductDetailModal";

/* Sección "Plantas seguras para mascotas": carrusel debajo de "Más vendidos".
   Muestra los productos activos con pet_safe = true. Ese campo todavía no existe en la base de datos:
   mientras no exista (o no haya productos marcados) la sección simplemente no se muestra. */
export default function PetSafeSlider() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    getActiveProducts()
      .then((all) => setProducts(all.filter((p) => p.pet_safe === true)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  /* Es una sección secundaria: si carga, falla o no hay productos marcados, no se muestra */
  if (loading || products.length === 0) return null;

  return (
    <section className="bg-white py-6" aria-labelledby="pet-safe-title">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 id="pet-safe-title" className="flex items-center gap-2 text-lg font-bold text-[#1e2d24] mb-1">
          <PawPrint className="w-5 h-5 text-[#4E705B]" aria-hidden="true" />
          Plantas seguras para mascotas
        </h2>
        <p className="text-xs text-slate-500 mb-4">Opciones que no representan riesgo para perros y gatos.</p>

        <div className="relative">
          <Swiper
            className="w-full min-w-0 !pt-2 !px-2 !pb-10"
            style={{ "--swiper-theme-color": "#4E705B" } as CSSProperties}
            modules={[Pagination]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            pagination={{ clickable: true }}
            spaceBetween={12}
            slidesPerView={2}
            slidesPerGroup={2}
            breakpoints={{
              640: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 16 },
              768: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 16 },
              1024: { slidesPerView: 5, slidesPerGroup: 5, spaceBetween: 16 },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="rounded-2xl shadow-md">
                  <ProductCard product={product} onProductClick={setSelectedProduct} onAddToCart={setSelectedProduct} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Flechas: solo en pantallas anchas; en mobile se desliza con el dedo */}
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Plantas anteriores"
            className="hidden md:flex absolute top-[45%] -translate-y-1/2 -left-4 z-10 w-8 h-8 items-center justify-center rounded-full bg-white border border-[#c8dcc2] text-[#2D4A3E] shadow hover:bg-[#f0f5ec] transition"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Plantas siguientes"
            className="hidden md:flex absolute top-[45%] -translate-y-1/2 -right-4 z-10 w-8 h-8 items-center justify-center rounded-full bg-white border border-[#c8dcc2] text-[#2D4A3E] shadow hover:bg-[#f0f5ec] transition"
          >
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  );
}
