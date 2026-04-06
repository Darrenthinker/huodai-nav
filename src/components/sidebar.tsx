"use client";

import { getIcon } from "@/lib/icons";
import type { Category } from "@/lib/types";
import { X, Plus, ChevronsLeft, ChevronsRight, BookOpen } from "lucide-react";

interface SidebarProps {
  categories: Category[];
  activeCategory: string | null;
  isOpen: boolean;
  onClose: () => void;
  onCategoryClick: (name: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSubmitClick: () => void;
  showPromoEntry?: boolean;
}

export function Sidebar({
  categories, activeCategory, isOpen, onClose, onCategoryClick,
  collapsed, onToggleCollapse, onSubmitClick, showPromoEntry = false,
}: SidebarProps) {
  const w = collapsed ? "w-[56px]" : "w-[168px]";
  const ml = collapsed ? "56px" : "168px";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        data-ml={ml}
        className={`
          fixed left-0 top-0 h-dvh ${w} z-50
          flex flex-col
          transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
          lg:translate-x-0
          ${isOpen ? "translate-x-0 shadow-2xl !w-[168px]" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          background: "linear-gradient(180deg, #1a1a1c 0%, #161618 100%)",
        }}
      >
        {/* Header */}
        <div className={`relative flex items-center ${collapsed ? "justify-center px-1.5 pt-4 pb-3" : "justify-between px-5 pt-5 pb-4"}`}>
          <button
            onClick={onClose}
            className="absolute right-2 top-3 p-1 rounded-lg text-white/25 hover:text-white/60 hover:bg-white/[0.08] lg:hidden transition-all duration-200"
            aria-label="关闭菜单"
          >
            <X size={15} strokeWidth={1.5} />
          </button>

          {collapsed ? (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-lg text-white/15 hover:text-white/40 transition-all duration-200"
            >
              <ChevronsRight size={15} strokeWidth={1.5} />
            </button>
          ) : (
            <>
              <a href="/" className="block flex-1">
                <h1 className="text-[15px] font-semibold text-white/95 tracking-[0.08em]">
                  货代导航网
                </h1>
              </a>
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex items-center justify-center w-5 h-5 rounded-md text-white/15 hover:text-white/40 transition-all duration-200"
                title="收起侧栏"
              >
                <ChevronsLeft size={13} strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>

        <div className={collapsed ? "mx-2.5" : "mx-4"}>
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        </div>

        {/* Nav */}
        <nav className={`flex-1 overflow-y-auto py-2.5 ${collapsed ? "px-1.5" : "px-2.5"} scrollbar-none`}>
          {categories.map((cat) => {
            const Icon = getIcon(cat.icon);
            const isActive = activeCategory === cat.name;

            if (collapsed) {
              return (
                <button
                  key={cat.id}
                  onClick={() => { onCategoryClick(cat.name); onClose(); }}
                  className={`
                    group/tip w-full flex flex-col items-center py-[6px] px-0.5 rounded-lg mb-0.5 transition-all duration-200
                    ${isActive
                      ? "bg-white/[0.12] text-white"
                      : "text-white/30 hover:text-white/60 hover:bg-white/[0.06]"
                    }
                  `}
                >
                  <Icon size={16} strokeWidth={isActive ? 2 : 1.5} className="flex-shrink-0" />
                  <span className={`text-[9px] leading-none mt-1 font-medium truncate max-w-full transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0 group-hover/tip:opacity-100"}`}>
                    {cat.name}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={cat.id}
                onClick={() => { onCategoryClick(cat.name); onClose(); }}
                className={`
                  w-full flex items-center gap-3 px-3 py-[9px] rounded-lg mb-0.5
                  text-[13px] tracking-[0.01em] transition-all duration-200
                  ${isActive
                    ? "bg-white/[0.12] text-white font-medium"
                    : "text-white/45 hover:bg-white/[0.06] hover:text-white/80 font-normal"
                  }
                `}
              >
                <Icon size={16} strokeWidth={isActive ? 2 : 1.5} className="flex-shrink-0" />
                <span className="truncate">{cat.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2.5 pb-3 pt-1">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-2.5" />
          {collapsed ? (
            <>
              {showPromoEntry && (
                <a
                  href="https://www.forwarderspn.com/spn?category=logistics-directory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/tip w-full flex flex-col items-center py-[6px] px-0.5 rounded-lg text-blue-400/50 hover:text-blue-400/80 hover:bg-white/[0.06] transition-all duration-200 mb-0.5 animate-[fadeSlideIn_0.5s_ease-out]"
                >
                  <BookOpen size={15} strokeWidth={1.5} />
                  <span className="text-[9px] leading-none mt-1 font-medium opacity-0 group-hover/tip:opacity-100 transition-opacity duration-200">
                    黄页
                  </span>
                </a>
              )}
              <button
                onClick={onSubmitClick}
                className="group/tip w-full flex flex-col items-center py-[6px] px-0.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-all duration-200"
              >
                <Plus size={15} strokeWidth={1.5} />
                <span className="text-[9px] leading-none mt-1 font-medium opacity-0 group-hover/tip:opacity-100 transition-opacity duration-200">
                  提交
                </span>
              </button>
            </>
          ) : (
            <>
              {showPromoEntry && (
                <a
                  href="https://www.forwarderspn.com/spn?category=logistics-directory"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-2.5 px-3 py-[9px] rounded-lg text-[12px] font-normal text-blue-400/50 hover:bg-white/[0.06] hover:text-blue-400/80 transition-all duration-200 mb-0.5 animate-[fadeSlideIn_0.5s_ease-out]"
                >
                  <BookOpen size={15} strokeWidth={1.5} />
                  <span>货代黄页</span>
                </a>
              )}
              <button
                onClick={onSubmitClick}
                className="group w-full flex items-center gap-2.5 px-3 py-[9px] rounded-lg text-[12px] font-normal text-white/40 hover:bg-white/[0.06] hover:text-white/70 transition-all duration-200"
              >
                <Plus size={15} strokeWidth={1.5} />
                <span>网址提交<span className="mx-1 text-white/15 group-hover:text-white/30">|</span><span className="text-white/30 group-hover:text-white/70">报错</span></span>
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
