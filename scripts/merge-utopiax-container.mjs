/**
 * 将 utopiax.org/containertracking.html 船公司集装箱追踪合并进 navigation.json
 * 插入「国际海运」分类、排序在现有最低 order（ASEAN SEAS LINE 等）之后。
 * 与站点已有「国际海运」同主机名（允许多标题白名单除外）或同标题则跳过。
 *
 * 运行: node scripts/merge-utopiax-container.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const navPath = path.join(__dirname, "../src/data/navigation.json");

/** 同一追踪域名允许多张卡片（ONE 系、长荣系等） */
const MULTI_HOST_SUFFIX = [
  "one-line.com",
  "smlines.com",
  "shipmentlink.com",
  "panocean.com",
  "tarros.it",
  "swireshipping.com",
  "cma-cgm.com", // ANL/CNC 等与达飞相关但用户可能分开展示：不加入，避免与达飞主页重复
];

function hostOf(u) {
  try {
    let s = String(u || "").trim();
    if (!s) return "";
    if (!/^https?:\/\//i.test(s)) s = "https://" + s;
    return new URL(s).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return "";
  }
}

function allowMultiHost(h) {
  if (!h) return false;
  return MULTI_HOST_SUFFIX.some((s) => h === s || h.endsWith("." + s));
}

/** @type {Array<[string, string, string]>} title, url, description */
const RAW = [
  ["ACL Atlantic Container Line", "http://www.aclcargo.com/trackCargo.php", "大西洋集装箱航运 北美/欧洲"],
  ["Alianca Navegaceo e Logistica Ltda.", "https://www.alianca.com.br/alianca/en/alianca/ecommerce_alianca/track_trace_alianca/index.html", "Alianca 巴西"],
  ["APL American President Line", "https://www.apl.com/", "美国总统轮船 APL 全球"],
  ["ARKAS LINE", "http://www.arkasline.com.tr/en/container_tracking.html", "Arkas 土耳其"],
  ["Bahri (NSCSA)", "https://www.bahri.sa/en/logistic-services/", "巴赫里航运 沙特 仅提单追踪"],
  ["CNC LINE Cheng Lie Navigation", "http://www.cnc-ebusiness.com/ebusiness/tracking", "正利航业 CNC 亚洲"],
  ["CONTAINER tracking", "http://www.seacargotracking.net/", "集装箱聚合追踪"],
  ["CROWLEY", "https://www.crowley.com/liner-shipment-tracking/", "克劳利海运 美国"],
  ["CULines China United Lines", "https://www.culines.com/en/site/bill", "中联航运 中国"],
  ["DHL Global Forwarding", "https://www.dhl.com/en/logistics/customer_resource_area/freight_tracking_and_applications/ocean_freight_tracking.html", "DHL全球货运 海运追踪"],
  ["EIMSKIP", "https://www.eimskip.com/customer-portal/", "Eimskip 北欧"],
  ["Emirates Shipping Line", "https://www.emiratesline.com/track/", "阿联酋航运 中东"],
  ["Ethiopian Shipping", "https://www.eslse.et/", "埃塞俄比亚航运 非洲"],
  ["Evergreen Lines", "http://www.shipmentlink.com/servlet/TDB1_CargoTracking.do", "长荣海运货运追踪 ShipmentLink"],
  ["FESCO", "https://www.fesco.ru/en/clients/tracking/", "俄远东船务 俄罗斯"],
  ["Gold Star Line", "https://www.gslltd.com.hk/#/track_shipment", "金星航运 香港"],
  ["Grieg Star Shipping (G2 Ocean)", "https://www.g2ocean.com/lookup-and-searches/#BoL", "G2 Ocean 件杂货/集装箱"],
  ["Grimaldi Lines", "https://www.gnet.grimaldi-eservice.com/GNET/Pages_GAtlas/WFContainerTracking", "Grimaldi 欧洲/滚装"],
  ["Hamburg-Sued (Columbus Line)", "https://www.hamburgsud.com/en/ecommerce/visibility/track-and-trace/", "汉堡南美 德国"],
  ["HDSLINES", "http://www.hdasco.com/default-52.aspx", "华德船务 中国"],
  ["HEUNG A Shipping", "https://ebiz.heungaline.com/Tracking", "兴亚海运 韩国"],
  ["HUGO STINNES", "https://www.stinnes-linien.de/TOOLS/Tracking-And-Tracing", "Stinnes Linien 德国"],
  ["Ignazio Messina Line", "https://www.messinaline.it/wps/wcm/connect/internet/messina_en/operativo/cntr_tracking/#tf-cntr_tracking", "Messina 意大利"],
  ["INTERASIA Lines", "http://www.interasia.cc/content/c_service/cargo_tracking.aspx?SiteID=1", "运达航运 亚洲 提单追踪"],
  ["Italia Marittima", "http://www.shipmentlink.com/servlet/TDB1_CargoTracking.do", "意大利海运 原劳埃德"],
  ["CARU containers", "https://portal.carucontainers.com/", "CARU 租箱 CARU/LCRU"],
  ["SEACO containers", "https://newseaweb.seacoglobal.com/sap/bc/ui5_ui5/sap/zseaco_ue15/index.html", "SEACO 租箱"],
  ["TRITON containers", "https://www.trtn.com/tritoncontainer/unitStatus/list", "TRITON 租箱 TRLU等"],
  ["UES containers", "http://www.ueshk.com/inquiries.aspx?classid=3&aid=5&leftid=18", "UES 租箱 UESU/GVDU"],
  ["Container info (generic)", "http://shipping-container-info.com/container-info/", "集装箱知识查询"],
  ["K-Line (ONE)", "https://ecomm.one-line.com/ecom/CUP_HOM_3301.do", "川崎汽船 K-Line ONE"],
  ["Kambara Kisen", "http://esvc.kambara-kisen.co.jp/clt/CUP_HOM_3301.do?sessLocale=en", "神原汽船 日本"],
  ["Kestrel Liner", "https://www.kestrel.com/uk/fcl-lcl", "Kestrel Liner 英国"],
  ["KMTC Line", "http://www.ekmtc.com/", "高丽海运 韩国"],
  ["MacAndrews", "https://www.macandrews.com/opdr-tracking/opdr-container-tracking/", "MacAndrews 欧洲"],
  ["MACS Shipping", "https://www.macship.com/E-BUSINESS/TrackingAndTracing.aspx", "MACS 非洲 需箱号+提单"],
  ["MARFRET Compagnie Maritime", "http://www.marfret.fr/en/container-tracking/", "MARFRET 法国"],
  ["Medkon Lines", "https://tracking.medkonlines.com/", "Medkon 地中海"],
  ["MOL (ONE)", "https://ecomm.one-line.com/ecom/CUP_HOM_3301.do", "商船三井 MOL ONE"],
  ["NAMSUNG Shipping", "https://ebiz.namsung.co.kr/", "南星海运 韩国"],
  ["NileDutch", "https://www.niledutch.com/en/schedules-tracking/track-your-container/", "尼罗河荷兰 非洲"],
  ["NYK Lines (ONE)", "https://ecomm.one-line.com/ecom/CUP_HOM_3301.do", "日本邮船 NYK ONE"],
  ["OT Africa Line", "http://www.cma-cgm.com/ebusiness/tracking", "非洲线 OTAL 达飞体系追踪"],
  ["PanOcean", "http://container.panocean.com/HP2401/hp2401.stx", "汎洋商船 韩国"],
  ["PASHA HAWAII", "https://www.pashahawaiishipping.com/public/track.htm", "Pasha Hawaii 美西"],
  ["PDL Pacific Direct Line", "http://www.pdl123.co.nz/track-and-trace/", "PDL 新西兰"],
  ["RCL Regional Container Lines", "http://www.rclgroup.com/", "宏海箱运 RCL 东南亚"],
  ["Royal Arctic Lines", "http://www.royalarcticline.com/", "皇家北极航运 格陵兰"],
  ["Safmarine", "https://www.safmarine.com/how-to-ship/tracking", "南非海运 Safmarine"],
  ["SCI Shipping Corporation of India", "http://www.shipindia.com/frontcontroller/track_trace", "印度航运公司"],
  ["Sealand Maersk", "https://www.sealandmaersk.com/welcome/tracking", "Sealand 马士基旗下"],
  ["SeaLead", "https://www.sea-lead.com/track-shipment/", "海领船务"],
  ["Sinokor", "http://www.sinokor.co.kr/", "长锦商船 韩国"],
  ["SM Line", "https://esvc.smlines.com/smline/CUP_HOM_3301.do", "森罗商船 SM Line"],
  ["Sofrana ANL", "http://www.anl.com.au/ebusiness/tracking", "Sofrana ANL 澳新"],
  ["Swire Shipping", "https://www.swireshipping.com/trackShipment", "太古轮船 亚洲"],
  ["Tarros", "http://www.tarros.it/traccia-container-en/", "Tarros 意大利"],
  ["Tasman Orient", "http://www.swireshipping.com/", "塔斯曼东方 太古系"],
  ["TOTE Maritime", "https://portal.totemaritime.com/Account/Login?ReturnUrl=%2f", "TOTE Maritime 美国"],
  ["T.S. Lines", "https://www.tslines.com/en/tracking", "德翔海运 台湾"],
  ["Trans Asia Lines", "http://www.tassgroup.com/", "泛亚航运 TASS"],
  ["Tropical Shipping", "https://www.tropical.com/track-shipments", "热带航运 加勒比"],
  ["Turkon Line", "https://myturkonline.turkon.com/tracking", "Turkon 土耳其/美国"],
  ["UAFL United Africa Feeder Line", "https://www.uaflshipping.com/home/tracking", "联合非洲支线"],
  ["Wallenius Wilhelmsen Logistics", "https://www.walleniuswilhelmsen.com/track-trace", "华轮威尔森 滚装/物流"],
  ["W.E.C. Lines", "https://weclines.com/track-and-trace/", "WEC Lines 欧洲"],
  ["Zim Line", "https://www.zim.com/tools/track-a-shipment", "以星航运 ZIM 集装箱追踪"],
];

function shouldSkip(title, url, existingSites) {
  const nt = title.trim().toLowerCase();
  const nh = hostOf(url);
  for (const ex of existingSites) {
    if (ex.category !== "国际海运") continue;
    const et = (ex.title || "").trim().toLowerCase();
    if (et === nt) return true;
    const eh = hostOf(ex.url);
    if (nh && eh && nh === eh && !allowMultiHost(nh)) return true;
  }
  return false;
}

const nav = JSON.parse(fs.readFileSync(navPath, "utf8"));
if (nav.sites.some((s) => s.category === "国际海运" && s.title === "ACL Atlantic Container Line")) {
  console.error("已合并过 utopiax 海运船公司（存在 ACL Atlantic Container Line），请勿重复运行。如需重做请先还原 navigation.json。");
  process.exit(1);
}

const sea = nav.sites.filter((s) => s.category === "国际海运");
const minOrder = Math.min(...sea.map((s) => s.order));
let order = minOrder - 0.000001;
let maxId = Math.max(...nav.sites.map((s) => s.id));
let added = 0;
const skipped = [];

for (const [title, url, description] of RAW) {
  if (shouldSkip(title, url, nav.sites)) {
    skipped.push({ title, reason: "duplicate-host-or-title" });
    continue;
  }
  maxId += 1;
  order -= 0.000001;
  nav.sites.push({
    id: maxId,
    title,
    url,
    description,
    category: "国际海运",
    order,
    thumbnail: "",
  });
  added++;
}

fs.writeFileSync(navPath, JSON.stringify(nav, null, 2) + "\n", "utf8");
console.log(`Added ${added} container lines. Skipped ${skipped.length}. New max id: ${maxId}`);
if (skipped.length) console.log("Skipped sample:", skipped.slice(0, 12));
