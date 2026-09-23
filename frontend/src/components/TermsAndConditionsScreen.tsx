import React from 'react';

interface TermsAndConditionsScreenProps {
  onBack: () => void;
}

export function TermsAndConditionsScreen({ onBack }: TermsAndConditionsScreenProps) {
  return (
    <div className="min-h-screen bg-[#DFE5DC] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm p-8 text-left">
        
        {/* Encabezado */}
        <h1 className="text-2xl font-bold text-[#2D4A3E] mb-2">
          Términos y Condiciones
        </h1>
        <p className="text-xs text-[#2D4A3E]/70 mb-6 border-b border-[#DFE5DC] pb-4">
          Última actualización: Septiembre 2026
        </p>

        {/* Contenido con scroll interno si es muy largo */}
        <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-4 text-sm text-[#2D4A3E]/80 leading-relaxed">
          <p>
            Bienvenido a <strong>Raíces</strong>. Al acceder y utilizar nuestra plataforma, aceptas cumplir con los siguientes términos y condiciones de uso.
          </p>

          <h2 className="font-semibold text-[#2D4A3E] text-base pt-2">1. Uso de la Plataforma</h2>
          <p>
            Este sitio web está destinado a la consulta y gestión de catálogo de plantas, productos e insumos botánicos. Queda prohibido cualquier uso indebido de las funciones del sistema.
          </p>

          <h2 className="font-semibold text-[#2D4A3E] text-base pt-2">2. Registro de Cuenta</h2>
          <p>
            Al crear una cuenta, el usuario se compromete a proporcionar información verídica y a mantener la confidencialidad de sus credenciales de acceso.
          </p>

          <h2 className="font-semibold text-[#2D4A3E] text-base pt-2">3. Proteccion de Datos</h2>
          <p>
            Tus datos personales serán tratados con estricta confidencialidad y procesados únicamente para la gestión de servicios dentro de la plataforma.
          </p>
        </div>

        {/* Botón de Regresar */}
        <div className="mt-8 pt-4 border-t border-[#DFE5DC]">
          <button
            onClick={onBack}
            className="w-full py-3.5 rounded-full bg-[#4E705B] text-white font-semibold text-sm hover:bg-[#3E5C4A] transition duration-200"
          >
            Volver
          </button>
        </div>

      </div>
    </div>
  );
}