import { useLocation, useNavigate } from "react-router-dom";
import chatIcon from "../assets/iconsPhone/chatBlanco.png";
import { useAuth } from "../context/AuthContext";

export default function ChatBubble() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  /* Sin sesión no hay chatbot, y dentro del propio chatbot la burbuja sobra */
  if (!user || pathname === "/chatbot") return null;

  return (
    <button
      type="button"
      onClick={() => navigate("/chatbot")}
      className="fixed z-30 right-4 bottom-20 md:right-6 md:bottom-6 w-14 h-14 rounded-full bg-primarioBase shadow-lg shadow-black/25 flex items-center justify-center transition hover:scale-105 hover:bg-primarioOscuro focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primarioBase"
      title="Chatbot"
      aria-label="Abrir Chatbot"
    >
      <img src={chatIcon} alt="" className="w-7 h-7 object-contain" aria-hidden="true" />
    </button>
  );
}
