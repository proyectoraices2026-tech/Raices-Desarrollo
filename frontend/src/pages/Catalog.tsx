import { ProductList } from "../components/ProductList";
import { useState } from "react";
import SideMenu from "../components/SideMenu";
import BottomNav from "../components/BottomNav";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { ArrowNavigateUp } from "../components/ArrowNavigateUp";
import BestSellers from "../components/BestSellers";
import PetSafeSlider from "../components/PetSafeSlider";
import "swiper/css";
import "swiper/css/pagination";

const BANNERS = Array.from({ length: 9 }, (_, i) => ({
    src: `/banner-${i + 1}.webp`,
    mobileSrc: `/banner-${i + 1}-mobile.webp`,
}));

/* Página privada que muestra el catálogo y las acciones disponibles para el rol */
export default function Catalog() {

    /* Controla si el panel lateral (menú) está abierto o cerrado */
    const [menuOpen, setMenuOpen] = useState(false);

    /* Lleva al usuario hasta el principio de la página buscando el primer elemento de la misma (id="first") */
    const handleScrollUp = () => {
        document.getElementById("first")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">

            <div className="sticky top-0 z-40">
                <NavBar
                    onMenuClick={() => setMenuOpen(true)}
                />
                <BottomNav />
            </div>

            {/* w-full + min-w-0: dentro de un contenedor flex, Swiper sin esto calcula un ancho gigante */}
            <Swiper
                id="first"
                className="catalog-banner-slider w-full min-w-0"
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000 }}
                pagination={{ clickable: true }}
                loop
            >
                                {BANNERS.map((banner, index) => (
                    <SwiperSlide key={banner.src}>
                        <picture className="block w-full aspect-[401/209] md:aspect-[1506/271]">
                            <source media="(max-width: 767px)" srcSet={banner.mobileSrc} />
                            <img
                                src={banner.src}
                                alt=""
                                width={1506}
                                height={271}
                                loading={index === 0 ? "eager" : "lazy"}
                                fetchPriority={index === 0 ? "high" : "auto"}
                                decoding="async"
                                className="block w-full h-full object-cover object-center"
                            />
                        </picture>
                    </SwiperSlide>
                ))}
                
            </Swiper>

            <BestSellers />

            <PetSafeSlider />

            {/* Contenido Principal */}
            <main id="catalogo" className="p-4 sm:p-6 flex-1 scroll-mt-20">
                <ProductList />
            </main>

            <ArrowNavigateUp handleUpNavigate={handleScrollUp}></ArrowNavigateUp>

            {/* Footer con información, contacto y ubicación */}
            <Footer />

            {/* Panel lateral, visible en toda la pantalla del catálogo */}
            <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>
    );
}