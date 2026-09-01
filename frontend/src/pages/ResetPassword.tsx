import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { CreateNewPasswordScreen } from "../components/CreateNewPasswordScreen";
import { logAuthError, getFriendlyAuthErrorMessage } from "../lib/logger";

export default function ResetPassword() {
    const navigate = useNavigate();

    const handleReset = async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            logAuthError("reset-password-confirm", error);
            alert(getFriendlyAuthErrorMessage(error));
            return;
        }

        alert("Contraseña actualizada correctamente.");
        navigate("/login");
    };

    return (
        <CreateNewPasswordScreen
            onResetPasswordSubmit={handleReset}
            onBackToVerify={() => navigate("/login")}
        />
    );
}
