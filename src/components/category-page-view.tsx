"use client";

import { useState, useMemo, useCallback } from "react";
import { getCategories, getSites } from "@/lib/data";
import { Sidebar } from "@/components/sidebar";
import { SearchHeader } from "@/components/search-header";
import { CategorySection } from "@/components/category-section";
import { BackToTop } from "@/components/back-to-top";
import { ContactFloat } from "@/components/contact-float";
import { SubmitForm } from "@/components/submit-form";
import { Search } from "lucide-react";

const categories = getCategories();
const allSites = getSites();

interface Props {
  /** 要展示的分类名，例如 "海关常用" */
  categoryName: string;
  /** 页面 H1 大标题 */
  heading: string;
  /** H1 下方的介绍文字（利于 SEO，服务端预渲染） */
  intro: string;
}

/**
 * 单分类落地页：复用首页同一套皮肤（侧栏 / 搜索头 / 卡片），
 * 仅展示某一个分类，并附带 H1 + 介绍文字，供搜索引擎与精准流量使用。
 * 首页结构与展示完全不受影响。
 */
export function CategoryPageView({ categoryName, heading, intro }: Props) {
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [frequentRefreshKey, setFrequentRefreshKey] = useState(0);

  const category = useMemo(
    () => categories.find((c) => c.name === categoryName),
    [categoryName]
  );

  const sites = useMemo(() => {
    const list = allSites.filter((s) => s.category === categoryName);
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter((s) => {
      const title = (s.title ?? "").toLowerCase();
      const desc = (s.description ?? "").toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [categoryName, query]);

  // 点击侧栏分类 → 回到首页对应分类锚点
  const goCategory = useCallback((name: string) => {
    const cat = categories.find((c) => c.name === name);
    window.location.href = cat ? `/#cat-${cat.id}` : "/";
  }, []);

  const mainMl = collapsed ? "lg:ml-[56px]" : "lg:ml-[156px]";

  return (
    <div className="flex min-h-dvh">
      <Sidebar
        categories={categories}
        activeCategory={categoryName}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onCategoryClick={goCategory}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
        onSubmitClick={() => setSubmitOpen(true)}
      />

      <main className={`flex-1 ${mainMl} min-w-0 transition-[margin] duration-250 ease-out`}>
        <SearchHeader
          query={query}
          onChange={setQuery}
          onMenuClick={() => setSidebarOpen(true)}
          filteredCount={sites.length}
          frequentRefreshKey={frequentRefreshKey}
        />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* SEO 介绍区：H1 + 描述 + 返回全部导航 */}
          <header className="mb-8">
            <nav className="text-[12px] text-[#86868b] mb-3" aria-label="面包屑">
              <a href="/" className="hover:text-[#0071e3] transition-colors">货代导航网</a>
              <span className="mx-1.5">/</span>
              <span className="text-[#1d1d1f]">{category?.name ?? categoryName}</span>
            </nav>
            <h1 className="text-[22px] sm:text-[26px] font-semibold text-[#1d1d1f] tracking-tight">
              {heading}
            </h1>
            <p className="mt-3 text-[13px] leading-relaxed text-[#6e6e73] max-w-3xl">
              {intro}
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-1 mt-4 text-[13px] text-[#0071e3] hover:underline"
            >
              查看全部货代导航 →
            </a>
          </header>

          {query.trim() && sites.length === 0 ? (
            <div className="text-center py-20 text-[#86868b]">
              <Search size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">没有找到匹配的结果</p>
              <p className="text-sm mt-1">请尝试其他关键词</p>
            </div>
          ) : category ? (
            <CategorySection
              category={category}
              sites={sites}
              query={query}
              onClickTrack={() => setFrequentRefreshKey((k) => k + 1)}
            />
          ) : null}
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
    </div>
  );
}
