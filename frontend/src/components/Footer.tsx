import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

/* Datos de contacto en un solo lugar, para cambiarlos fácil cuando estén los definitivos */
const CONTACT_EMAIL = "proyectoraices2026@gmail.com";
const CONTACT_PHONE_DISPLAY = "+506 0000-0000";
const CONTACT_PHONE_HREF = "+50600000000";
const INSTAGRAM_URL = "https://www.instagram.com/raices_palmares";
const INSTAGRAM_HANDLE = "@raices_palmares";
const LOCATION = "Palmares, Alajuela, Costa Rica.";
/* Año de inicio y año actual; mientras sea el mismo año se muestra solo uno (ej. 2026-2026 queda como "2026") */
const START_YEAR = 2026;

/* lucide-react ya no incluye íconos de marcas, por eso el logo de Instagram va como SVG propio */
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const headingClass = "font-poppins text-base font-bold text-white mb-4";
const linkClass =
  "inline-flex items-center gap-2 text-sm text-verdePastel hover:text-white underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded";

/* Footer del catálogo: 3 secciones (información, contacto, ubicación) y la leyenda de derechos.
   En mobile se apilan una debajo de otra; desde md se acomodan de izquierda a derecha.
   El pb-24 en mobile deja espacio para que la barra de navegación fija de abajo no tape la leyenda. */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const lastYear = Math.max(currentYear, START_YEAR);
  const years = lastYear === START_YEAR ? `${START_YEAR}` : `${START_YEAR}-${lastYear}`;

  return (
    <footer className="bg-primarioOscuro text-white" aria-label="Información del sitio">
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-8 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
        <nav aria-labelledby="footer-info">
          <h2 id="footer-info" className={headingClass}>Información</h2>
          <ul className="space-y-3">
            <li>
              <Link to="/about" className={linkClass}>Sobre nosotros</Link>
            </li>
            <li>
              <Link to="/terms" className={linkClass}>Términos y condiciones</Link>
            </li>
          </ul>
        </nav>

        <section aria-labelledby="footer-contact">
          <h2 id="footer-contact" className={headingClass}>Contáctenos</h2>
          <ul className="space-y-3">
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`} className={`${linkClass} break-all`}>
                <Mail className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a href={`tel:${CONTACT_PHONE_HREF}`} className={linkClass}>
                <Phone className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                {CONTACT_PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <InstagramIcon className="w-4 h-4 flex-shrink-0" />
                Instagram {INSTAGRAM_HANDLE}
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </li>
          </ul>
        </section>

        <section aria-labelledby="footer-location">
          <h2 id="footer-location" className={headingClass}>Ubicación</h2>
          <p className="flex items-start gap-2 text-sm text-verdePastel">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
            {LOCATION}
          </p>
        </section>
      </div>

      <div className="border-t border-white/15">
        <p className="max-w-5xl mx-auto px-6 pt-5 pb-24 md:pb-5 text-center text-xs text-verdePastel">
          © {years} Raíces Team. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
