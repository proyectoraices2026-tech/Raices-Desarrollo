import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { RegisterScreen } from "../components/RegisterScreen";
import { logAuthError, getFriendlyAuthErrorMessage } from "../lib/logger";

export default function Register() {
    const navigate = useNavigate();

    const handleRegister = async (data: {
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        password: string;
    }) => {
        const name = `${data.firstName} ${data.lastName}`.trim();

        const { error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: { name, phone: data.phone },
            },
        });

        if (error) {
            logAuthError("register", error);
            alert(getFriendlyAuthErrorMessage(error));
            return;
        }

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
