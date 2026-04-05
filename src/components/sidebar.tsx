"use client";

import { getIcon } from "@/lib/icons";
import type { Category } from "@/lib/types";
import { X, Plus, ChevronsLeft, ChevronsRight } from "lucide-react";

interface SidebarProps {
  categories: Category[];
  activeCategory: string | null;
  isOpen: boolean;
  onClose: () => void;
  onCategoryClick: (name: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSubmitClick: () => void;
}

export function Sidebar({
  categories, activeCategory, isOpen, onClose, onCategoryClick,
  collapsed, onToggleCollapse, onSubmitClick,
}: SidebarProps) {
  const w = collapsed ? "w-[56px]" : "w-[156px]";
  const ml = collapsed ? "56px" : "156px";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        data-ml={ml}
        className={`
          fixed left-0 top-0 h-dvh ${w} z-50
          flex flex-col
          transition-all duration-250 ease-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0 shadow-2xl !w-[156px]" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{ background: "linear-gradient(180deg, #353538 0%, #2c2c2f 100%)" }}
      >
        {/* Header */}
        <div className={`relative flex items-center ${collapsed ? "justify-center px-1.5 pt-3 pb-2" : "justify-between px-4 pt-4 pb-3"}`}>
          <button
            onClick={onClose}
            className="absolute right-1.5 top-2 p-1.5 rounded-md text-white/30 hover:text-white hover:bg-white/10 lg:hidden transition-colors"
            aria-label="关闭菜单"
          >
            <X size={16} />
          </button>

          {collapsed ? (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-md text-white/20 hover:text-white/50 transition-colors"
            >
              <ChevronsRight size={16} strokeWidth={1.5} />
            </button>
          ) : (
            <>
              <a href="/" className="block flex-1 text-center">
                <h1 className="text-[14px] font-bold text-white/90 tracking-[0.15em]">货代导航网</h1>
              </a>
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex items-center justify-center w-5 h-5 rounded text-white/20 hover:text-white/50 transition-colors duration-200"
                title="收起侧栏"
              >
                <ChevronsLeft size={13} strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>

        <div className={collapsed ? "mx-2" : "mx-3"} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

        {/* Nav */}
        <nav className={`flex-1 py-1.5 ${collapsed ? "px-1" : "px-2"}`}>
          {categories.map((cat) => {
            const Icon = getIcon(cat.icon);
            const isActive = activeCategory === cat.name;

            if (collapsed) {
              return (
                <button
                  key={cat.id}
                  onClick={() => { onCategoryClick(cat.name); onClose(); }}
                  className={`
                    group/tip w-full flex flex-col items-center py-[5px] px-0.5 rounded-md mb-[1px] transition-all duration-150
                    ${isActive
                      ? "bg-[#0A84FF]/20 text-[#64D2FF]"
                      : "text-white/35 hover:text-white/70 hover:bg-white/[0.07]"
                    }
                  `}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <span className={`text-[10px] leading-none mt-[3px] font-medium truncate max-w-full transition-opacity duration-150 ${isActive ? "opacity-100" : "opacity-0 group-hover/tip:opacity-100"}`}>
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
                  w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md mb-[1px]
                  text-[13px] transition-all duration-150
                  ${isActive
                    ? "bg-[#0A84FF]/20 text-[#64D2FF] font-semibold"
                    : "text-white/60 hover:bg-white/[0.07] hover:text-white/90 font-medium"
                  }
                `}
              >
                <Icon size={16} className="flex-shrink-0" />
                <span className="truncate">{cat.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/[0.06] p-1.5">
          {collapsed ? (
            <button
              onClick={onSubmitClick}
              className="group/tip w-full flex flex-col items-center py-[5px] px-0.5 rounded-md text-[#5ac8fa] hover:text-[#64D2FF] hover:bg-white/[0.07] transition-colors"
            >
              <Plus size={14} />
              <span className="text-[9px] leading-none mt-[3px] font-medium opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
                提交
              </span>
            </button>
          ) : (
            <button
              onClick={onSubmitClick}
              className="w-full flex items-center gap-2 px-2.5 py-[7px] rounded-md text-[12px] font-medium text-[#5ac8fa] hover:bg-white/[0.07] hover:text-[#64D2FF] transition-colors"
            >
              <Plus size={14} />
              <span>网址提交<span className="mx-0.5 text-white/20">|</span><span className="text-[#ff9f0a]">报错</span></span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
