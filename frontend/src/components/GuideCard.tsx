import { Play } from "lucide-react";
import type { QuickGuide } from "../utils/quickGuides";

/* "green": guías de uso (por defecto).
   "brown": guías de jardinería */
export type GuideCardVariant = "green" | "brown";

const STYLES: Record<GuideCardVariant, { card: string; media: string; play: string; label: string; badge: string; title: string; text: string }> = {
  green: {
    card: "border-[#c8ddc0]",
    media: "bg-[#87c6a1]/30",
    play: "bg-[#3a6b35]/10 text-[#3a6b35]",
    label: "text-[#537a63]",
    badge: "bg-[#537a63]",
    title: "text-[#1c2b18]",
    text: "text-[#537a63]",
  },
  brown: {
    card: "border-[#ddcbc0]",
    media: "bg-[#645244]/[0.28]",
    play: "bg-[#5e3e3e]/10 text-[#645244]",
    label: "text-[#645244]",
    badge: "bg-[#645244]",
    title: "text-[#645244]",
    text: "text-[#645244]",
  },
};

/* Tarjeta de una guía: video (o "Video próximamente"), número, título y descripción */
export default function GuideCard({
  guide,
  compact = false,
  variant = "green",
}: {
  guide: QuickGuide;
  compact?: boolean;
  variant?: GuideCardVariant;
}) {
  const s = STYLES[variant];

  return (
    <article className={`bg-white border ${s.card} rounded-2xl shadow-sm overflow-hidden`}>
      <div className={`${s.media} flex items-center justify-center ${compact ? "h-32" : "h-44 md:h-52"}`}>
        {guide.videoUrl ? (
          <iframe
            src={guide.videoUrl}
            title={guide.title}
            className="w-full h-full"
            allow="accelerometer; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <span className={`w-14 h-14 rounded-full ${s.play} flex items-center justify-center`}>
              <Play className="w-7 h-7" aria-hidden="true" />
            </span>
            <span className={`text-xs font-medium ${s.label}`}>Video próximamente</span>
          </div>
        )}
      </div>
      <div className="px-5 py-4">
        <div className="flex items-center gap-2">
          <span className={`w-5 h-5 rounded-full ${s.badge} text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>
            {guide.id}
          </span>
          <h3 className={`font-poppins text-base font-bold ${s.title}`}>{guide.title}</h3>
        </div>
        <p className={`text-sm ${s.text} pl-7 pt-1`}>{guide.description}</p>
      </div>
    </article>
  );
}
