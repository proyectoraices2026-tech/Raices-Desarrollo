import { useState } from "react";
import { supabase } from "../lib/supabase";
import PButton from "../components/PButton";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        setError("");

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name, phone} 
            }
        });

        if (error) {
            setError(error.message);
        } else {
            alert("¡Te has registrado correctamente! Revisa tu correo para confirmar que esta cuenta sea tuya.");
        }
        setLoading(false);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-fondoGlobal">
            <div className="card w-96 bg-primarioBase shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl justify-center mb-4 text-texto">Crear cuenta</h2>

                    {error && (
                        <div className="alert alert-error text-texto bg-error">
                            <span>{error}</span>
                        </div>
                    )}

                    <input
                        type="text"
                        placeholder="Nombre"
                        className="input input-bordered w-full bg-primarioOscuro"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        className="input input-bordered w-full mt-2 bg-primarioOscuro"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Número de teléfono"
                        className="input input-bordered w-full mt-2 bg-primarioOscuro"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="input input-bordered w-full mt-2 bg-primarioOscuro"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <PButton
                        label="Registrarse"
                        onClick={handleRegister}
                        disabled={loading}
                    >
                        {loading ? <span className="loading loading-spinner" /> : "Registrarse"}
                    </PButton>

                    <p className="text-center mt-2">
                        ¿Ya tienes cuenta?{" "}
                        <a href="/login" className="link link-primary">
                            Inicia sesión
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}