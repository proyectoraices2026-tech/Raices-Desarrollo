import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { LoginScreen } from "../components/LoginScreen";
import { logAuthError, getFriendlyAuthErrorMessage } from "../lib/logger";

import { useAlert } from "../context/AlertContext";


/* Página que coordina el inicio de sesión con la pantalla de credenciales */
export default function Login() {
    const navigate = useNavigate();

    const { showAlert } = useAlert();


    /* Envía las credenciales a Supabase y redirige si son correctas */
    const handleLogin = async (data: { email: string; password: string }) => {
        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });
    
        /* Registra los errores y los convierte en un mensaje para el usuario */
        if (error) {
            logAuthError("login", error);
            showAlert({ title: "No se pudo iniciar sesión, cuenta no encontrada o contraseña incorrecta", message: getFriendlyAuthErrorMessage(error), variant: "error" });            return;
        }

        /* Lleva al usuario autenticado a la página principal */
        navigate("/my-plants");
    };

    return (
        <LoginScreen
            onLoginSubmit={handleLogin}
            onForgotPassword={() => navigate("/forgot-password")}
            onBackToOnboarding={() => navigate("/")}
        />
    );
}
