import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import PButton from "../components/PButton";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleReset = async () => {
        setError("");

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError(error.message);
        } else {
            setSuccess("Contraseña actualizada correctamente.");
            setTimeout(() => navigate("/login"), 2000);
        }

        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-fondoGlobal">
            <div className="card w-96 bg-primarioBase shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl justify-center mb-4 text-texto">
                        Nueva contraseña
                    </h2>

                    {error && (
                        <div className="alert alert-error mb-2 bg-error">
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success mb-2">
                            <span>{success}</span>
                        </div>
                    )}

                    <input
                        type="password"
                        placeholder="Nueva contraseña"
                        className="input input-bordered w-full bg-primarioOscuro"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Confirmar contraseña"
                        className="input input-bordered w-full mt-2 bg-primarioOscuro"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <PButton
                        label="Actualizar contraseña"
                        onClick={handleReset}
                        disabled={loading}
                    >
                        {loading ? <span className="loading loading-spinner" /> : "Actualizar contraseña"}
                    </PButton>
                </div>
            </div>
        </div>
    );
}