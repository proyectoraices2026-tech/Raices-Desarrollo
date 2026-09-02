import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { RegisterScreen } from "../components/RegisterScreen";
import { logAuthError, getFriendlyAuthErrorMessage } from "../lib/logger";

/* Página que coordina el registro de una cuenta nueva */
export default function Register() {
    const navigate = useNavigate();

    /* Construye los datos del usuario y los envía al servicio de autenticación */
    const handleRegister = async (data: {
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        password: string;
    }) => {
        /* Une el nombre y apellido para guardarlos como un solo dato del perfil */
        const name = `${data.firstName} ${data.lastName}`.trim();

        const { error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: { name, phone: data.phone },
            },
        });

        /* Registra el error y muestra una explicación al usuario */
        if (error) {
            logAuthError("register", error);
            alert(getFriendlyAuthErrorMessage(error));
            return;
        }

        /* Informa que debe confirmar el correo antes de iniciar sesión */
        alert("¡Te has registrado correctamente! Revisa tu correo para confirmar que esta cuenta sea tuya.");
        navigate("/login");
    };

    return (
        <RegisterScreen
            onRegisterSubmit={handleRegister}
            onBackToOnboarding={() => navigate("/")}
        />
    );
}
