import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useState } from "react";
import PButton from "../components/PButton";
import { logAuthError } from "../lib/logger";

export default function MainPage() {

    const { user } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {

        setLoading(true);
        setError("");
        const { error } = await supabase.auth.signOut();

        if (error) {
            logAuthError("logout", error);
            setError(error.message);
        } else {
            navigate("/login");
        }
        setLoading(false);

    };

    const handleUpdate = async () => {
        navigate("/profile");
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-fondoGlobal">

            {error && (
                <div className="alert alert-error bg-error text-texto">
                    <span>{error}</span>
                </div>
            )}
            <div className="card w-96 bg-primarioBase shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl justify-center text-texto">
                        Bienvenido
                    </h2>
                    <p className="text-center text-texto">
                        {user?.email}
                    </p>

                    <PButton
                        onClick={handleLogout}
                        disabled={loading}
                        label="Cerrar sesión"
                    >
                        {loading ? <span className="loading loading-spinner" /> : "Cerrar sesión"}
                    </PButton>

                    <PButton
                        onClick={handleUpdate}
                        disabled={loading}
                        label="Editar Perfil"
                    >
                        {loading ? <span className="loading loading-spinner" /> : "Editar Perfil"}
                    </PButton>
                </div>
            </div>

        </div>
    )
}
