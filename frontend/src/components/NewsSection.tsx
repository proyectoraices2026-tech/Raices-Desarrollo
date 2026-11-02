import { useEffect, useState } from "react";
import { getLatestNews } from "../services/NewsServices";
import type { Noticia } from "../services/NewsServices";

export default function NewsSection() {
  const [news, setNews] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestNews(3)
      .then((data) => setNews(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (news.length === 0) return null;

  return (
    <section className="w-full max-w-4xl mx-auto px-3 md:px-6 py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base md:text-lg font-bold text-[#233529]">
            Novedades y Recomendaciones
          </h2>
          <p className="text-xs text-[#718878]">
            Consejos de temporada y anuncios del vivero
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {news.map((item) => (
          <article
            key={item.id}
            className="bg-[#EDF2EB] rounded-2xl border border-[#D9E2D7] overflow-hidden shadow-sm flex flex-col justify-between p-4"
          >
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-32 object-cover rounded-xl mb-3"
              />
            )}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <span className="inline-block text-[10px] font-semibold text-[#5E7765] bg-white px-2 py-0.5 rounded-full border border-[#D9E2D7] mb-2">
                  {item.category || "Noticia"}
                </span>
                <h3 className="text-xs md:text-sm font-bold text-[#1E2D24] mb-1.5 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-[11px] text-[#55695A] leading-relaxed line-clamp-3 whitespace-pre-line">
                  {item.content}
                </p>
              </div>
              <span className="text-[9px] text-[#A6B7A9] mt-3 block">
                {item.created_at ? new Date(item.created_at).toLocaleDateString() : ""}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}