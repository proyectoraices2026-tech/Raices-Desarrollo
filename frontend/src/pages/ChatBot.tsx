import { useState, useRef, useEffect } from "react";
import NavBar from "../components/NavBar";
import BottomNav from "../components/BottomNav";
import SideMenu from "../components/SideMenu";
import { SendHorizonal, BotMessageSquare, RefreshCcw, CheckCircle2, Sprout } from "lucide-react";
import { sendMessageToRut } from "../services/ChatService"; 
import type { Message } from "../services/ChatService";
import Footer from "../components/Footer"; 
import { ArrowNavigateUp } from "../components/ArrowNavigateUp";
import { useAuth } from "../context/AuthContext";

/* La conversación se guarda temporalmente en sessionStorage, separada por usuario,
   y expira tras un lapso de inactividad para no conservarla indefinidamente. */
const CHAT_STORAGE_PREFIX = "rut-chat";
const CHAT_TTL_MS = 10 * 60 * 1000;

const initialMessage: Message = {
  sender: "bot",
  text: "¡Hola! Soy Rut, tu asistente de cuidado de plantas. Puedo ayudarte con riego, luz, plagas o cualquier duda sobre tus plantas, dime la duda que tengas para conversarlo.",
};

function loadStoredMessages(userId?: string): Message[] {
  if (!userId) return [initialMessage];
  try {
    const raw = sessionStorage.getItem(`${CHAT_STORAGE_PREFIX}:${userId}`);
    if (!raw) return [initialMessage];
    const parsed = JSON.parse(raw) as { messages?: Message[]; savedAt?: number };
    const expired = !parsed.savedAt || Date.now() - parsed.savedAt > CHAT_TTL_MS;
    if (expired || !Array.isArray(parsed.messages) || parsed.messages.length === 0) {
      sessionStorage.removeItem(`${CHAT_STORAGE_PREFIX}:${userId}`);
      return [initialMessage];
    }
    return parsed.messages;
  } catch {
    return [initialMessage];
  }
}

export default function Chatbot() {
  const { user } = useAuth();
  const storageKey = user ? `${CHAT_STORAGE_PREFIX}:${user.id}` : null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  /* Lleva al usuario hasta el principio de la página buscando el primer elemento de la misma (id="first") */
  const handleScrollUp = () => {
    document.getElementById("first")?.scrollIntoView({ behavior: "smooth" });
  };

  // Mensaje inicial (o conversación guardada dentro del lapso permitido)
  const [messages, setMessages] = useState<Message[]>(() => loadStoredMessages(user?.id));

  /* Guarda la conversación en cada cambio; el TTL se renueva con cada mensaje nuevo */
  useEffect(() => {
    if (!storageKey) return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ messages, savedAt: Date.now() }));
    } catch {
      /* Si el almacenamiento no está disponible, la conversación sigue solo en memoria */
    }
  }, [messages, storageKey]);

  /* Reinicia la conversación y borra lo guardado para ese usuario */
  const handleReset = () => {
    if (storageKey) sessionStorage.removeItem(storageKey);
    setMessages([initialMessage]);
  };

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Envío Real al backend de Railway + Gemini
  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    // 1. Agregar mensaje del usuario a la pantalla inmediatamente
    const currentMessages: Message[] = [...messages, { sender: "user", text }];
    setMessages(currentMessages);
    setInput("");
    setLoading(true);

    try {
      // 2. Petición a Express / Railway
      const responseData = await sendMessageToRut(text, messages);

      const responseObj = responseData as unknown as { reply: string; actionExecuted?: any };
      const replyText = typeof responseData === "string" ? responseData : responseObj.reply;

      // 3. Agregar la respuesta real de Rut
      setMessages((prev) => [...prev, { sender: "bot", text: replyText }]);

      // 4. Si Rut ejecutó una acción, disparamos el evento global correspondiente
      if (typeof responseData === "object" && responseData !== null && "actionExecuted" in responseData) {
        const action = (responseData as any).actionExecuted;

        // Si se marcó una tarea completada
        if (action?.type === "TASK_COMPLETED" || action?.type === "task_completed") {
          window.dispatchEvent(
            new CustomEvent("task-updated", {
              detail: action,
            })
          );
        }

        // Si se registró una nueva planta desde el chat
        if (action?.type === "PLANT_REGISTERED") {
          window.dispatchEvent(
            new CustomEvent("plant-updated", {
              detail: action,
            })
          );
        }
      }
    } catch (error) {
      console.error("Error al comunicarse con Rut:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Lo siento, ocurrió un inconveniente al conectar con Rut. Por favor, intenta de nuevo.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFEFD] flex flex-col">
      <NavBar onMenuClick={() => setMenuOpen(true)} />
      <BottomNav />

      {/* Contenedor principal centrado, máximo ancho 4xl para escritorio */}
      <main id="first" className="flex-1 max-w-4xl w-full mx-auto p-3 md:p-6 flex flex-col mb-20 md:mb-6 mt-16 md:mt-24">
        
        {/* Tarjeta del Chat */}
        <div className="bg-[#EDF2EB] rounded-2xl border border-[#D9E2D7] flex-1 flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-200px)] overflow-hidden shadow-inner">
          
          {/* Encabezado del Chat */}
          <div className="p-3 border-b border-[#D9E2D7] bg-[#EDF2EB] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E8DCCB] border border-[#DCCBB5] flex items-center justify-center text-[#907A60]">
                <BotMessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs md:text-sm font-bold text-[#233529]">Rut</h2>
                <p className="text-[10px] md:text-[11px] text-[#718878] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#95B09A]"></span>
                  Asistente de plantas · En línea
                </p>
              </div>
            </div>
            <button 
              onClick={handleReset}
              className="p-1.5 text-[#A6B7A9] hover:text-[#718878] transition"
              title="Reiniciar chat"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Área Principal de Mensajes */}
          <div ref={messagesContainerRef} className="flex-1 p-3 md:p-5 overflow-y-auto space-y-4 bg-[#EDF2EB]">
            
            <div className="flex justify-center my-2">
              <span className="text-[10px] text-[#A6B7A9] bg-[#EDF2EB] px-3 py-1 rounded-full border border-[#D9E2D7]">Hoy</span>
            </div>

            {messages.map((msg, index) => {
              const isUser = msg.sender === "user";
              return (
                <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className="flex gap-2 max-w-[85%] md:max-w-[75%] items-end">
                    {!isUser && (
                      <div className="w-6 h-6 rounded-full bg-[#DCCBB5] flex items-center justify-center text-[#907A60] flex-shrink-0">
                        <BotMessageSquare className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div
                      className={`p-3 md:p-3.5 rounded-2xl text-[11px] md:text-xs leading-relaxed ${
                        isUser
                          ? "bg-[#D9E2D7] text-[#1E2D24] rounded-br-none"
                          : "bg-white text-[#1E2D24] border border-[#D9E2D7] rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#DCCBB5] flex items-center justify-center text-[#907A60] flex-shrink-0">
                  <BotMessageSquare className="w-3.5 h-3.5" />
                </div>
                <div className="p-3.5 rounded-2xl bg-white text-[11px] text-[#A6B7A9] border border-[#D9E2D7] rounded-bl-none animate-pulse">
                  Rut está escribiendo...
                </div>
              </div>
            )}
          </div>

          {/* Caja de Entrada de Mensaje */}
          <div className="p-3 md:p-4 border-t border-[#D9E2D7] bg-[#EDF2EB]">
            <div className="flex flex-wrap gap-2 mb-2.5">
              <button
                type="button"
                onClick={() => handleSend("Quiero marcar una tarea como completada")}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] md:text-[11px] bg-white border border-[#D9E2D7] text-[#5E7765] hover:bg-[#D9E2D7] transition disabled:opacity-40"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Marcar tarea
              </button>
              <button
                type="button"
                onClick={() => handleSend("Quiero registrar una nueva planta")}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] md:text-[11px] bg-white border border-[#D9E2D7] text-[#5E7765] hover:bg-[#D9E2D7] transition disabled:opacity-40"
              >
                <Sprout className="w-3.5 h-3.5" />
                Registrar planta
              </button>
            </div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Escribe tu consulta..."
                className="w-full text-xs md:text-sm p-3.5 pr-12 rounded-full border border-[#D9E2D7] focus:outline-none focus:border-[#AFBFB2] focus:ring-1 focus:ring-[#AFBFB2] bg-white text-[#1E2D24] shadow-inner"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="absolute right-2 p-2 rounded-full bg-[#5E7765] hover:bg-[#4E6153] text-white transition disabled:opacity-40"
              >
                <SendHorizonal className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-[9px] text-[#A6B7A9] mt-2.5">
              Rut puede cometer errores. Verifica los cuidados importantes.
            </p>
          </div>

        </div>
      </main>
      <ArrowNavigateUp handleUpNavigate={handleScrollUp}></ArrowNavigateUp>
      <Footer />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}