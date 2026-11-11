import { supabase } from "../lib/supabase";

export interface Message {
  sender: "user" | "bot";
  text: string;
}

// URL base del backend en Railway o localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export async function sendMessageToRut(message: string, history: Message[]): Promise<string> {
  // Obtener la sesión del usuario en Supabase para enviar su ID al backend
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  const response = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      history,
      userId,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al comunicarse con el servidor de Rut.");
  }

  return data.reply;
}