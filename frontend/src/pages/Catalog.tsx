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
        <div className="min-h-screen bg-white flex flex-col justify-between">

            <div>
                <div className="sticky top-0 z-40">
                    <NavBar
                        onMenuClick={() => setMenuOpen(true)}
                    />
                    <BottomNav />
                </div>

                <Swiper
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
                <main className="p-4 sm:p-6">
                    <ProductList />
                </main>
            </div>

            {/* Pie de página */}
            <Footer />

            {/* Panel lateral, visible en toda la pantalla del catálogo */}
            <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>
    );
}