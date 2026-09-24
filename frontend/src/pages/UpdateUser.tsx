import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { logAuthError } from "../lib/logger";
import NavBar from "../components/NavBar";
import SideMenu from "../components/SideMenu";

/* Página privada para editar el nombre, correo, teléfono y dirección del usuario actual */
export default function UpdateUser() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    /* Carga los datos del usuario y su perfil cuando existe una sesión */
    useEffect(() => {
        if (user) {
            setEmail(user.email ?? "");

            supabase
                .from("profiles")
                .select("name, phone, address")
                .eq("id", user.id)
                .single()
                .then(({ data }) => {
                    const fullName = data?.name ?? "";
                    const [first, ...rest] = fullName.split(" ");
                    setFirstName(first ?? "");
                    setLastName(rest.join(" "));
                    setPhone(data?.phone ?? "");
                    setAddress(data?.address ?? "");
                });
        }
    }, [user]);

    /* Actualiza el correo de autenticación y los datos del perfil */
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

            const name = `${firstName} ${lastName}`.trim();

            /* Guarda nombre, teléfono, dirección y la fecha de modificación en el perfil */
            const { error: profileError } = await supabase
                .from("profiles")
                .update({
                    name,
                    phone,
                    address,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user?.id);

            if (profileError) throw profileError;

            setSuccess("Perfil actualizado correctamente.");

            if (email !== user?.email) {
                setSuccess(
                    "Perfil actualizado. Para confirmar el cambio de correo primero revisa tu correo antiguo y confirma el cambio, luego ve al correo nuevo y confirma que el correo es tuyo."
                );
            }
        } catch (err: any) {
            logAuthError("update-profile", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#DFE5DC] flex flex-col relative">
            <NavBar onMenuClick={() => setMenuOpen(true)} />
            <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

            <div className="w-full max-w-sm sm:max-w-lg md:max-w-xl mx-auto my-auto py-8 px-6 md:px-12">
                <button
                    onClick={() => navigate("/my-plants")}
                    className="p-2 -ml-2 mb-4 text-[#3E5C4A] rounded-full hover:bg-[#4E705B]/10"
                    aria-label="Volver a Mis Plantas"
                >
                    <ArrowLeft className="w-6 h-6" aria-hidden="true" />
                </button>

                <h1 className="text-3xl md:text-4xl font-bold text-[#2D4A3E] text-center mb-8">
                    Editar perfil
                </h1>

                <div className="space-y-5">
                    <div className="md:grid md:grid-cols-2 md:gap-x-5 space-y-5 md:space-y-0">
                        <div>
                            <label htmlFor="profile-first-name" className="block text-sm font-semibold text-[#2D4A3E] mb-1.5">
                                Nombre
                            </label>
                            <input
                                id="profile-first-name"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Tu nombre"
                                className="w-full px-4 py-3 bg-white border border-transparent rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4E705B] text-sm transition"
                            />
                        </div>

                        <div>
                            <label htmlFor="profile-last-name" className="block text-sm font-semibold text-[#2D4A3E] mb-1.5">
                                Apellido
                            </label>
                            <input
                                id="profile-last-name"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Tu apellido"
                                className="w-full px-4 py-3 bg-white border border-transparent rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4E705B] text-sm transition"
                            />
                        </div>
                    </div>

                    <div className="md:grid md:grid-cols-2 md:gap-x-5 space-y-5 md:space-y-0">
                        <div>
                            <label htmlFor="profile-email" className="block text-sm font-semibold text-[#2D4A3E] mb-1.5">
                                Correo electrónico
                            </label>
                            <input
                                id="profile-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Tu correo"
                                className="w-full px-4 py-3 bg-white border border-transparent rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4E705B] text-sm transition"
                            />
                        </div>

                        <div>
                            <label htmlFor="profile-phone" className="block text-sm font-semibold text-[#2D4A3E] mb-1.5">
                                Número de teléfono
                            </label>
                            <input
                                id="profile-phone"
                                type="text"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="8888-8888"
                                className="w-full px-4 py-3 bg-white border border-transparent rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4E705B] text-sm transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="profile-address" className="block text-sm font-semibold text-[#2D4A3E] mb-1.5">
                            Dirección
                        </label>
                        <input
                            id="profile-address"
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Ingresa la dirección en la que reside actualmente"
                            className="w-full px-4 py-3 bg-white border border-transparent rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4E705B] text-sm transition"
                        />
                    </div>

                    {error && (
                        <p role="alert" className="text-xs text-red-600 font-semibold text-center pt-1">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p role="status" className="text-xs text-[#3E5C4A] font-semibold text-center pt-1">
                            {success}
                        </p>
                    )}

                    <button
                        onClick={() => navigate("/forgot-password")}
                        className="w-full py-3.5 rounded-full bg-[#645244] text-white font-semibold text-sm hover:bg-[#2B1C1C] transition duration-200 mt-4 disabled:opacity-60"
                    >
                        Cambiar mi contraseña
                    </button>

                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="w-full py-3.5 rounded-full bg-[#4E705B] text-white font-semibold text-sm hover:bg-[#3E5C4A] transition duration-200 mt-4 disabled:opacity-60"
                    >
                        {loading ? "Guardando..." : "Guardar cambios"}
                    </button>

                    <button
                        onClick={() => navigate("/my-plants")}
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