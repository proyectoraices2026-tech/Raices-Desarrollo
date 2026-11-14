import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Mail, MapPin, Phone, Compass } from "lucide-react";
import NavBar from "../components/NavBar";
import BottomNav from "../components/BottomNav";
import SideMenu from "../components/SideMenu";
import Footer from "../components/Footer";
import { ArrowNavigateUp } from "../components/ArrowNavigateUp";
import { EMBED_URL, PICKUP_GOOGLE_MAPS_URL } from "../utils/pickupLocation";

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

interface TeamMember {
  name: string;
  role: string;
  contribution: string;
  /* Enlace al perfil de LinkedIn (opcional) */
  linkedinUrl?: string;
  /* Ruta o URL de la foto (opcional). Sin foto se muestra el recuadro "Foto" del diseño */
  photo?: string;
}

/* Equipo de desarrollo: reemplazar cada tarjeta con los datos reales de la persona.
   Mientras tanto se muestran los textos de ejemplo del diseño de Figma. */
const TEAM: TeamMember[] = [
  { name: "Nombre", role: "Rol", contribution: "Aporte" },
  { name: "Nombre", role: "Rol", contribution: "Aporte" },
  { name: "Nombre", role: "Rol", contribution: "Aporte" },
  { name: "Nombre", role: "Rol", contribution: "Aporte" },
  { name: "Nombre", role: "Rol", contribution: "Aporte" },
  { name: "Nombre", role: "Rol", contribution: "Aporte" },
];

const cardClass = "bg-white border border-[#d8e0d8] rounded-3xl";
const iconCircleClass =
  "w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#eaf1ec] text-[#527a65] flex items-center justify-center flex-shrink-0";
const contactLinkClass =
  "break-words hover:underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#527a65] rounded";
/* En mobile la etiqueta y el dato van en dos líneas; en escritorio, en una sola */
const labelClass = "block md:inline text-base md:text-lg";
const valueClass = "text-[15px] md:text-lg";

/* Mismo mapa de Google que se muestra en "Mis pedidos" (misma ubicación del vivero) */
function LocationMap() {
  return (
    <div className="relative h-[240px] md:h-[320px] overflow-hidden rounded-[20px] border border-[#d8e0d8] bg-[#eef0e9]">
      <iframe
        src={EMBED_URL}
        title="Mapa con la ubicación del vivero en Palmares, Alajuela"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 w-full h-full border-0"
      />
      <a
        href={PICKUP_GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Abrir la ubicación del vivero en Google Maps (se abre en una pestaña nueva)"
        className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#527a65]"
      />
    </div>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className={`${cardClass} p-4 md:p-6 flex flex-col gap-4`}>
      <div className="h-40 rounded-2xl bg-[#eaf1ec] border border-[#d8e0d8] flex items-center justify-center overflow-hidden">
        {member.photo ? (
          <img src={member.photo} alt={`Foto de ${member.name}`} className="w-full h-full object-cover" />
        ) : (
          <span className="text-lg md:text-xs font-bold text-[#527a65]">Foto</span>
        )}
      </div>
      <div className="flex flex-col gap-2 min-w-0">
        <h3 className="text-xl font-bold text-[#0b2525] break-words">{member.name}</h3>
        <p className="text-sm font-bold text-[#527a65] break-words">{member.role}</p>
        <p className="text-sm leading-[22px] text-[#0b2525] break-words">{member.contribution}</p>
        {member.linkedinUrl ? (
          <a
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm leading-[22px] text-[#527a65] hover:underline underline-offset-4"
          >
            LinkedIn
            <span className="sr-only"> de {member.name} (se abre en una pestaña nueva)</span>
          </a>
        ) : (
          <p className="text-sm leading-[22px] text-[#527a65]">LinkedIn</p>
        )}
      </div>
    </article>
  );
}

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

      <main id="first" className="w-full flex-1 max-w-[1680px] mx-auto px-5 pt-7 pb-10 md:px-12 md:py-12 xl:px-[120px] flex flex-col gap-6 md:gap-10">
        <div className="flex items-center gap-3 md:gap-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#eaf1ec] text-[#527a65] flex items-center justify-center flex-shrink-0 hover:bg-[#dbe8df] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#527a65]"
            aria-label="Volver a la página anterior"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <h1 className="font-poppins text-[28px] leading-[34px] md:text-5xl font-bold text-[#0b2525]">Sobre nosotros</h1>
        </div>

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-12 lg:items-start">
          {/* Columna principal: misión, contacto y mapa */}
          <div className="contents lg:flex lg:flex-col lg:gap-8 lg:min-w-0">
            <section className={`${cardClass} p-5 md:p-8 flex flex-col gap-4 md:gap-5 lg:order-none`} aria-labelledby="about-mission">
              <h2 id="about-mission" className="text-lg font-bold text-[#527a65]">Nuestra misión</h2>
              <p className="text-base md:text-[22px] leading-[26px] md:leading-[34px] text-[#0b2525]">
                Raíces es un proyecto pensado para aquellas personas amantes de las plantas, que quieran hacer crecer su colección de plantas y aprender a cuidarlas.
                Nuestra misión es brindar una plataforma donde los usuarios puedan ver y comprar plantas, además de poder monitorear el estado de sus plantas; recibiendo recordatorios de riego y fertilización.
              </p>
            </section>

            <section className={`${cardClass} p-5 md:p-8 flex flex-col gap-5 md:gap-6`} aria-labelledby="about-contact">
              <h2 id="about-contact" className="font-poppins text-[22px] leading-7 md:text-[28px] font-bold text-[#0b2525]">Contáctenos</h2>

              {/* Correo */}
              <div className="flex items-center gap-3 md:gap-4">
                <span className={iconCircleClass}>
                  <Mail className="w-5 h-5" aria-hidden="true" />
                </span>
                <p className="min-w-0 text-[#0b2525] leading-6 md:leading-7">
                  <span className={labelClass}>Correo:</span>{" "}
                  <a href={`mailto:${CONTACT_EMAIL}`} className={`${contactLinkClass} ${valueClass}`}>
                    {CONTACT_EMAIL}
                  </a>
                </p>
              </div>

              {/* Ubicación Google Maps + Waze */}
              <div className="flex items-center gap-3 md:gap-4">
                <span className={iconCircleClass}>
                  <MapPin className="w-5 h-5" aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-1 text-[#0b2525] leading-6 md:leading-7 min-w-0">
                  <p>
                    <span className={labelClass}>Ubicación:</span>{" "}
                    <a
                      href={GOOGLE_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${contactLinkClass} ${valueClass}`}
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
              <div className="flex items-center gap-3 md:gap-4">
                <span className={iconCircleClass}>
                  <Phone className="w-5 h-5" aria-hidden="true" />
                </span>
                <p className="min-w-0 text-[#0b2525] leading-6 md:leading-7">
                  <span className={labelClass}>Número de teléfono:</span>{" "}
                  <a
                    href={CONTACT_PHONE_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${contactLinkClass} ${valueClass}`}
                  >
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                  <span className="sr-only"> (abre chat de WhatsApp)</span>
                </p>
              </div>
            </section>

            <section className={`${cardClass} p-4 md:p-6 flex flex-col gap-4 md:gap-4`} aria-labelledby="about-map">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <h2 id="about-map" className="font-poppins text-[22px] leading-7 font-bold text-[#0b2525]">Ubicación en mapa</h2>
                <p className="text-sm font-medium text-[#527a65]">Aproximada</p>
              </div>
              <LocationMap />
            </section>
          </div>

          {/* Columna lateral: resumen y funcionalidades */}
          <aside className="flex flex-col gap-5 min-w-0">
            <div className="bg-[#527a65] rounded-3xl p-6 md:p-7 flex flex-col gap-4 lg:min-h-[320px]">
              <p className="font-poppins text-[28px] leading-[34px] font-bold text-white">Raíces</p>
              <p className="text-lg leading-7 text-white/80">
                Una plataforma pensada para cuidar tu colección de plantas y hacerla crecer con recordatorios, seguimiento y compra de especies.
              </p>
            </div>

            <section className={`${cardClass} p-5 md:p-6 flex flex-col gap-4`} aria-labelledby="about-features">
              <h2 id="about-features" className="font-poppins text-[22px] leading-7 font-bold text-[#0b2525]">Funcionalidades</h2>
              <ul className="flex flex-col gap-3">
                {FEATURES.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-base text-[#0b2525]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#527a65] flex-shrink-0" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>

        {/* Equipo de desarrollo: en mobile va dentro de una tarjeta; en escritorio, a todo el ancho */}
        <section
          className="bg-white border border-[#d8e0d8] rounded-3xl p-5 flex flex-col gap-5 md:bg-transparent md:border-0 md:rounded-none md:p-0 md:gap-6 md:mt-4"
          aria-labelledby="about-team"
        >
          <div className="flex flex-col gap-2">
            <h2 id="about-team" className="font-poppins text-[28px] leading-[34px] md:text-[32px] font-bold text-[#0b2525]">Equipo de desarrollo</h2>
            <p className="text-base text-[#527a65]">Conoce a las personas detrás de Raíces y su aporte al proyecto.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 2xl:grid-cols-6">
            {TEAM.map((member, i) => (
              <TeamCard key={`${member.name}-${i}`} member={member} />
            ))}
          </div>
        </section>
      </main>

      <ArrowNavigateUp handleUpNavigate={handleScrollUp} />
      <Footer />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
