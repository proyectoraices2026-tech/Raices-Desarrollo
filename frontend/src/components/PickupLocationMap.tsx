import { ExternalLink, MapPin } from "lucide-react";

/* Cambiar cuando se tengan las coordenadas exactas del vivero*/
const MAP_QUERY = "Palmares, Alajuela, Costa Rica";
const EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`;

/* Enlace al lugar en Google Maps*/
const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/1UceLWL2Awn6eoP58";

/* Mapa de la ubicación del vivero.*/
export default function PickupLocationMap() {
  return (
    <section
      className="bg-white border border-[#e8efe4] rounded-2xl p-4 md:p-5 shadow-sm"
      aria-labelledby="pickup-map-title"
    >
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5 text-[#4E705B]" aria-hidden="true" />
        <h2 id="pickup-map-title" className="text-base font-bold text-[#1e2d24]">
          Ubicación del vivero
        </h2>
      </div>

      <div className="relative w-full h-72 md:h-96 rounded-xl overflow-hidden bg-[#f5f7f2] border border-[#e8efe4]">
        <iframe
          src={EMBED_URL}
          title="Mapa con la ubicación del vivero en Palmares, Alajuela"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full border-0"
        />
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir la ubicación del vivero en Google Maps"
          className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#4E705B]"
        />
      </div>

      <a
        href={GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D4A3E] hover:underline underline-offset-4"
      >
        Toca el mapa para abrirlo en Google Maps
        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
      </a>
    </section>
  );
}
