import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import PButton from "../components/PButton";

export default function UpdateUser() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");


    useEffect(() => {
        if (user) {
            setEmail(user.email ?? "");


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

    const handleUpdate = async () => {
        setLoading(true);
        setError("");
        setSuccess("");

        console.log("user email:", user?.email);
        console.log("email state:", email);
        console.log("son iguales:", email === user?.email);

        try {

            if (email !== user?.email) {
                const { error: emailError } = await supabase.auth.updateUser({ email });
                if (emailError) throw emailError;
            }


            const { error: profileError } = await supabase
                .from("profiles")
                .update({ name, updated_at: new Date().toISOString() })
                .eq("id", user?.id);

            if (profileError) throw profileError;

            setSuccess("Perfil actualizado correctamente.");

            
            if (email !== user?.email) {
                setSuccess("Perfil actualizado. Revisa tu nuevo correo para confirmar el cambio de email.");
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex min-h-screen items-center justify-center bg-fondoGlobal">
            <div className="card w-96 bg-primarioBase shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl justify-center mb-4 text-texto">
                        Editar perfil
                    </h2>

                    {error && (
                        <div className="alert alert-error mb-2 text-texto bg-error">
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success mb-2">
                            <span>{success}</span>
                        </div>
                    )}

                    <label className="label">
                        <span className="label-text">Nombre</span>
                    </label>
                    <input
                        type="name"
                        className="input input-bordered w-full bg-primarioOscuro"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label className="label mt-2">
                        <span className="label-text">Correo electrónico</span>
                    </label>
                    <input
                        type="email"
                        className="input input-bordered w-full bg-primarioOscuro"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <PButton
                        label="Guardar cambios"
                        onClick={handleUpdate}
                        disabled={loading}
                    >
                        {loading ? <span className="loading loading-spinner" /> : "Guardar cambios"}
                    </PButton>

                    <div className="divider">o</div>

                    <button
                        className="btn btn-ghost w-full mt-2 text-texto"
                        onClick={() => navigate("/home")}
                    >
                        Volver
                    </button>
                </div>
            </div>
        </div>
    );
}