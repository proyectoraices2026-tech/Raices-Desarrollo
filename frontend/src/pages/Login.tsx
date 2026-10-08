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
        const { data: signInData, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            logAuthError("login", error);
            showAlert({ title: "No se pudo iniciar sesión, cuenta no encontrada o contraseña incorrecta", message: getFriendlyAuthErrorMessage(error), variant: "error" });
            return;
        }

        /* Consulta el rol directamente, sin depender de que AuthContext ya lo haya
        actualizado (fetchRole corre en paralelo vía onAuthStateChange y puede
        no estar listo todavía en este punto) */
        const { data: profile } = await supabase
            .from("profiles")
            .select("role_id, roles(name)")
            .eq("id", signInData.user.id)
            .single();

        const roleName = (profile?.roles as unknown as { name: string })?.name;

        navigate(roleName === "admin" ? "/admin" : "/my-plants");
    };

    return (
        <LoginScreen
            onLoginSubmit={handleLogin}
            onForgotPassword={() => navigate("/forgot-password")}
            onBackToOnboarding={() => navigate("/")}
        />
    );
}
