import { useNavigate } from "react-router-dom";
import { OnboardingScreen } from "../components/OnboardingScreen";

/* Página inicial que conecta las opciones de bienvenida con las rutas */
export default function Onboarding() {
    const navigate = useNavigate();

    return (
        <OnboardingScreen
            onSelectLogin={() => navigate("/login")}
            onSelectRegister={() => navigate("/register")}
        />
    );
}
