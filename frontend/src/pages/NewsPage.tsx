import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import CreateNewsModal from "../components/CreateNewsModal";
import NavBar from "../components/NavBar";
import BottomNav from "../components/BottomNav";
import SideMenu from "../components/SideMenu";
import Footer from "../components/Footer";
import { ArrowNavigateUp } from "../components/ArrowNavigateUp";
import { Plus, Newspaper, Calendar, Tag, Trash2 } from "lucide-react";

export interface Noticia {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  category?: string;
  publicate: boolean;
  created_at: string;
}

export default function NewsPage() {
  const { role } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [news, setNews] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    let query = supabase.from("news").select("*").order("created_at", { ascending: false });
    
    if (role !== "admin") {
      query = query.eq("publicate", true);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error al cargar noticias:", error);
    } else {
      setNews(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, [role]);

  const handleScrollUp = () => {
    document.getElementById("first")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta noticia?")) return;

    try {
      const { error } = await supabase.from("news").delete().eq("id", id);
      if (error) throw error;
      fetchNews();
    } catch (err) {
      console.error("Error al eliminar la noticia:", err);
    }
  };

  // Separar la noticia principal (la más reciente) de las secundarias
  const mainArticle = news.length > 0 ? news[0] : null;
  const secondaryArticles = news.length > 1 ? news.slice(1) : [];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Barra de navegación fija */}
      <div className="sticky top-0 z-40">
        <NavBar onMenuClick={() => setMenuOpen(true)} />
        <BottomNav />
      </div>

      <main id="first" className="w-full flex-1 p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
        {/* Encabezado y Botón de Admin */}
        <div className="flex justify-between items-center mb-8 border-b border-[#e2eae1] pb-4">
          <div>
            <h1 className="text-base md:text-lg font-bold text-[#1e2d24] flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-[#5e7765]" />
              Novedades y Recomendaciones
            </h1>
            <p className="text-xs text-[#537a63] mt-1">
              Consejos de temporada, talleres y anuncios del vivero.
            </p>
          </div>

          {role === "admin" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#5e7765] hover:bg-[#4a6151] text-white text-xs px-4 py-2.5 rounded-full transition font-medium"
            >
              <Plus className="w-4 h-4" />
              Nueva Noticia
            </button>
          )}
        </div>

        {/* Contenido Dinámico */}
        {loading ? (
          <div className="text-center py-16 text-[#537a63] text-xs">Cargando publicaciones...</div>
        ) : news.length === 0 ? (
          <div className="text-center py-16 bg-[#f9faf8] rounded-2xl border border-[#e8efe4]">
            <p className="text-xs text-[#537a63]">No hay noticias o recomendaciones publicadas todavía.</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* 1. NOTICIA PRINCIPAL */}
            {mainArticle && (
              <div className="bg-[#f9faf8] rounded-2xl border border-[#e8efe4] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch relative">
                {/* Imagen Principal Grande */}
                {mainArticle.image_url && (
                  <div className="lg:col-span-7 h-64 sm:h-80 lg:h-auto min-h-[300px]">
                    <img
                      src={mainArticle.image_url}
                      alt={mainArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {/* Información de la Noticia Principal */}
                <div className={`p-6 lg:p-8 flex flex-col justify-between ${mainArticle.image_url ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#5e7765] bg-white px-2.5 py-0.5 rounded-full border border-[#e2eae1]">
                          <Tag className="w-3 h-3" />
                          {mainArticle.category || "Destacado"}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#537a63]">
                          <Calendar className="w-3 h-3" />
                          {new Date(mainArticle.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {role === "admin" && (
                        <button
                          onClick={() => handleDeleteNews(mainArticle.id)}
                          className="text-red-500 hover:text-red-700 p-1.5 rounded-lg transition"
                          title="Eliminar noticia"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <h2 className="text-lg md:text-xl font-bold text-[#1e2d24] mb-3 leading-snug">
                      {mainArticle.title}
                    </h2>
                    
                    <p className="text-xs text-[#33463a] leading-relaxed line-clamp-4 whitespace-pre-line">
                      {mainArticle.content}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-[#e8efe4] flex items-center justify-between text-[11px] text-[#537a63]">
                    <span className="font-semibold text-[#1e2d24]">Raíces Vivero</span>
                    <span>Lectura recomendada</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. NOTICIAS SECUNDARIAS */}
            {secondaryArticles.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-[#1e2d24] mb-4 border-l-4 border-[#5e7765] pl-2.5">
                  Anteriores y más consejos
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {secondaryArticles.map((item) => (
                    <article
                      key={item.id}
                      className="bg-[#f9faf8] rounded-2xl border border-[#e8efe4] overflow-hidden flex flex-col justify-between p-4"
                    >
                      <div>
                        {item.image_url && (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-40 object-cover rounded-xl mb-3 border border-[#e8efe4]"
                          />
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#5e7765] bg-white px-2 py-0.5 rounded-full border border-[#e2eae1]">
                              {item.category || "Recomendación"}
                            </span>
                            <span className="text-[10px] text-[#537a63]">
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          {role === "admin" && (
                            <button
                              onClick={() => handleDeleteNews(item.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded transition"
                              title="Eliminar noticia"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <h4 className="text-xs md:text-sm font-bold text-[#1e2d24] mb-2 line-clamp-2">
                          {item.title}
                        </h4>
                        
                        <p className="text-[11px] text-[#33463a] leading-relaxed line-clamp-3 whitespace-pre-line">
                          {item.content}
                        </p>
                      </div>

                      <div className="pt-3 mt-4 border-t border-[#e8efe4] flex items-center justify-between text-[10px] text-[#537a63]">
                        <span>Raíces Vivero</span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </main>

      <ArrowNavigateUp handleUpNavigate={handleScrollUp} />
      <Footer />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <CreateNewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchNews}
      />
    </div>
  );
}