"use client";

import { useState, type ReactNode } from "react";
import { Globe } from "lucide-react";
import { getCategoryGradient } from "@/lib/icons";
import { trackClick } from "@/lib/click-tracker";
import type { Site } from "@/lib/types";

function highlight(text: string, q: string): ReactNode {
  if (!q.trim()) return text;
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(${escaped})`, "gi");
  return text.split(re).map((part, i) =>
    re.test(part) ? (
      <mark key={i} className="bg-[#ffd60a]/30 text-inherit rounded-sm px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function SiteLogo({ site }: { site: Site }) {
  const [failed, setFailed] = useState(false);
  const gradient = getCategoryGradient(site.category);

  if (failed) {
    return (
      <div
        className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br ${gradient} shadow-sm`}
        title={site.title}
      >
        <Globe className="w-5 h-5 text-white/90" strokeWidth={1.75} />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden bg-[#f5f5f7] ring-1 ring-inset ring-black/[0.04]">
      <img
        src={`/logos/${site.id}.png`}
        alt=""
        width={28}
        height={28}
        className="w-7 h-7 object-contain rounded"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function SiteCard({ site, query = "", onClickTrack }: { site: Site; query?: string; onClickTrack?: () => void }) {
  const handleClick = () => {
    trackClick(site.id, site.title, site.url);
    onClickTrack?.();
  };

  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="group flex items-center gap-3 p-3.5 bg-white rounded-xl border border-[#d2d2d7]/40 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/[0.04] hover:border-[#d2d2d7]/80"
    >
      <SiteLogo key={site.id} site={site} />

      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-[#1d1d1f] truncate leading-snug">
          {highlight(site.title, query)}
        </div>
        <div className="text-[11px] text-[#86868b] truncate mt-0.5 leading-snug">
          {highlight(site.description, query)}
        </div>
      </div>
    </a>
  );
}
