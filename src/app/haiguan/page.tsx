import type { Metadata } from "next";
import { CategoryPageView } from "@/components/category-page-view";

const SITE_URL = "https://www.huodaiagent.com";

const HEADING = "各国海关官网大全";
const INTRO =
  "汇集全球主要国家与地区的官方海关网站及关税查询入口：中国海关、美国 CBP、欧盟 TARIC、英国、加拿大、日本、韩国、东南亚（新加坡/马来西亚/印尼/菲律宾/泰国/越南）、中东、非洲、南美等 90 多个国家海关官网，以及 HS 编码查询、报关归类、EORI 与 VAT 号码验证等常用工具，帮助货代与外贸从业者快速查询各国进口关税、海关申报与合规信息。";

export const metadata: Metadata = {
  title: "各国海关官网大全 - 美国/欧盟/日韩/东南亚海关查询",
  description:
    "货代导航网海关常用频道：汇集全球 90+ 国家官方海关网站与关税查询入口（美国CBP、欧盟TARIC、英国、日韩、东南亚、中东、南美等），以及HS编码、报关归类、EORI/VAT验证工具，帮助货代外贸快速查询各国进口关税与海关合规信息。",
  keywords: [
    "各国海关", "海关查询", "海关官网", "各国海关网址", "美国海关", "欧盟海关",
    "英国海关", "日本海关", "韩国海关", "东南亚海关", "中国海关", "关税查询",
    "进口关税查询", "HS编码查询", "报关归类", "EORI验证", "VAT验证", "海关报关",
  ],
  alternates: { canonical: `${SITE_URL}/haiguan` },
  openGraph: {
    title: "各国海关官网大全 - 美国/欧盟/日韩/东南亚海关查询 | 货代导航网",
    description:
      "汇集全球 90+ 国家官方海关网站与关税查询入口，以及 HS 编码、报关归类、EORI/VAT 验证工具。",
    url: `${SITE_URL}/haiguan`,
    siteName: "货代导航网",
    locale: "zh_CN",
    type: "website",
  },
};

export default function HaiguanPage() {
  return <CategoryPageView categoryName="海关常用" heading={HEADING} intro={INTRO} />;
}
