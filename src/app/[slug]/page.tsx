import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryPageView } from "@/components/category-page-view";
import {
  CATEGORY_PAGES,
  categoryNameBySlug,
  allCategorySlugs,
} from "@/lib/category-pages";

const SITE_URL = "https://www.huodaiagent.com";

// 仅生成已配置的分类页；其余路径 404
export const dynamicParams = false;

export function generateStaticParams() {
  return allCategorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = categoryNameBySlug(slug);
  const meta = name ? CATEGORY_PAGES[name] : undefined;
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.intro,
    keywords: meta.keywords,
    alternates: { canonical: `${SITE_URL}/${meta.slug}` },
    openGraph: {
      title: `${meta.title} | 货代导航网`,
      description: meta.intro,
      url: `${SITE_URL}/${meta.slug}`,
      siteName: "货代导航网",
      locale: "zh_CN",
      type: "website",
    },
  };
}

export default async function CategorySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = categoryNameBySlug(slug);
  const meta = name ? CATEGORY_PAGES[name] : undefined;
  if (!name || !meta) notFound();
  return <CategoryPageView categoryName={name} />;
}
