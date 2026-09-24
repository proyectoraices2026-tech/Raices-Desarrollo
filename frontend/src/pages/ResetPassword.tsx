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

        /* Regresa al inicio de sesión después de actualizar la contraseña */
        showAlert({ title: "Contraseña actualizada", message: "Ya puedes iniciar sesión con tu nueva contraseña.", variant: "success" });        
        navigate("/login");
        };

    return (
        <CreateNewPasswordScreen
            onResetPasswordSubmit={handleReset}
            onBackToVerify={() => navigate("/login")}
        />
    );
}
