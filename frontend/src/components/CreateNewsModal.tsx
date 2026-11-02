import { useState } from "react";
import { createNews } from "../services/NewsServices";
import { supabase } from "../lib/supabase";
import { X, Newspaper, Upload } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateNewsModal({ isOpen, onClose, onSuccess }: Props) {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("Recomendación");
  const [imagenFile, setImagenFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !contenido.trim() || loading) return;

    setLoading(true);
    try {
      let imageUrl = "";

      // Si seleccionaron una imagen, la subimos a Supabase Storage
      if (imagenFile) {
        const fileExt = imagenFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `news-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images") // Asegúrate de tener un bucket llamado "images" en tu Supabase
          .upload(filePath, imagenFile);

        if (uploadError) throw uploadError;

        // Obtener la URL pública de la imagen
        const { data: publicURLData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        imageUrl = publicURLData.publicUrl;
      }

      await createNews({
        title: titulo,
        content: contenido,
        category: categoria,
        image_url: imageUrl || undefined,
        publicate: true,
      });

      // Limpiar formulario
      setTitulo("");
      setContenido("");
      setImagenFile(null);
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Error al publicar noticia:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#EDF2EB] border border-[#D9E2D7] rounded-2xl max-w-md w-full p-5 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b border-[#D9E2D7] pb-3">
          <div className="flex items-center gap-2 text-[#233529]">
            <Newspaper className="w-5 h-5 text-[#5E7765]" />
            <h3 className="font-bold text-sm">Nueva Noticia / Recomendación</h3>
          </div>
          <button onClick={onClose} className="text-[#A6B7A9] hover:text-[#233529]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-[#233529] mb-1">Título</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Consejos de riego en verano"
              className="w-full text-xs p-2.5 rounded-xl border border-[#D9E2D7] bg-white focus:outline-none focus:ring-1 focus:ring-[#AFBFB2]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#233529] mb-1">Categoría</label>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-[#D9E2D7] bg-white focus:outline-none focus:ring-1 focus:ring-[#AFBFB2]"
            >
              <option value="Recomendación">Recomendación</option>
              <option value="Promoción">Promoción</option>
              <option value="Evento">Evento / Taller</option>
              <option value="Anuncio">Anuncio Vivero</option>
            </select>
          </div>

          {/* Selector de Archivo Local */}
          <div>
            <label className="block text-[11px] font-semibold text-[#233529] mb-1">Imagen</label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-[#5E7765] hover:bg-[#4E6153] text-white text-xs px-4 py-2 rounded-xl transition font-medium flex items-center gap-1.5 shadow-sm">
                <Upload className="w-4 h-4" />
                Seleccionar archivo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImagenFile(e.target.files[0]);
                    }
                  }}
                />
              </label>
              <span className="text-[11px] text-[#55695A] truncate max-w-[200px]">
                {imagenFile ? imagenFile.name : "Ningún archivo seleccionado"}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#233529] mb-1">Contenido</label>
            <textarea
              required
              rows={4}
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Escribe el cuerpo de la noticia..."
              className="w-full text-xs p-2.5 rounded-xl border border-[#D9E2D7] bg-white focus:outline-none focus:ring-1 focus:ring-[#AFBFB2] resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs text-[#55695A] hover:bg-[#D9E2D7]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-full text-xs bg-[#5E7765] hover:bg-[#4E6153] text-white transition font-medium disabled:opacity-50"
            >
              {loading ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}