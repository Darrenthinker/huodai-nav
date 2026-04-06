import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://www.huodaiagent.com";
const SITE_TITLE = "货代导航网 | 导航 资源 社群 | 货代agent";
const SITE_DESC =
  "货代导航网 - 国际物流行业最全的网址导航，涵盖国际空运、海运、快递、FBA头程、国际专线、海关查询、报关工具等800+精选资源站点。一站式货代工具导航，助力国际物流从业者高效工作。";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f5f5f7",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: "/favicon.png",
  },
  title: {
    default: SITE_TITLE,
    template: "%s | 货代导航网",
  },
  description: SITE_DESC,
  keywords: [
    "货代导航网", "货代导航", "国际物流导航", "货代网址导航",
    "空运查询", "海运查询", "快递查询", "FBA头程", "国际专线",
    "货代工具", "物流工具", "报关查询", "海关查询", "外贸物流",
    "货代agent", "国际货代", "货运代理", "物流导航", "航空货运",
    "海运订舱", "集装箱查询", "运费查询", "物流资源",
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    url: SITE_URL,
    siteName: "货代导航网",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/favicon.png",
        width: 512,
        height: 512,
        alt: "货代导航网",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ["/favicon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: SITE_URL },
  other: {
    "baidu-site-verification": "codeva-3BdHycRP8V",
    "msvalidate.01": "",
    "google-site-verification": "",
    "applicable-device": "pc,mobile",
  },
  category: "国际物流",
};

/** 避免 JSON 中出现 </script> 等序列截断 HTML 解析、导致 head 内后续样式表不生效 */
function safeJsonForScript(obj: unknown) {
  return JSON.stringify(obj).replace(/</g, "\\u003c");
}

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "货代导航网",
    alternateName: ["货代agent", "国际物流导航", "货代导航"],
    url: SITE_URL,
    description: SITE_DESC,
    inLanguage: "zh-Hans",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "仰度科技",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    sameAs: [],
  },
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: SITE_TITLE,
    description: SITE_DESC,
    url: SITE_URL,
    mainEntity: {
      "@type": "ItemList",
      name: "国际物流货代导航资源",
      description: "涵盖国际空运、海运、快递、FBA头程、国际专线、海关查询等分类的货代导航资源",
      numberOfItems: 1260,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "自研工具", url: `${SITE_URL}/#cat-33` },
        { "@type": "ListItem", position: 2, name: "国际空运", url: `${SITE_URL}/#cat-6` },
        { "@type": "ListItem", position: 3, name: "国际快递", url: `${SITE_URL}/#cat-7` },
        { "@type": "ListItem", position: 4, name: "国际海运", url: `${SITE_URL}/#cat-8` },
        { "@type": "ListItem", position: 5, name: "FBA头程", url: `${SITE_URL}/#cat-9` },
        { "@type": "ListItem", position: 6, name: "国际专线", url: `${SITE_URL}/#cat-24` },
        { "@type": "ListItem", position: 7, name: "国际小包", url: `${SITE_URL}/#cat-34` },
        { "@type": "ListItem", position: 8, name: "海关常用", url: `${SITE_URL}/#cat-27` },
        { "@type": "ListItem", position: 9, name: "效率工具", url: `${SITE_URL}/#cat-29` },
        { "@type": "ListItem", position: 10, name: "外贸导航", url: `${SITE_URL}/#cat-30` },
        { "@type": "ListItem", position: 11, name: "打击老赖", url: `${SITE_URL}/#cat-31` },
        { "@type": "ListItem", position: 12, name: "新闻资讯", url: `${SITE_URL}/#cat-32` },
        { "@type": "ListItem", position: 13, name: "业务推荐", url: `${SITE_URL}/#cat-28` },
      ],
    },
  },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hans">
      <body className="font-sans antialiased min-w-0 overflow-x-hidden">
        {jsonLd.map((item, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonForScript(item) }}
          />
        ))}
        {children}
      </body>
    </html>
  );
}
