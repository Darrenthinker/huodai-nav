"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-white/90 backdrop-blur-lg text-[#86868b] shadow-lg shadow-black/[0.08] border border-[#d2d2d7]/40 hover:text-[#1d1d1f] hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
      aria-label="回到顶部"
    >
      <ArrowUp size={18} strokeWidth={2} />
    </button>
  );
}
