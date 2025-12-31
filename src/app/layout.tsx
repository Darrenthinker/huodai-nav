import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "货代导航网 | 导航 资源 社群",
  description: "货代导航网 - 国际物流行业最全的网址导航，涵盖空运、海运、快递、FBA头程等资源",
  keywords: "货代,国际物流,空运,海运,快递,FBA,导航",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" 
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

