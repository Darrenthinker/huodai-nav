// 分类落地页配置：每个分类对应一个独立 URL（/slug），用于 SEO 与精准流量。
// 首页 / 仍展示全部分类；侧栏点击跳转到对应分类页（客户端无刷新）。

export interface CategoryPageMeta {
  slug: string;
  title: string; // <title>（会自动追加 “| 货代导航网”）
  heading: string; // 页面 H1
  intro: string; // H1 下方介绍（服务端预渲染，利于 SEO）
  keywords: string[];
}

// key = navigation.json 中的分类名
export const CATEGORY_PAGES: Record<string, CategoryPageMeta> = {
  "自研工具": {
    slug: "tools",
    title: "货代自研工具 - 货代地图/MID生成器/代付税金/汇率换算",
    heading: "货代自研工具",
    intro:
      "货代导航网自主开发的实用工具集合：货代地图（国际机场 / 港口 / 海外仓查询）、MID 制造商识别码生成器、DHL/UPS 代付税金计算、货币汇率实时换算、货代知识库、货代电话销售系统等，助力货代从业者提升报价与操作效率。",
    keywords: ["货代工具", "货代地图", "MID生成器", "代付税金", "汇率换算", "货代知识库"],
  },
  "国际空运": {
    slug: "air",
    title: "国际空运查询大全 - 航司货物追踪/航班动态/空运轨迹",
    heading: "国际空运查询工具大全",
    intro:
      "汇集国际空运常用查询工具：各大航空公司货物追踪、航班动态与状态查询、空运聚合追踪（17Track / Track-trace）、机场三字代码、机型库、IATA 航司查询等，帮助货代快速查询空运货物轨迹与航班信息。",
    keywords: ["国际空运", "空运查询", "航空货运追踪", "航班查询", "空运轨迹", "机场三字代码"],
  },
  "国际快递": {
    slug: "express",
    title: "国际快递查询大全 - DHL/UPS/FedEx 追踪/燃油/支付税金",
    heading: "国际快递查询大全",
    intro:
      "汇集 DHL、UPS、FedEx、TNT、DPD、GLS 等全球快递的运单追踪、燃油附加费、偏远地区查询、在线支付税金、服务网点查询，以及各国本地快递追踪入口，货代快递操作一站查询。",
    keywords: ["国际快递查询", "DHL查询", "UPS查询", "FedEx查询", "快递追踪", "燃油附加费", "在线支付税金"],
  },
  "国际海运": {
    slug: "ocean",
    title: "国际海运查询大全 - 船公司船期/订舱/集装箱追踪",
    heading: "国际海运船期与订舱查询大全",
    intro:
      "汇集各大船公司船期查询、订舱、集装箱货物追踪、提单与换单、海运费查询等海运常用入口，帮助货代快速查询船期、舱位与箱况。",
    keywords: ["国际海运", "船期查询", "海运订舱", "集装箱追踪", "船公司查询", "提单查询"],
  },
  "FBA头程": {
    slug: "fba",
    title: "FBA头程查询大全 - 美国港口码头/CES集装箱/亚马逊仓库",
    heading: "FBA头程与美国港口查询大全",
    intro:
      "汇集亚马逊 FBA 头程常用工具：美国洛杉矶长滩 / 奥克兰 / 纽约新泽西等港口码头查询、美国 CES 集装箱查验放行查询、亚马逊仓库地址与分布、美国邮编与偏远查询等，助力 FBA 头程操作。",
    keywords: ["FBA头程", "美国港口码头", "CES查询", "亚马逊仓库地址", "集装箱查询", "美国邮编"],
  },
  "国际专线": {
    slug: "line",
    title: "国际专线查询大全 - 欧洲/美国/中东专线物流追踪",
    heading: "国际专线物流查询大全",
    intro:
      "汇集欧洲、美国、中东、东南亚等各国际专线物流的轨迹追踪与查询入口，帮助货代快速查询专线货物状态。",
    keywords: ["国际专线", "专线物流", "专线追踪", "欧洲专线", "美国专线"],
  },
  "国际小包": {
    slug: "parcel",
    title: "国际小包查询大全 - 各国邮政/小包轨迹追踪",
    heading: "国际小包查询大全",
    intro:
      "汇集各国邮政与国际小包的轨迹追踪查询入口，帮助货代与跨境卖家快速查询小包物流状态。",
    keywords: ["国际小包", "小包追踪", "邮政查询", "小包轨迹"],
  },
  "海关常用": {
    slug: "haiguan",
    title: "各国海关官网大全 - 美国/欧盟/日韩/东南亚海关查询",
    heading: "各国海关官网大全",
    intro:
      "汇集全球主要国家与地区的官方海关网站及关税查询入口：中国海关、美国 CBP、欧盟 TARIC、英国、加拿大、日本、韩国、东南亚（新加坡/马来西亚/印尼/菲律宾/泰国/越南）、中东、非洲、南美等 90 多个国家海关官网，以及 HS 编码查询、报关归类、EORI 与 VAT 号码验证等常用工具，帮助货代与外贸从业者快速查询各国进口关税、海关申报与合规信息。",
    keywords: ["各国海关", "海关查询", "海关官网", "各国海关网址", "美国海关", "欧盟海关", "关税查询", "HS编码查询", "EORI验证", "VAT验证"],
  },
  "效率工具": {
    slug: "efficiency",
    title: "外贸物流效率工具大全 - 单位换算/时区/距离/翻译",
    heading: "外贸物流效率工具大全",
    intro:
      "汇集货代外贸常用效率工具：全球港口距离与航程、汇率与单位换算、时区时间、地址与邮编、在线翻译等，提升日常操作效率。",
    keywords: ["效率工具", "港口距离", "汇率换算", "单位换算", "时区查询"],
  },
  "外贸导航": {
    slug: "trade",
    title: "外贸导航网址大全 - B2B平台/海关数据/外贸工具",
    heading: "外贸导航网址大全",
    intro:
      "汇集外贸常用网址：B2B 平台、海关数据、企业与买家查询、外贸工具与资源，帮助外贸从业者高效开发客户与查询信息。",
    keywords: ["外贸导航", "外贸网址", "B2B平台", "海关数据", "外贸工具"],
  },
  "打击老赖": {
    slug: "credit",
    title: "外贸企业信用与老赖查询 - 失信被执行人/工商查询",
    heading: "外贸企业信用与老赖查询",
    intro:
      "汇集企业信用、失信被执行人、工商信息等查询入口，帮助货代外贸在合作前核查对方资信、规避风险。",
    keywords: ["老赖查询", "失信被执行人", "企业信用查询", "工商查询"],
  },
  "新闻资讯": {
    slug: "news",
    title: "国际物流新闻资讯 - 货代/航运/外贸行业动态",
    heading: "国际物流新闻资讯",
    intro:
      "汇集国际物流、航运、空运、外贸行业的新闻资讯与信息来源，帮助货代从业者掌握行业动态。",
    keywords: ["物流新闻", "航运资讯", "货代资讯", "外贸动态"],
  },
  "业务推荐": {
    slug: "recommend",
    title: "货代业务推荐 - 优质货代资源与服务",
    heading: "货代业务推荐",
    intro: "汇集优质货代业务与服务资源推荐，帮助同行对接合作。",
    keywords: ["货代业务", "货代推荐", "货代资源"],
  },
};

/** 分类名 → /slug 路径；未配置则回首页锚点 */
export function categoryHref(categoryName: string): string {
  const meta = CATEGORY_PAGES[categoryName];
  return meta ? `/${meta.slug}` : "/";
}

/** slug → 分类名 */
export function categoryNameBySlug(slug: string): string | undefined {
  return Object.keys(CATEGORY_PAGES).find((name) => CATEGORY_PAGES[name].slug === slug);
}

/** 所有 slug（用于 generateStaticParams / sitemap） */
export function allCategorySlugs(): string[] {
  return Object.values(CATEGORY_PAGES).map((p) => p.slug);
}
