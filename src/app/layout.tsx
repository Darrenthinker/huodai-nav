import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "货代导航网 | 导航 资源 社群 | 货代agent",
  description: "货代导航网 - 国际物流行业最全的网址导航，涵盖空运、海运、快递、FBA头程、国际专线、海关查询等561+精选资源站点。一站式货代工具导航，助力国际物流从业者高效工作。",
  keywords: "货代导航网,货代导航,国际物流导航,货代网址导航,空运查询,海运查询,快递查询,FBA头程,国际专线,货代工具,物流工具,报关查询,海关查询,外贸物流,货代agent",
  openGraph: {
    title: "货代导航网 | 导航 资源 社群 | 货代agent",
    description: "国际物流行业最全的网址导航，涵盖空运、海运、快递、FBA头程等561+精选资源站点",
    url: "https://www.huodaiagent.com",
    siteName: "货代导航网",
    locale: "zh_CN",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.huodaiagent.com" },
  other: {
    "baidu-site-verification": "codeva-3BdHycRP8V",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hans">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#f5f5f7" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "货代导航网",
              alternateName: "货代agent",
              url: "https://www.huodaiagent.com",
              description: "国际物流行业最全的网址导航，涵盖空运、海运、快递、FBA头程等561+精选资源站点",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.huodaiagent.com/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
