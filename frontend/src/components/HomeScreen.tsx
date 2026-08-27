interface HomeScreenProps {
  email: string;
  onLogout: () => void;
  onEditProfile: () => void;
}

export function HomeScreen({ email, onLogout, onEditProfile }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-[#DFE5DC] flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-8 text-center">
        <h1 className="text-3xl font-bold text-[#2D4A3E] mb-2">Bienvenido</h1>
        <p className="text-sm text-[#2D4A3E]/70 mb-8">{email}</p>

        <button
          onClick={onEditProfile}
          className="w-full py-3.5 rounded-full bg-[#4E705B] text-white font-semibold text-sm hover:bg-[#3E5C4A] transition duration-200 mb-3"
        >
          Editar Perfil
        </button>

        <button
          onClick={onLogout}
          className="w-full py-3.5 rounded-full bg-transparent border border-[#4E705B] text-[#4E705B] font-semibold text-sm hover:bg-[#4E705B]/10 transition duration-200"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}