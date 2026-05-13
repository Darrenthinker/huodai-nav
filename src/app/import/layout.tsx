import type { Metadata } from "next";

const IMPORT_URL = "https://www.huodaiagent.com/import";
const IMPORT_DESC =
  "货代导航网 WordPress XML 数据导入工具，仅用于站点维护人员把旧站导航数据解析为 JSON 文件，不作为公开内容页参与搜索引擎索引。";

export const metadata: Metadata = {
  title: "WordPress XML 数据导入工具",
  description: IMPORT_DESC,
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: IMPORT_URL,
  },
  openGraph: {
    title: "WordPress XML 数据导入工具 | 货代导航网",
    description: IMPORT_DESC,
    url: IMPORT_URL,
    siteName: "货代导航网",
    locale: "zh_CN",
    type: "website",
  },
};

export default function ImportLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
