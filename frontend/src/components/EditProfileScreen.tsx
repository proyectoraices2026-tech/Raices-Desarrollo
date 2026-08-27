import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface EditProfileScreenProps {
  currentName: string;
  currentEmail: string;
  onSave: (data: { name: string; email: string }) => Promise<void>;
  onBack: () => void;
}

export function EditProfileScreen({
  currentName,
  currentEmail,
  onSave,
  onBack,
}: EditProfileScreenProps) {
  const [name, setName] = useState(currentName);
  const [email, setEmail] = useState(currentEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await onSave({ name, email });
      setSuccess(
        email !== currentEmail
          ? 'Perfil actualizado. Para confirmar el cambio de correo primero revisa tu correo antiguo y confirma el cambio, luego ve al correo nuevo y confirma que el correo es tuyo.'
          : 'Perfil actualizado correctamente.'
      );
    } catch (err: any) {
      setError(err.message ?? 'Ocurrió un error al guardar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#DFE5DC] flex flex-col justify-between p-6 md:p-12 relative">
      <button
          onClick={onBack}
          className="absolute p-2 text-[#3E5C4A] hover:bg-[#4E705B]/10 rounded-full transition duration-200"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto my-auto py-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#2D4A3E] text-center mb-8">
          Editar perfil
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#2D4A3E] mb-1">Nombre</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4E705B] text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2D4A3E] mb-1">Correo electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#4E705B] text-sm transition"
            />
          </div>

          {error && <p className="text-xs text-red-600 font-semibold text-center pt-1">{error}</p>}
          {success && <p className="text-xs text-[#3E5C4A] font-semibold text-center pt-1">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#4E705B] text-white font-semibold text-sm hover:bg-[#3E5C4A] transition duration-200 mt-4 disabled:opacity-60"
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>

      <div className="h-4" />
    </div>
  );
}