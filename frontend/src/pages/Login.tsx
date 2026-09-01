import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { LoginScreen } from "../components/LoginScreen";
import { logAuthError, getFriendlyAuthErrorMessage } from "../lib/logger";

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = async (data: { email: string; password: string }) => {
        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) {
            logAuthError("login", error);
            alert(getFriendlyAuthErrorMessage(error));
            return;
        }

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
