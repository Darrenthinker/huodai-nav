"use client";

import { useState, useEffect } from "react";
import { getTopLinks } from "@/lib/click-tracker";

interface FrequentLink {
  id: number;
  title: string;
  url: string;
  clicks: number;
}

export function FrequentLinks({ refreshKey }: { refreshKey: number }) {
  const [links, setLinks] = useState<FrequentLink[]>([]);

  useEffect(() => {
    setLinks(getTopLinks(10));
  }, [refreshKey]);

  if (links.length === 0) return null;

  return (
    <div className="mt-2.5 text-center">
      <p className="text-[10px] text-[#1d1d1f] font-bold mb-1.5">常用链接</p>
      <div className="flex flex-wrap justify-center gap-2">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-block px-2 py-0.5 bg-[#f0f0f0]/80 rounded text-[11px] text-[#444] hover:bg-[#e8e8e8] hover:text-[#1d1d1f] transition-colors duration-150"
          >
            <span className="truncate max-w-[100px]">{link.title}</span>
            <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-[#ff9500] text-white text-[8px] font-bold leading-none px-[3px]">
              {link.clicks}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
