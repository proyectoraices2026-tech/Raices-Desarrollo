import { supabase } from "../lib/supabase";

export interface Noticia {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  category?: string;
  publicate: boolean;
  created_at: string;
}

// Obtener las últimas noticias para la Home
export const getLatestNews = async (limit = 3): Promise<Noticia[]> => {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("publicado", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error al obtener noticias:", error);
    return [];
  }
  return data || [];
};

// Crear una nueva noticia (Admin)
export async function createNews(newsData: {
  title: string;
  content: string;
  category?: string;
  image_url?: string;
  publicate?: boolean;
}) {
  const { data, error } = await supabase
    .from("news")
    .insert([newsData])
    .select();

  if (error) throw error;
  return data;
}

export async function deleteNews(id: string) {
  const { error } = await supabase
    .from("news")
    .delete()
    .eq("id", id);

  if (error) throw error;
}