import logoImage from '../assets/Raiz.png';

interface OnboardingScreenProps {
  onSelectRegister: () => void;
  onSelectLogin: () => void;
}

export function OnboardingScreen({
  onSelectRegister,
  onSelectLogin,
}: OnboardingScreenProps) {
  return (
    <div className="min-h-screen bg-[#DCE3DB] flex flex-col items-center justify-between p-8 md:p-12">

      {/* Contenido Central: Logo */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto">
        <img
          src={logoImage}
          alt="Raíces Logo"
          className="w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 object-contain mx-auto"
        />
      </div>

      {/* Contenedor Inferior de Botones */}
      <div className="w-full max-w-sm space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onSelectRegister}
            className="w-full py-3.5 rounded-full border border-[#4E705B] text-[#4E705B] font-semibold text-sm hover:bg-[#4E705B]/10 transition duration-200"
          >
            Register
          </button>

          <button
            onClick={onSelectLogin}
            className="w-full py-3.5 rounded-full bg-[#4E705B] text-white font-semibold text-sm hover:bg-[#3E5C4A] transition duration-200"
          >
            Login
          </button>
        </div>
      </div>

    </div>
  );
}
