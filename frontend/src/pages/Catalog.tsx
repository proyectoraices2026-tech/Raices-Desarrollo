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
import "swiper/css";
import "swiper/css/pagination";

const BANNERS = [
    { src: "/Banner 1.png", mobileSrc: "/Banner 1 Mobile.png", position: "object-center" },
    { src: "/Banner 2.png", mobileSrc: "/Banner 2 Mobile.png", position: "object-center" },
    { src: "/Banner 3.png", mobileSrc: "/Banner 3 Mobile.png", position: "object-center" },
    { src: "/Banner 4.png", mobileSrc: "/Banner 4 Mobile.png", position: "object-center" },
    { src: "/Banner 5.png", mobileSrc: "/Banner 5 Mobile.png", position: "object-center" },
    { src: "/Banner 6.png", mobileSrc: "/Banner 6 Mobile.png", position: "object-center" },
    { src: "/Banner 7.png", mobileSrc: "/Banner 7 Mobile.png", position: "object-center" },
    { src: "/Banner 8.png", mobileSrc: "/Banner 8 Mobile.png", position: "object-center" },
    { src: "/Banner 9.png", mobileSrc: "/Banner 9 Mobile.png", position: "object-center" },
];

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
                {BANNERS.map((banner) => (
                    <SwiperSlide key={banner.src}>
                        <picture className="block w-full">
                            <source media="(max-width: 767px)" srcSet={encodeURI(banner.mobileSrc)} />
                            <img
                                src={banner.src}
                                alt=""
                                className={`block w-full h-auto md:aspect-[1506/271] md:object-cover ${banner.position}`}
                            />
                        </picture>
                    </SwiperSlide>
                ))}
            </Swiper>

            <BestSellers />

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