
interface OnboardingScreenProps {
  onSelectRegister: () => void;
  onSelectLogin: () => void;
  onGoogleLogin: () => void;
}

export function OnboardingScreen({
  onSelectRegister,
  onSelectLogin,
  onGoogleLogin,
}: OnboardingScreenProps) {
  return (
    <div className="min-h-screen bg-[#DCE3DB] flex flex-col items-center justify-between p-8 md:p-12">
      
      {/* Contenido Central: Logo y Título */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto">
      
        <h1 className="text-5xl md:text-6xl font-serif text-[#537A63] tracking-tight">
          Aqui va el logo , no lo tengo 
        </h1>
      </div>

      {/* Contenedor Inferior de Botones */}
      <div className="w-full max-w-sm space-y-3 mb-4">
        {/* Fila de Registro y Login */}
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

        {/* Botón de Google */}

        {/*Aqui se creo el boton de Google de esta manera para que tenga cierta estetica con la app , tambien podriamos usar @react-oauth/google pero es mas estricto con la estetica*/ }
        <button
          onClick={onGoogleLogin}
          className="w-full py-3.5 rounded-full border border-[#4E705B]/60 text-[#2D4A3E] font-medium text-sm flex items-center justify-center gap-3 hover:bg-[#4E705B]/10 transition duration-200"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Login with Google</span>
        </button>
      </div>

    </div>
  );
}