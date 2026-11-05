import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import NavBar from "../components/NavBar";
import BottomNav from "../components/BottomNav";
import SideMenu from "../components/SideMenu";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

export default function TermsAndConditions() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { role } = useAuth();
  /* Con sesión iniciada se ve la barra inferior fija (celular), igual que en "Sobre nosotros".
     Sin sesión no hay barra inferior: max-md:-mb-[4.5rem] cancela el espacio que index.css le agrega
     al final del body y que dejaría una franja blanca bajo el footer */
  const hasBottomNav = !!role;

  return (
    <div className={`min-h-screen bg-white flex flex-col ${hasBottomNav ? "" : "max-md:-mb-[4.5rem]"}`}>
      <div className="sticky top-0 z-40">
        <NavBar onMenuClick={() => setMenuOpen(true)} />
        <BottomNav />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white border border-[#e8efe4] rounded-2xl shadow-sm p-8 text-left relative">

        {/* Encabezado, con la misma flecha de volver que "Sobre nosotros" */}
        <div className="flex items-center gap-4 mb-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-[#eaf1ec] text-[#527a65] flex items-center justify-center flex-shrink-0 hover:bg-[#dbe8df] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#527a65]"
            aria-label="Volver a la página anterior"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <h1 className="text-2xl font-bold text-[#2D4A3E]">
            Términos y Condiciones
          </h1>
        </div>
        <p className="text-xs text-[#2D4A3E]/70 mb-6 border-b border-[#DFE5DC] pb-4">
          Última actualización: Septiembre 2026
        </p>

        {/* Contenido con scroll interno */}
        <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-4 text-sm text-[#2D4A3E]/80 leading-relaxed">
          <p>
            Bienvenido a <strong>Raíces</strong>. Al acceder y utilizar nuestra plataforma, aceptas cumplir con los siguientes términos y condiciones de uso.
          </p>

          <h2 className="font-semibold text-[#2D4A3E] text-base pt-2">1. Uso del Catálogo y Compras en Línea</h2>
          <p>
            Nuestra plataforma te permite explorar el catálogo de plantas, productos e insumos botánicos de nuestro vivero y realizar compras de manera directa. Nos reservamos el derecho de actualizar la disponibilidad de stock, productos y precios sin previo aviso.
          </p>

          <h2 className="font-semibold text-[#2D4A3E] text-base pt-2">2. Gestión de "Mis Plantas" y Recordatorios de Cuidado</h2>
          <p>
            Ofrecemos a nuestros usuarios registrados una herramienta de gestión personal donde pueden registrar sus propias plantas, organizar bitácoras y programar recordatorios periódicos para el riego, abonado y cuidado general. La exactitud de la información cargada en esta sección depende únicamente del usuario.
          </p>

          <h2 className="font-semibold text-[#2D4A3E] text-base pt-2">3. Registro y Seguridad de la Cuenta</h2>
          <p>
            Al crear una cuenta, te comprometes a proporcionar datos verídicos y a mantener la confidencialidad de tu contraseña. Eres responsable de las actividades que se realicen dentro de tu perfil.
          </p>

          <h2 className="font-semibold text-[#2D4A3E] text-base pt-2">4. Protección de Datos Personales</h2>
          <p>
            Tus datos de usuario y el registro de tus plantas serán tratados con estricta confidencialidad y procesados exclusivamente para brindarte una mejor experiencia dentro de la plataforma.
          </p>
        </div>

      </div>
      </div>

      <Footer reserveBottomNav={hasBottomNav} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}
