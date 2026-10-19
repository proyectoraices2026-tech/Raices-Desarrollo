import { useState, useRef, useEffect } from "react";
import NavBar from "../components/NavBar";
import BottomNav from "../components/BottomNav";
import SideMenu from "../components/SideMenu";
import { SendHorizonal, BotMessageSquare, RefreshCcw } from "lucide-react";
import { sendMessageToRut,  } from "../services/ChatService"; 
import type { Message } from "../services/ChatService";
import Footer from "../components/Footer"; 



export default function Chatbot() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Mensaje inicial , se podria cambiar 
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "¡Hola! Soy Rut, tu asistente de cuidado de plantas. Puedo ayudarte con riego, luz, plagas o cualquier duda sobre tus plantas, dime la duda que tengas para conversarlo.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Envio Real al backend de Railway + Gemini
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
      const reply = await sendMessageToRut(text, messages);

      // 3. Agregar la respuesta real de Rut (Gemini 2.5 Flash)
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
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
      {/* El BottomNav se renderiza automáticamente abajo en móvil por su clase fixed */}
      <BottomNav />

      {/* Contenedor principal centrado, máximo ancho 4xl para escritorio */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 md:p-6 flex flex-col mb-20 md:mb-6 mt-16 md:mt-24">
        
        {/* Tarjeta del Chat - Estilo contenedor del diseño */}
        <div className="bg-[#EDF2EB] rounded-2xl border border-[#D9E2D7] flex-1 flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-200px)] overflow-hidden shadow-inner">
          
          {/* Encabezado del Chat (Rut + Estado + Reset) */}
          <div className="p-3 border-b border-[#D9E2D7] bg-[#EDF2EB] flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Icono de Bot (Marrón/Crema como el diseño) */}
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
            {/* Icono de reiniciar chat */}
            <button 
              onClick={() => setMessages([messages[0]])} // Reinicia visualmente la conversación
              className="p-1.5 text-[#A6B7A9] hover:text-[#718878] transition"
              title="Reiniciar chat"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Área Principal de Mensajes y Preguntas Frecuentes */}
          <div className="flex-1 p-3 md:p-5 overflow-y-auto space-y-4 bg-[#EDF2EB]">
            
            {/* Separador de Fecha "Hoy" */}
            <div className="flex justify-center my-2">
              <span className="text-[10px] text-[#A6B7A9] bg-[#EDF2EB] px-3 py-1 rounded-full border border-[#D9E2D7]">Hoy</span>
            </div>

            {/* Mapeo de Mensajes */}
            {messages.map((msg, index) => {
              const isUser = msg.sender === "user";
              return (
                <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className="flex gap-2 max-w-[85%] md:max-w-[75%] items-end">
                    {/* Icono de Rut a la izquierda solo para el bot */}
                    {!isUser && (
                      <div className="w-6 h-6 rounded-full bg-[#DCCBB5] flex items-center justify-center text-[#907A60] flex-shrink-0">
                        <BotMessageSquare className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {/* Burbuja de chat - Estilo Redondeado y color crema */}
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

           
            {/* Indicador de "Escribiendo..." */}
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
            <div ref={messagesEndRef} />
          </div>

          {/* Caja de Entrada de Mensaje (Estilo Píldora del Diseño) */}
          <div className="p-3 md:p-4 border-t border-[#D9E2D7] bg-[#EDF2EB]">
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
            {/* Texto de pie de página */}
            <p className="text-center text-[9px] text-[#A6B7A9] mt-2.5">
              Rut puede cometer errores. Verifica los cuidados importantes.
            </p>
          </div>

        </div>
      </main>
      <Footer />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  );
}