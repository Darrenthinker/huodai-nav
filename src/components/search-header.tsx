"use client";

import { Search, Menu } from "lucide-react";
import { FrequentLinks } from "./frequent-links";

interface SearchHeaderProps {
  query: string;
  onChange: (v: string) => void;
  onMenuClick: () => void;
  filteredCount: number;
  frequentRefreshKey: number;
}

export function SearchHeader({
  query, onChange, onMenuClick, filteredCount, frequentRefreshKey,
}: SearchHeaderProps) {
  const isSearching = query.trim().length > 0;

  return (
    <header className="sticky top-0 z-30 bg-[#f5f5f7]/80 backdrop-blur-xl border-b border-[#d2d2d7]/40">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-3 lg:hidden mb-2">
          <button
            onClick={onMenuClick}
            className="flex-shrink-0 p-2 -ml-1 rounded-lg text-[#86868b] hover:bg-black/[0.04] transition-colors"
            aria-label="打开菜单"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="relative flex-1 max-w-xl">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b] pointer-events-none" />
            <input
              type="text"
              placeholder="输入关键词搜索航司、船司、网址、物流工具..."
              value={query}
              onChange={(e) => onChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/70 border border-[#d2d2d7]/60 rounded-xl text-sm text-[#1d1d1f] placeholder-[#86868b] outline-none transition-all duration-200 focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10"
            />
          </div>

          {isSearching && (
            <span className="hidden sm:flex items-center gap-1.5 text-[12px] font-medium px-3 py-2 bg-[#0071e3]/[0.08] text-[#0071e3] rounded-lg flex-shrink-0">
              <Search size={13} />
              找到 {filteredCount} 个结果
            </span>
          )}
        </div>

        <FrequentLinks refreshKey={frequentRefreshKey} />
      </div>
    </header>
  );
}
