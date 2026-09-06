import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { LoginScreen } from "../components/LoginScreen";
import { logAuthError, getFriendlyAuthErrorMessage } from "../lib/logger";

/* Página que coordina el inicio de sesión con la pantalla de credenciales */
export default function Login() {
    const navigate = useNavigate();

    /* Envía las credenciales a Supabase y redirige si son correctas */
    const handleLogin = async (data: { email: string; password: string }) => {
        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        /* Registra los errores y los convierte en un mensaje para el usuario */
        if (error) {
            logAuthError("login", error);
            alert(getFriendlyAuthErrorMessage(error));
            return;
        }

        /* Lleva al usuario autenticado a la página principal */
        navigate("/home");
    };

    return (
        <LoginScreen
            onLoginSubmit={handleLogin}
            onForgotPassword={() => navigate("/forgot-password")}
            onBackToOnboarding={() => navigate("/")}
        />
    );
}
