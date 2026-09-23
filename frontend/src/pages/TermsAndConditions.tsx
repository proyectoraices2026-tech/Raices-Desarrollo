import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function TermsAndConditions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#DFE5DC] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm p-8 text-left relative">
        
        {/* Botón con Flecha para regresar */}
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 mb-2 text-[#3E5C4A] rounded-full hover:bg-[#DFE5DC]/50 transition duration-150 inline-flex items-center justify-center"
          aria-label="Volver a la página anterior"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Encabezado */}
        <h1 className="text-2xl font-bold text-[#2D4A3E] mb-2">
          Términos y Condiciones
        </h1>
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

        {/* Botón inferior de Regresar */}
        <div className="mt-8 pt-4 border-t border-[#DFE5DC]">
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3.5 rounded-full bg-[#4E705B] text-white font-semibold text-sm hover:bg-[#3E5C4A] transition duration-200"
          >
            Volver
          </button>
        </div>

      </div>
    </div>
  );
}