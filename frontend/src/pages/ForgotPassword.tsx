import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ForgotPasswordScreen } from "../components/ForgotPasswordScreen";
import { logAuthError, getFriendlyAuthErrorMessage } from "../lib/logger";

import { useAlert } from "../context/AlertContext";


/* Página que coordina el envío del correo de recuperación */
export default function ForgotPassword() {
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    /* Solicita a Supabase el enlace y maneja el resultado de la operación */
    const handleSendResetInstruction = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email);

        /* Registra el error y muestra un mensaje entendible al usuario */
        if (error) {
            logAuthError("reset-password-request", error);
            showAlert({ title: "No se pudo enviar el correo", message: getFriendlyAuthErrorMessage(error), variant: "error" });
            return;
        }

        /* Después de enviar el correo, regresa al inicio de sesión */
            showAlert({ title: "Correo enviado", message: "Te enviamos un enlace para restablecer tu contraseña.", variant: "success" });        
            navigate("/login");
        };

    return (
        <ForgotPasswordScreen
            onSendResetInstruction={handleSendResetInstruction}
            onBackToLogin={() => navigate("/login")}
        />
    );
}
