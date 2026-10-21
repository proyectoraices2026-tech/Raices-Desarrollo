import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Mail, MapPin, Phone, Compass } from "lucide-react";
import NavBar from "../components/NavBar";
import BottomNav from "../components/BottomNav";
import SideMenu from "../components/SideMenu";
import Footer from "../components/Footer";
import { ArrowNavigateUp } from "../components/ArrowNavigateUp";

const CONTACT_EMAIL = "proyectoraices2026@gmail.com";
const CONTACT_PHONE_DISPLAY = "+506 8661-3636";
const CONTACT_PHONE_HREF = "https://wa.me/50686613636";
const LOCATION_TEXT = "Palmares, Alajuela, Costa Rica";
const GOOGLE_MAPS_URL = "https://maps.google.com/?q=Palmares,+Alajuela,+Costa+Rica";
const WAZE_URL = "https://waze.com/ul?q=Palmares+Alajuela+Costa+Rica";

const FEATURES = [
  "Explorar plantas y comprar especies",
  "Monitorear el estado de tus plantas",
  "Recibir recordatorios de riego y fertilización",
];

const cardClass = "bg-white border border-[#d8e0d8] rounded-3xl p-6 md:p-8";
const iconCircleClass =
  "w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#eaf1ec] text-[#527a65] flex items-center justify-center flex-shrink-0";
const contactLinkClass =
  "text-base text-[#0b2525] break-words hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#527a65] rounded";

export default function AboutUs() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScrollUp = () => {
    document.getElementById("first")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="sticky top-0 z-40">
        <NavBar onMenuClick={() => setMenuOpen(true)} />
        <BottomNav />
      </div>

      <main id="first" className="w-full flex-1 max-w-[1680px] mx-auto px-5 py-6 md:px-12 md:py-12 xl:px-[120px] flex flex-col gap-8 md:gap-10">
        <div className="flex items-center gap-4 md:gap-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#eaf1ec] text-[#527a65] flex items-center justify-center flex-shrink-0 hover:bg-[#dbe8df] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#527a65]"
            aria-label="Volver a la página anterior"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <h1 className="font-poppins text-2xl md:text-3xl font-bold text-[#0b2525]">Sobre nosotros</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-8 lg:gap-12 items-start">
          {/* Columna principal */}
          <div className="flex flex-col gap-6 md:gap-8 min-w-0">
            <section className={`${cardClass} flex flex-col gap-4`} aria-labelledby="about-mission">
              <h2 id="about-mission" className="text-base md:text-lg font-bold text-[#527a65]">Nuestra misión</h2>
              <p className="text-base md:text-lg leading-7 text-[#0b2525]">
                Raíces es un proyecto pensado para aquellas personas amantes de las plantas, que quieran hacer crecer su colección de plantas y aprender a cuidarlas.
                Nuestra misión es brindar una plataforma donde los usuarios puedan ver y comprar plantas, además de poder monitorear el estado de sus plantas; recibiendo recordatorios de riego y fertilización.
              </p>
            </section>

            <section className={`${cardClass} flex flex-col gap-5 md:gap-6`} aria-labelledby="about-contact">
              <h2 id="about-contact" className="font-poppins text-xl md:text-2xl font-bold text-[#0b2525]">Contáctenos</h2>

              {/* Correo */}
              <div className="flex items-center gap-4">
                <span className={iconCircleClass}>
                  <Mail className="w-5 h-5" aria-hidden="true" />
                </span>
                <p className="min-w-0 text-base text-[#0b2525]">
                  Correo:{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className={contactLinkClass}>
                    {CONTACT_EMAIL}
                  </a>
                </p>
              </div>

              {/* Ubicación Google Maps + Waze */}
              <div className="flex items-start gap-4">
                <span className={iconCircleClass}>
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-1 text-base text-[#0b2525]">
                  <p>
                    Ubicación:{" "}
                    <a
                      href={GOOGLE_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={contactLinkClass}
                    >
                      {LOCATION_TEXT}
                    </a>
                  </p>
                  <a
                    href={WAZE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#527a65] font-semibold hover:underline"
                  >
                    <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                    Abrir en Waze
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-4">
                <span className={iconCircleClass}>
                  <Phone className="w-5 h-5" aria-hidden="true" />
                </span>
                <p className="min-w-0 text-base text-[#0b2525]">
                  WhatsApp / Teléfono:{" "}
                  <a
                    href={CONTACT_PHONE_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={contactLinkClass}
                  >
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </p>
              </div>
            </section>
          </div>

          {/* Columna lateral */}
          <aside className="flex flex-col gap-5 min-w-0">
            <div className="bg-[#527a65] rounded-3xl p-6 md:p-7 flex flex-col gap-3 md:gap-4 lg:min-h-[280px]">
              <p className="font-poppins text-2xl font-bold text-white">Raíces</p>
              <p className="text-base leading-6 text-white/90">
                Una plataforma pensada para cuidar tu colección de plantas y hacerla crecer con recordatorios, seguimiento y compra de especies.
              </p>
            </div>

            <section className={`${cardClass} !p-6 flex flex-col gap-4`} aria-labelledby="about-features">
              <h2 id="about-features" className="font-poppins text-lg md:text-xl font-bold text-[#0b2525]">Funcionalidades</h2>
              <ul className="flex flex-col gap-3">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm md:text-base text-[#0b2525]">
                    <span className="w-2 h-2 rounded-full bg-[#527a65] flex-shrink-0" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </main>

      <ArrowNavigateUp handleUpNavigate={handleScrollUp} />
      <Footer />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
