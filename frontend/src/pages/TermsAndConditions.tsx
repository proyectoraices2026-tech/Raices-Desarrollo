import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

/* Página pendiente de contenido (tarea #7 del backlog: redactar términos y condiciones).
   Existe ya para que el link del registro tenga a dónde ir. */
export default function TermsAndConditions() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f5f7f2] p-6">
      <button
        onClick={() => navigate(-1)}
        className="p-2 -ml-2 mb-4 text-[#3E5C4A] rounded-full hover:bg-[#4E705B]/10"
        aria-label="Volver a la página anterior"
      >
        <ArrowLeft className="w-6 h-6" aria-hidden="true" />
      </button>

      <div className="md:max-w-3xl md:mx-auto">
        <h1 className="text-2xl font-bold text-[#1e2d24] mb-4">Términos y condiciones de uso</h1>
        <p className="text-sm text-[#537a63] leading-relaxed">
          Este contenido está pendiente de redacción por parte del equipo.
        </p>
      </div>
    </div>
  );
}
