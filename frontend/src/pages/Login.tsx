import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import PButton from "../components/PButton";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingReset, setLoadingReset] = useState(false);
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        setError("");

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message);
        } else {
            navigate("/home");
        }
        setLoading(false);
    };

    const handlePasswordReset = async () => {
        setLoadingReset(true);
        setError("");
        setSuccess("");

        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
            setError(error.message);
        } else {
            setSuccess("Te enviamos un correo para restablecer tu contraseña.");
        }

        setLoadingReset(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-fondoGlobal">
            <div className="card w-96 bg-primarioBase shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl justify-center mb-4 text-texto">Iniciar sesión</h2>

                    {error && (
                        <div className="alert alert-error bg-error text-texto">
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success">
                            <span>{success}</span>
                        </div>
                    )}

                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        className="input input-bordered w-full bg-primarioOscuro"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="input input-bordered w-full mt-2 bg-primarioOscuro"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <PButton
                        onClick={handleLogin}
                        disabled={loading}
                        label="Iniciar sesión"
                    >
                        {loading ? <span className="loading loading-spinner" /> : "Iniciar sesión"}
                    </PButton>

                    <p className="text-center mt-2 text-texto">
                        ¿No tienes cuenta?{" "}
                        <a href="/register" className="link link-primary">
                            Regístrate
                        </a>
                    </p>

                    <p className="text-center mt-2 text-texto">
                        ¿Olvidaste tu contraseña?{" "}
                        <a onClick={handlePasswordReset} className="link link-primary">
                            Recuperar contraseña
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}