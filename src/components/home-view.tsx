"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { getCategories, getSites } from "@/lib/data";
import type { Site } from "@/lib/types";
import { Sidebar } from "@/components/sidebar";
import { SearchHeader } from "@/components/search-header";
import { CategorySection } from "@/components/category-section";
import { BackToTop } from "@/components/back-to-top";
import { ContactFloat } from "@/components/contact-float";
import { SubmitForm } from "@/components/submit-form";
import { PromoPopup } from "@/components/promo-popup";
import { categoryHref, categoryNameBySlug } from "@/lib/category-pages";
import { Search } from "lucide-react";

const categories = getCategories();
const allSites = getSites();

/**
 * 整页视图：首页 / 与各分类页 /[slug] 共用。
 * - 始终展示全部分类（可上下滚动浏览）。
 * - 点击侧栏分类：平滑滚动到该栏目，并把地址栏改为 /slug（无刷新）。
 * - 直接打开 /slug：进入后自动定位到该分类，并把该分类标题渲染为 H1（利于 SEO）。
 */
export function HomeView({ initialCategory }: { initialCategory?: string }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialCategory ?? categories[0]?.name ?? null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [frequentRefreshKey, setFrequentRefreshKey] = useState(0);
  const [showPromoEntry, setShowPromoEntry] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("huodai_promo_v2");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.filled) setShowPromoEntry(true);
      }
    } catch { /* */ }
  }, []);

  const scrollLockRef = useRef(false);

  // 直接进入 /slug 时，定位到对应分类
  useEffect(() => {
    if (!initialCategory) return;
    const cat = categories.find((c) => c.name === initialCategory);
    if (!cat) return;
    scrollLockRef.current = true;
    const t = setTimeout(() => {
      document.getElementById(`cat-${cat.id}`)?.scrollIntoView({ behavior: "auto", block: "start" });
      scrollLockRef.current = false;
    }, 60);
    return () => clearTimeout(t);
  }, [initialCategory]);

  const filteredSites = useMemo(() => {
    if (!query.trim()) return allSites;
    const q = query.toLowerCase();
    return allSites.filter((s) => {
      const title = (s.title ?? "").toLowerCase();
      const desc = (s.description ?? "").toLowerCase();
      const cat = (s.category ?? "").toLowerCase();
      return title.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }, [query]);

  const sitesByCategory = useMemo(() => {
    const map: Record<string, Site[]> = {};
    for (const cat of categories) {
      map[cat.name] = filteredSites.filter((s) => s.category === cat.name);
    }
    return map;
  }, [filteredSites]);

  // 点击分类：滚动到栏目 + 地址栏改为 /slug（不刷新）
  const scrollTo = useCallback((name: string) => {
    const cat = categories.find((c) => c.name === name);
    if (!cat) return;
    const el = document.getElementById(`cat-${cat.id}`);
    if (el) {
      scrollLockRef.current = true;
      setActiveCategory(name);
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", categoryHref(name));
      setTimeout(() => { scrollLockRef.current = false; }, 800);
    }
  }, []);

  // 滚动高亮当前分类
  useEffect(() => {
    const ids = categories.map((c) => ({ name: c.name, el: document.getElementById(`cat-${c.id}`) }));
    const onScroll = () => {
      if (scrollLockRef.current) return;
      let active: string | null = null;
      for (const { name, el } of ids) {
        if (el && el.getBoundingClientRect().top <= 150) active = name;
      }
      if (active) setActiveCategory(active);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 浏览器前进/后退时定位到对应分类
  useEffect(() => {
    const onPop = () => {
      const slug = window.location.pathname.replace(/^\//, "");
      if (!slug) { window.scrollTo({ top: 0 }); return; }
      const name = categoryNameBySlug(slug);
      const cat = name ? categories.find((c) => c.name === name) : undefined;
      if (cat) {
        document.getElementById(`cat-${cat.id}`)?.scrollIntoView({ behavior: "auto", block: "start" });
        setActiveCategory(cat.name);
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const mainMl = collapsed ? "lg:ml-[56px]" : "lg:ml-[156px]";

  return (
    <div className="flex min-h-dvh">
      <Sidebar
        categories={categories}
        activeCategory={activeCategory}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCategoryClick={scrollTo}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        onSubmitClick={() => setSubmitOpen(true)}
        showPromoEntry={showPromoEntry}
      />

      <main className={`flex-1 ${mainMl} min-w-0 transition-[margin] duration-250 ease-out`}>
        <SearchHeader
          query={query}
          onChange={setQuery}
          onMenuClick={() => setSidebarOpen(true)}
          filteredCount={filteredSites.length}
          frequentRefreshKey={frequentRefreshKey}
        />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {query.trim() && filteredSites.length === 0 ? (
            <div className="text-center py-20 text-[#86868b]">
              <Search size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">没有找到匹配的结果</p>
              <p className="text-sm mt-1">请尝试其他关键词</p>
            </div>
          ) : (
            categories.map((cat) => (
              <CategorySection
                key={cat.id}
                category={cat}
                sites={sitesByCategory[cat.name] || []}
                query={query}
                headingAs={initialCategory === cat.name ? "h1" : "h2"}
                onClickTrack={() => setFrequentRefreshKey((k) => k + 1)}
              />
            ))
          )}
        </div>

        <footer className="text-center py-2 border-t border-[#e5e5e5]/60">
          <p className="text-[11px] text-[#a1a1a6]">
            Copyright &copy; 2024-{new Date().getFullYear()} 仰度科技&nbsp;&nbsp;
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="text-[#a1a1a6] hover:text-[#0A84FF] transition-colors">
              粤ICP备2023049349号-2
            </a>
          </p>
        </footer>
      </main>

      <ContactFloat />
      <BackToTop />
      <SubmitForm open={submitOpen} onClose={() => setSubmitOpen(false)} />
      <PromoPopup onFilled={() => setShowPromoEntry(true)} />
    </div>
  );
}
