import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";

import { getBestSellers } from "../services/ProductService";
import type { Product } from "../services/ProductService";
import { ProductCard } from "./ProductList";
import ProductDetailModal from "./ProductDetailModal";

/* Cantidad de productos que muestra el carrusel */
const BEST_SELLERS_LIMIT = 10;

/* Sección "Más vendidos": carrusel de tarjetas debajo del banner del catálogo */
export default function BestSellers() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const swiperRef = useRef<SwiperType | null>(null);

    useEffect(() => {
        getBestSellers(BEST_SELLERS_LIMIT)
            .then(setProducts)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    /* Lleva al usuario hasta la cuadrícula completa del catálogo (main con id="catalogo") */
    const scrollToCatalog = () => {
        document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
    };

    /* Es una sección secundaria: si carga o falla, simplemente no se muestra */
    if (loading || products.length === 0) return null;

    return (
        <section className="bg-[#f5f7f2] py-6" aria-labelledby="best-sellers-title">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between mb-4">
                    <h2
                        id="best-sellers-title"
                        className="flex items-center gap-2 text-lg font-bold text-[#1e2d24]"
                    >
                        
                        Más vendidos
                    </h2>

                    <button
                        type="button"
                        onClick={scrollToCatalog}
                        className="flex items-center gap-1 text-xs font-semibold text-[#2D4A3E] hover:underline"
                    >
                        Ver todos
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                </div>

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
                                    <ProductCard
                                        product={product}
                                        onProductClick={setSelectedProduct}
                                        /* Igual que en el catálogo: el "+" abre la ficha del producto */
                                        onAddToCart={setSelectedProduct}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Flechas: solo en pantallas anchas; en mobile se desliza con el dedo */}
                    <button
                        type="button"
                        onClick={() => swiperRef.current?.slidePrev()}
                        aria-label="Productos anteriores"
                        className="hidden md:flex absolute top-[45%] -translate-y-1/2 -left-4 z-10 w-8 h-8 items-center justify-center rounded-full bg-white border border-[#c8dcc2] text-[#2D4A3E] shadow hover:bg-[#f0f5ec] transition"
                    >
                        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        onClick={() => swiperRef.current?.slideNext()}
                        aria-label="Productos siguientes"
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