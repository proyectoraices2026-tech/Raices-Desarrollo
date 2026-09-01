import { useNavigate } from "react-router-dom";
import { OnboardingScreen } from "../components/OnboardingScreen";

export default function Onboarding() {
    const navigate = useNavigate();

    return (
        <OnboardingScreen
            onSelectLogin={() => navigate("/login")}
            onSelectRegister={() => navigate("/register")}
        />
    );
}
