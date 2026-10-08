import { ProductList } from "../components/ProductList";
import { useState } from "react";
import SideMenu from "../components/SideMenu";
import BottomNav from "../components/BottomNav";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer"; 
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

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
                <SwiperSlide><img src="/Banner 1.png" alt="" className="block w-full aspect-[1506/275] object-cover"/></SwiperSlide>
                <SwiperSlide><img src="/Banner 2.png" alt="" className="block w-full aspect-[1506/275] object-cover"/></SwiperSlide>
                <SwiperSlide><img src="/Banner 3.png" alt="" className="block w-full aspect-[1506/275] object-cover"/></SwiperSlide>
                <SwiperSlide><img src="/Banner 4.png" alt="" className="block w-full aspect-[1506/275] object-cover"/></SwiperSlide>
                <SwiperSlide><img src="/Banner 5.png" alt="" className="block w-full aspect-[1506/275] object-cover"/></SwiperSlide>
                <SwiperSlide><img src="/Banner 6.png" alt="" className="block w-full aspect-[1506/275] object-cover"/></SwiperSlide>
                <SwiperSlide><img src="/Banner 7.png" alt="" className="block w-full aspect-[1506/275] object-cover"/></SwiperSlide>
                <SwiperSlide><img src="/Banner 8.png" alt="" className="block w-full aspect-[1506/275] object-cover"/></SwiperSlide>
                <SwiperSlide><img src="/Banner 9.png" alt="" className="block w-full aspect-[1506/275] object-cover"/></SwiperSlide>
                <SwiperSlide><img src="/Banner 10.png" alt="" className="block w-full aspect-[1506/275] object-cover"/></SwiperSlide>
            </Swiper>

            {/* Contenido Principal */}
            <main className="p-4 sm:p-6 flex-1">
                <ProductList />
            </main>

            {/* Footer con información, contacto y ubicación */}
            <Footer />

            {/* Panel lateral, visible en toda la pantalla del catálogo */}
            <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>
    );
}