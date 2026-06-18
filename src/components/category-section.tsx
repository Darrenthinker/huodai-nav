"use client";

import { getIcon, getCategoryBadge } from "@/lib/icons";
import { SiteCard } from "./site-card";
import type { Category, Site } from "@/lib/types";

interface Props {
  category: Category;
  sites: Site[];
  query: string;
  onClickTrack?: () => void;
  /** 标题标签：首页用 h2，独立分类页用 h1（利于 SEO），样式不变 */
  headingAs?: "h1" | "h2";
}

export function CategorySection({ category, sites, query, onClickTrack, headingAs = "h2" }: Props) {
  if (sites.length === 0) return null;
  const Icon = getIcon(category.icon);
  const Heading = headingAs;

  return (
    <section
      id={`cat-${category.id}`}
      className="mb-10 scroll-mt-20"
      aria-label={`${category.name}导航`}
    >
      <Heading className="flex items-center gap-2 text-[15px] font-semibold text-[#1d1d1f] mb-4">
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${getCategoryBadge(category.name)}`} aria-hidden="true">
          <Icon size={14} />
        </span>
        {category.name}
        <span className="text-[12px] font-normal text-[#86868b] ml-0.5" aria-label={`共${sites.length}个站点`}>{sites.length}</span>
      </Heading>
      <nav aria-label={`${category.name}站点列表`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
          {sites.map((site) => (
            <SiteCard key={site.id} site={site} query={query} onClickTrack={onClickTrack} />
          ))}
        </div>
      </nav>
    </section>
  );
}
