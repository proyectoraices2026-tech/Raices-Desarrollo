import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { CreateNewPasswordScreen } from "../components/CreateNewPasswordScreen";
import { logAuthError, getFriendlyAuthErrorMessage } from "../lib/logger";


import { useAlert } from "../context/AlertContext";

/* Página que actualiza la contraseña después de validar el enlace recibido */
export default function ResetPassword() {
    const navigate = useNavigate();
    const { showAlert } = useAlert();


    /* Guarda la nueva contraseña y maneja posibles errores de Supabase */
    const handleReset = async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({ password: newPassword });

        /* Registra el error y lo muestra con un mensaje entendible */
        if (error) {
            logAuthError("reset-password-confirm", error);
            showAlert({ title: "No se pudo cambiar la contraseña", message: getFriendlyAuthErrorMessage(error), variant: "error" });
            return;
        }

        /* Distingue si la recuperación vino del login o de "Editar perfil" */
        const raw = localStorage.getItem("passwordResetOrigin");
        localStorage.removeItem("passwordResetOrigin");

        let cameFromProfile = false;
        if (raw) {
            try {
                const parsed = JSON.parse(raw);
                cameFromProfile = parsed.origin === "profile" && parsed.expiresAt > Date.now();
            } catch {
                /* Si el valor guardado está corrupto o mal formado, se ignora y se trata como si no existiera */
            }
        }

        if (cameFromProfile) {
            showAlert({ title: "Contraseña actualizada", message: "Tu contraseña se actualizó correctamente.", variant: "success" });
            navigate("/profile");
        } else {
            showAlert({ title: "Contraseña actualizada", message: "Ya puedes iniciar sesión con tu nueva contraseña.", variant: "success" });
            navigate("/login");
        }
    };

    return (
        <CreateNewPasswordScreen
            onResetPasswordSubmit={handleReset}
            onBackToVerify={() => navigate("/login")}
        />
    );
}
