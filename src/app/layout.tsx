import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "货代导航网 | 国际物流导航 资源 社群",
  description: "货代导航网 - 国际物流行业最全的网址导航，涵盖空运、海运、快递、FBA头程、国际专线、海关查询等556+精选资源站点",
  keywords: "货代,国际物流,空运,海运,快递,FBA头程,国际专线,货代导航,物流导航,报关,海关,外贸",
  openGraph: {
    title: "货代导航网 | 国际物流导航 资源 社群",
    description: "国际物流行业最全的网址导航，涵盖空运、海运、快递、FBA头程等556+精选资源站点",
    url: "https://huodaiagent.com",
    siteName: "货代导航网",
    locale: "zh_CN",
    type: "website",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://huodaiagent.com" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hans">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#f5f5f7" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
