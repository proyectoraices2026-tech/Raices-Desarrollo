import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ForgotPasswordScreen } from "../components/ForgotPasswordScreen";
import { logAuthError, getFriendlyAuthErrorMessage } from "../lib/logger";

export default function ForgotPassword() {
    const navigate = useNavigate();

    const handleSendResetInstruction = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
            logAuthError("reset-password-request", error);
            alert(getFriendlyAuthErrorMessage(error));
            return;
        }

        alert("Te enviamos un correo para restablecer tu contraseña.");
        navigate("/login");
    };

    return (
        <ForgotPasswordScreen
            onSendResetInstruction={handleSendResetInstruction}
            onBackToLogin={() => navigate("/login")}
        />
    );
}
