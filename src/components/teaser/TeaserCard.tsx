import { useState } from "react";
import { Teaser } from "@/lib/teaserApi";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface TeaserCardProps {
  teaser: Teaser;
  onClick: () => void;
}

const CATEGORY_STYLES: Record<string, { bg: string; label: string }> = {
  health:  { bg: "bg-emerald-500/90",  label: "Здоровье" },
  money:   { bg: "bg-amber-500/90",    label: "Деньги" },
  tech:    { bg: "bg-blue-500/90",     label: "Технологии" },
  beauty:  { bg: "bg-pink-500/90",     label: "Красота" },
  shop:    { bg: "bg-orange-500/90",   label: "Товары" },
  general: { bg: "bg-slate-500/90",    label: "Общее" },
};

export default function TeaserCard({ teaser, onClick }: TeaserCardProps) {
  const [imgError, setImgError] = useState(false);
  const cat = CATEGORY_STYLES[teaser.category] ?? CATEGORY_STYLES.general;

  const ctr =
    teaser.views > 0
      ? ((teaser.clicks / teaser.views) * 100).toFixed(1)
      : "0.0";

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col rounded-xl overflow-hidden cursor-pointer
                 bg-[#0d1117] border border-white/10
                 transition-all duration-200
                 hover:shadow-[0_8px_32px_rgba(139,92,246,0.25)]
                 hover:scale-[1.02] hover:border-violet-500/40"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-slate-800">
        {!imgError && teaser.image_url ? (
          <img
            src={teaser.image_url}
            alt={teaser.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
            <Icon name="Image" size={40} className="text-slate-500" />
          </div>
        )}

        {/* Category badge over image */}
        <span
          className={`absolute top-2 left-2 text-white text-[10px] font-semibold
                      px-2 py-0.5 rounded-full ${cat.bg} backdrop-blur-sm`}
        >
          {cat.label}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        <h3
          className="text-white font-semibold text-sm leading-snug
                     line-clamp-2 group-hover:text-amber-400 transition-colors"
        >
          {teaser.title}
        </h3>

        {teaser.description && (
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
            {teaser.description}
          </p>
        )}

        {/* Stats footer */}
        <div className="mt-auto pt-2 flex items-center gap-3 border-t border-white/5">
          <span className="flex items-center gap-1 text-slate-500 text-[11px]">
            <Icon name="Eye" size={11} />
            {teaser.views.toLocaleString("ru-RU")}
          </span>
          <span className="flex items-center gap-1 text-slate-500 text-[11px]">
            <Icon name="MousePointerClick" size={11} />
            {teaser.clicks.toLocaleString("ru-RU")}
          </span>
          <span className="ml-auto text-slate-600 text-[11px]">
            CTR {ctr}%
          </span>
        </div>
      </div>
    </div>
  );
}
