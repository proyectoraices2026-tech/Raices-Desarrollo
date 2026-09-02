import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useState } from "react";
import PButton from "../components/PButton";
import { logAuthError } from "../lib/logger";

/* Página principal disponible después de iniciar sesión */
export default function MainPage() {

    const { user } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    /* Cierra la sesión actual y vuelve al inicio de sesión */
    const handleLogout = async () => {

        setLoading(true);
        setError("");
        const { error } = await supabase.auth.signOut();

        /* Si el cierre de sesión falla, registra y muestra el error */
        if (error) {
            logAuthError("logout", error);
            setError(error.message);
        } else {
            navigate("/login");
        }
        setLoading(false);

    };

    /* Abre la página donde se pueden modificar los datos del perfil */
    const handleUpdate = async () => {
        navigate("/profile");
    };

    /* Abre el catálogo de productos */
    const handleCatalog = async () => {
    navigate("/catalog");
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

                    <PButton
                        onClick={handleCatalog}
                        disabled={loading}
                        label="Catalogo"
                    >
                        {loading ? <span className="loading loading-spinner" /> : "Catalogo"}
                    </PButton>
                </div>
            </div>

        </div>
    )
}
