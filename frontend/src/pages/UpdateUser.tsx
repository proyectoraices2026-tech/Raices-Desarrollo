import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { logAuthError } from "../lib/logger";

/* Página privada para editar el nombre y correo del usuario actual */
export default function UpdateUser() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    /* Carga los datos del usuario y su perfil cuando existe una sesión */
    useEffect(() => {
        if (user) {
            setEmail(user.email ?? "");

            /* Consulta el nombre guardado en el perfil relacionado */
            supabase
                .from("profiles")
                .select("name")
                .eq("id", user.id)
                .single()
                .then(({ data }) => {
                    if (data) setName(data.name ?? "");
                });
        }
    }, [user]);

    /* Actualiza el correo de autenticación y el nombre del perfil */
    const handleUpdate = async () => {
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            /* El cambio de correo requiere confirmación desde los correos recibidos */
            if (email !== user?.email) {
                const { error: emailError } = await supabase.auth.updateUser({ email });
                if (emailError) throw emailError;
            }

            /* Guarda el nombre y la fecha de modificación en el perfil */
            const { error: profileError } = await supabase
                .from("profiles")
                .update({ name, updated_at: new Date().toISOString() })
                .eq("id", user?.id);

            if (profileError) throw profileError;

            /* Muestra un mensaje diferente si también se solicitó cambiar el correo */
            setSuccess("Perfil actualizado correctamente.");

            if (email !== user?.email) {
                setSuccess(
                    "Perfil actualizado. Para confirmar el cambio de correo primero revisa tu correo antiguo y confirma el cambio, luego ve al correo nuevo y confirma que el correo es tuyo."
                );
            }
        } catch (err: any) {
            /* Registra y muestra cualquier error de autenticación o base de datos */
            logAuthError("update-profile", err);
            setError(err.message);
        } finally {
            /* Reactiva los controles al finalizar la actualización */
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#DFE5DC] flex flex-col justify-between p-6 md:p-12 relative">

            <div className="w-full max-w-sm mx-auto flex items-center justify-start pt-2">
                <button
                    onClick={() => navigate("/home")}
                    className="p-2 text-[#3E5C4A] hover:bg-[#4E705B]/10 rounded-full transition duration-200"
                    title="Volver"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
            </div>

            <div className="w-full max-w-sm mx-auto my-auto py-8">
                <h1 className="text-3xl md:text-4xl font-bold text-[#2D4A3E] text-center mb-8">
                    Editar perfil
                </h1>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-[#2D4A3E] mb-1.5">
                            Nombre
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Tu nombre"
                            className="w-full px-4 py-3 bg-white border border-transparent rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4E705B] text-sm transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#2D4A3E] mb-1.5">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Tu correo"
                            className="w-full px-4 py-3 bg-white border border-transparent rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4E705B] text-sm transition"
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-600 font-semibold text-center pt-1">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="text-xs text-[#3E5C4A] font-semibold text-center pt-1">
                            {success}
                        </p>
                    )}

                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="w-full py-3.5 rounded-full bg-[#4E705B] text-white font-semibold text-sm hover:bg-[#3E5C4A] transition duration-200 mt-4 disabled:opacity-60"
                    >
                        {loading ? "Guardando..." : "Guardar cambios"}
                    </button>

                    <button
                        onClick={() => navigate("/home")}
                        className="w-full py-3.5 rounded-full bg-transparent border border-[#4E705B] text-[#4E705B] font-semibold text-sm hover:bg-[#4E705B]/10 transition duration-200"
                    >
                        Volver
                    </button>
                </div>
            </div>

            <div className="h-6"></div>
        </div>
    );
}
