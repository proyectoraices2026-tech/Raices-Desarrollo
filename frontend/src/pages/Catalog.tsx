import { ProductList } from "../components/ProductList";
import { useState } from "react";
import SideMenu from "../components/SideMenu";
import BottomNav from "../components/BottomNav";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer"; 
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import BestSellers from "../components/BestSellers";
import "swiper/css";
import "swiper/css/pagination";

const BANNERS = [
    { src: "/Banner 1.png", position: "object-center" },
    { src: "/Banner 2.png", position: "object-center" },
    { src: "/Banner 3.png", position: "object-center" },
    { src: "/Banner 4.png", position: "object-left" },
    { src: "/Banner 5.png", position: "object-left" },
    { src: "/Banner 6.png", position: "object-[75%_center]" },
    { src: "/Banner 7.png", position: "object-right" },
    { src: "/Banner 8.png", position: "object-[75%_center]" },
    { src: "/Banner 9.png", position: "object-right" },
    { src: "/Banner 10.png", position: "object-center" },
];

/* Página privada que muestra el catálogo y las acciones disponibles para el rol */
export default function Catalog() {

    /* Controla si el panel lateral (menú) está abierto o cerrado */
    const [menuOpen, setMenuOpen] = useState(false);

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
                className="w-full min-w-0"
                modules={[Autoplay, Pagination]}
                autoplay={{ delay: 4000 }}
                pagination={{ clickable: true }}
                loop
            >
                {BANNERS.map((banner) => (
                    <SwiperSlide key={banner.src}>
                        <img
                            src={banner.src}
                            alt=""
                            className={`block w-full h-36 sm:h-44 md:h-auto md:aspect-[1506/275] object-cover ${banner.position}`}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            <BestSellers />

            {/* Contenido Principal */}
            <main id="catalogo" className="p-4 sm:p-6 flex-1 scroll-mt-20">
                <ProductList />
            </main>

            {/* Footer con información, contacto y ubicación */}
            <Footer />

            {/* Panel lateral, visible en toda la pantalla del catálogo */}
            <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>
    );
}