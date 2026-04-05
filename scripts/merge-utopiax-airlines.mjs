/**
 * 将 utopiax.org/index.html 航司追踪条目合并进 navigation.json
 * 排除站点「国际空运」中已存在的相同「二字码 + 三位前缀」卡片。
 * 运行: node scripts/merge-utopiax-airlines.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const navPath = path.join(__dirname, "../src/data/navigation.json");

/** @type {Array<[string, string, string]>} [title, url, description] — 来源 https://www.utopiax.org/index.html */
const RAW = [
  ["M3 549", "https://www.latamcargo.com/", "巴西拉美货运 ABSA / LATAM Cargo Brasil"],
  ["GB 832", "https://www.stratair.net/#!/tracking/", "ABX航空 ABX Air"],
  ["A3 390", "https://en.aegeanair.com/travel-information/cargo-services/", "爱琴海航空 Aegean Airlines"],
  ["EI 053 / 125", "https://www.iagcargo.com/en/home", "爱尔兰航空货运 Aer Lingus Cargo"],
  ["SU 555", "https://www.skyteam.com/en/cargo/track-shipment/", "俄罗斯航空 Aeroflot"],
  ["JK 543", "https://pathfinder.digitalfactory.aero/#/", "加勒比航空 Aerolinea Del Caribe / Aercaribe"],
  ["AR 044", "http://cargo.aerolineas.com.ar/en-us", "阿根廷航空 Aerolineas Argentinas"],
  ["6R 873", "https://www.aviancacargomexico.com/icargoauportal/portal/loginFlow", "墨航联盟货运 AeroUnion"],
  ["ZI 439", "http://www.network-airline.com/", "蓝鹰航空 Aigle Azur"],
  ["AH 124", "https://www.freight.aero/tracking.asp", "阿尔及利亚航空 Air Algerie"],
  ["G9 514", "https://cargo.airarabia.com/", "阿拉伯航空 Air Arabia"],
  ["I5 091", "https://airasiaindia.cargoflash.com/Tracking/AWB", "印度亚洲航空 AirAsia India"],
  ["KC 465", "https://www.freight.aero/tracking.asp", "阿斯塔纳航空 Air Astana"],
  ["BT 657", "https://www.airbaltic.com/en/cargo/online-services", "波罗的海航空 Air Baltic"],
  ["KF 142", "https://pathfinder.digitalfactory.aero/", "比利时航空 Air Belgium"],
  ["BP 636", "https://www.freight.aero/tracking.asp", "博茨瓦纳航空 Air Botswana"],
  ["RU 580", "https://www.airbridgecargo.com/en", "空桥货运 AirBridge Cargo"],
  ["AC 014", "https://www.aircanada.com/cargo/tracking", "加拿大航空 Air Canada"],
  ["VZ 510", "https://www.freight.aero/tracking.asp", "Airclass Lineas Aereas"],
  ["UX 996", "https://www.uxtracking.com/tracking.asp", "欧罗巴货运 Air Europa Cargo"],
  ["AF 057", "https://www.afklcargo.com/mycargo/shipment/singlesearch", "法国航空 Air France"],
  ["GL 631", "https://www.airgreenland.com/cargo/tracking-awb/", "格陵兰航空 Air Greenland"],
  ["LD 288", "http://www.hactl.com/en-US/Home.aspx", "香港航空货运 Air Hong Kong"],
  ["NX 675", "https://www.infoccsp.com/iportal/DefaultEN.aspx", "澳门航空 Air Macau"],
  ["MD 258", "http://195.64.139.84/datacair.com/track-trace/index.php", "马达加斯加航空 Air Madagascar"],
  ["KM 643", "https://www.freight.aero/tracking.asp", "马耳他航空 Air Malta"],
  ["MK 239", "https://www.airmauritius.com/cargo/track-shipment", "毛里求斯航空 Air Mauritius"],
  ["X8 658", "http://www.airmaxcargo.com.pe/AirsisWeb/tracking.xhtml", "Airmax Cargo"],
  ["9U 572", "http://www.airmoldova.md/cargo-check-en/", "摩尔多瓦航空 Air Moldova"],
  ["SW 186", "https://www.strike.aero/", "纳米比亚航空 Air Namibia"],
  ["YP 350", "https://pathfinder.digitalfactory.aero/#/", "普瑞米亚航空 Air Premia"],
  ["HC 490", "https://airsenegal.smartkargo.com/Login.aspx", "塞内加尔航空 Air Senegal"],
  ["HM 061", "https://www.airseychelles.com/portals/cargotracker/", "塞舌尔航空 Air Seychelles"],
  ["TN 244", "https://www.airtahitinui.com/nz-en/online-cargo-tracking", "大溪地航空 Air Tahiti Nui"],
  ["TS 649", "https://www.expaircargo.com/Tracking.aspx?awb=", "越洋航空 Air Transat"],
  ["AS 027", "https://cargo.alaskaair.com/Content/Tracking", "阿拉斯加航空 Alaska Airlines"],
  ["AZ 055", "https://booking.ita-airways-cargo.com/#/trackAndTrace", "ITA航空货运 ITA Airways Cargo (Alitalia)"],
  ["4W 574", "https://nastracking.awery.com/", "联合货运航空 Allied Air"],
  ["KH 687", "http://www.alohaaircargo.com/shipment-tracking/", "阿罗哈货运 Aloha Air Cargo"],
  ["8V 485", "https://network-airline.com/", "阿斯特拉尔航空 Astral Aviation"],
  ["AV 134", "https://www.aviancacargo.com/", "哥伦比亚航空货运 Avianca Cargo"],
  ["J2 771", "https://www.azal.az/en/information/cargo/", "阿塞拜疆航空 Azerbaijan Airlines"],
  ["AD 577", "https://azulcargoexpress.smartkargo.com/", "蓝色航空货运 Azul Cargo"],
  ["UP 111", "https://www.freight.aero/tracking.asp", "巴哈马航空 Bahamasair"],
  ["PG 829", "https://icargonet.ibsplc.aero/pgportal/portal/trackshipments?&trkTxnValue=829-", "曼谷航空 Bangkok Airways"],
  ["B2 628", "https://en.belavia.by/carriage%5Fof%5Fcargo/tracking/", "白俄罗斯航空 Belavia"],
  ["BG 997", "https://www.freight.aero/tracking.asp", "孟加拉比曼航空 Biman Bangladesh"],
  ["E6 417", "http://www.bringeraircargo.com/tracking/", "Bringer Air Cargo"],
  ["SN 082", "https://www.freight.aero/tracking.asp", "布鲁塞尔航空 Brussels Airlines"],
  ["FB 623", "http://195.64.139.84/datacair.com/track-trace/index.php", "保加利亚航空 Bulgaria Air"],
  ["MO 622", "https://cargo.calmair.com/WebContent/EN/CargoTracking", "Calm Air"],
  ["QC 040", "https://www.freight.aero/tracking.asp", "喀麦隆航空 Camair-Co"],
  ["P3 560", "http://www.cargologicair.com/cargo-tracking/", "Cargologicair"],
  ["C8 356", "https://www.cargolux.com/track-and-Trace", "卢森堡意大利货运 Cargolux Italia"],
  ["BW 106", "https://cargo.caribbean-airlines.com/#/track", "加勒比航空 Caribbean Airlines"],
  ["KX 378", "http://www.newcaymancargo.com/", "开曼航空 Cayman Airways"],
  ["5J 203", "https://cebu.smartkargo.com/", "宿务航空 Cebu Air"],
  ["X7 744", "https://www.challenge-group.com/tracking/", "挑战航空比利时 Challenge Airlines BE"],
  ["X6 752", "https://www.challenge-group.com/tracking/", "挑战航空马耳他 Challenge Airlines MT"],
  ["2C 003", "https://pathfinder.digitalfactory.aero/#/", "达飞航空货运 CMA CGM Air Cargo"],
  ["CO 354", "http://www.aiacargo.com/", "Cobaltair"],
  ["CM 230", "http://www.copacargo.com/", "巴拿马航空货运 Copa Airlines Cargo"],
  ["CD 503", "https://pathfinder.digitalfactory.aero/", "Corendon Airlines"],
  ["SS 923", "https://pathfinder.digitalfactory.aero/", "科西嘉航空 Corsair"],
  ["7C 575", "http://www.coyneair.com/", "科因航空 Coyne Airways"],
  ["OU 831", "https://www.freight.aero/tracking.asp", "克罗地亚航空 Croatia Airlines"],
  ["CU 136", "https://www.freight.aero/tracking.asp", "古巴航空 Cubana de Aviacion"],
  ["CY 048", "https://www.freight.aero/tracking.asp", "塞浦路斯航空 Cyprus Airways"],
  ["D5 992", "https://aviationcargo.dhl.com/", "DHL Aero Expreso"],
  ["ER 423", "https://aviationcargo.dhl.com/", "DHL Aviation/DHL Airways"],
  ["ES 155", "https://aviationcargo.dhl.com/", "DHL Aviation"],
  ["QY 615", "https://aviationcargo.dhl.com/", "DHL European Air Transport"],
  ["KA 043", "https://www.cathaypacificcargo.com/en-us/manageyourshipment/trackyourshipment.aspx", "港龙航空 Dragonair"],
  ["MS 077", "http://egyptair-cargo.com/home.htm", "埃及航空 Egyptair"],
  ["LY 114", "https://www.elal.com/en/Cargo/Pages/Online-Tracking.aspx", "以色列航空 EL AL"],
  ["E7 355", "http://www.estafeta.com/services/cargo/air-cargo/tracking.aspx", "Estafeta Carga Aerea"],
  ["OV 960", "http://www.sychene.com/Tracking.aspx", "爱沙尼亚航空 Estonian Air"],
  ["FX 023", "https://www.fedex.com/apps/fedextrack/", "联邦航空 FedEx"],
  ["FZ 141", "http://prdcgofz.mercator.com/skychain/app?service=page/nwp:Trackshipmt", "迪拜飞航货运 flydubai cargo"],
  ["5F 130", "https://pathfinder.digitalfactory.aero/", "Fly One"],
  ["GY 013", "http://195.64.139.84/datacair.com/track-trace/index.php", "加蓬航空 Gabon Airlines"],
  ["5S 301", "https://globalairt.com/cargo/", "Global Aviation and Services"],
  ["G3 127", "https://servicos.gollog.com.br/Home/Inicio", "巴西GOL航空 Gol Airlines"],
  ["UO 128", "https://www.freight.aero/tracking.asp", "香港快运 Hong Kong Express"],
  ["IB 075", "https://www.iagcargo.com/", "伊比利亚航空 Iberia"],
  ["E9 783", "https://pathfinder.digitalfactory.aero/", "Iberojet / Evelop Airlines"],
  ["7I 958", "http://www.inselaircargo.com/Tracking.2561", "Insel Air Cargo"],
  ["IR 096", "https://www.freight.aero/tracking.asp", "伊朗航空 Iran Air"],
  ["7C 806", "https://cargo.jejuair.net/cargo/main.do", "济州航空 Jeju Air"],
  ["9W 589", "http://cargo.jetairways.com/cargoview/", "捷特航空 Jet Airways"],
  ["QJ 508", "http://www.jet-airways.com/", "Jet Airways Inc. (US)"],
  ["TB 754", "http://web.ana-aviation.com/", "Jetairfly"],
  ["0J 254", "http://www.strike.aero/", "Jet Club"],
  ["3K 375", "http://jetstar.cargovision.ca/", "捷星亚洲航空 Jetstar Asia Airways"],
  ["3J 535", "https://www.freight.aero/tracking.asp", "朱巴航空 Jubba Airways"],
  ["HO 018", "http://cargo.juneyaoair.com/Index%5Fen.aspx", "吉祥航空 Juneyao Air"],
  ["KL 074", "https://www.afklcargo.com/mycargo/shipment/singlesearch", "荷兰皇家货运 KLM Cargo"],
  ["KU 229", "https://www.kuwaitairways.com/en/cargo/tracking", "科威特航空 Kuwait Airways"],
  ["LR 133", "http://www.aviancacargo.com/", "哥斯达黎加LACSA LACSA Airlines"],
  ["LA 045", "http://www.lancargo.com/", "南美航空 LAN Airlines (LATAM)"],
  ["XL 462", "http://www.lancargo.com/", "厄瓜多尔LAN LAN Ecuador"],
  ["LQ 961", "https://corp.cambodia-airports.aero/en/cargo/phnom-penh-cargo-tracking", "澜湄航空 Lanmei Airlines"],
  ["4L 174", "https://lascargo.com/en/tracking-en/", "LAS Cargo"],
  ["JJ 957", "https://www.latamcargo.com/en/trackshipment", "巴西南美航空 LATAM Brasil / TAM"],
  ["L7 976", "https://www.latamcargo.com/en/trackshipment", "南美货运哥伦比亚 LATAM Cargo Colombia"],
  ["L7 985", "https://www.latamcargo.com/en/trackshipment", "南美货运哥伦比亚 LATAM Cargo Colombia"],
  ["LI 140", "http://www.liat.com/navSource.html?page_id=159", "背风群岛航空 LIAT Airlines"],
  ["ME 076", "https://www.mea.com.lb/english/Plan-and-Book/Cargo", "中东航空 Middle East Airlines"],
  ["OD 816", "http://cargo.malindoair.com/AWBTracking.aspx", "马印航空 Malindo Airways"],
  ["AE 803", "http://www.mandarin-airlines.com/cargo%5Fnew/index.htm", "华信航空 Mandarin Airlines"],
  ["MP 129", "https://www.afklcargo.com/mycargo/shipment/singlesearch", "马丁货运 Martinair Cargo"],
  ["M7 865", "https://masair.smartkargo.com/Login.aspx", "墨西哥 MASAir"],
  ["T8 137", "http://www.mcs-aerocarga.com/trackingMam.php?Idioma=Ing", "MCS Aerocarga de Mexico"],
  ["4X 805", "https://www.mercuryamericas.com/tracking.html", "Mercury Americas"],
  ["CP 233", "https://www.mscaircargo.com/en/tracking", "MSC Air Cargo"],
  ["2Y 585", "https://www.myindoairlines.com/", "My Indo Airlines"],
  ["N8 416", "https://www.nationalaircargo.com/track/", "National Air Cargo"],
  ["NO 703", "https://world-cs.de/", "Neos SPA"],
  ["NO 519", "https://www.freight.aero/tracking.asp", "尼日尔货运航空 Niger Air Cargo"],
  ["DD 596", "https://pathfinder.digitalfactory.aero/", "皇雀航空 Nok Air"],
  ["N0 506", "https://norsetracking.awery.com/", "北大西洋航空 Norse Atlantic Airways"],
  ["Z0 536", "https://norsetracking.awery.com/", "Norse Atlantic UK"],
  ["NC 345", "https://www.nac.aero/shipment-tracking/", "北方货运航空 Northern Air Cargo"],
  ["DY 328", "https://www.norwegiancargo.com/", "挪威航空 Norwegian Air Shuttle"],
  ["DI 762", "https://www.norwegiancargo.com/", "挪威航空英国 Norwegian Air UK"],
  ["OA 050", "https://www.olympicair.com/en/Info/Cargo", "奥林匹克航空 Olympic Airways"],
  ["PK 214", "https://www.freight.aero/tracking.asp", "巴基斯坦国际航空 Pakistan Int'l Airlines"],
  ["PC 624", "http://www.pegasuscargo.com/en/default.aspx", "飞马货运 Pegasus Cargo"],
  ["TH 539", "https://cargo.rayaairways.com/Tracking/AWB/", "拉亚航空 Raya Airways"],
  ["AT 147", "https://www.freight.aero/tracking.asp", "摩洛哥皇家航空 Royal Air Maroc"],
  ["BI 672", "https://www.flyroyalbrunei.com/rba/cargospot/", "文莱皇家航空 Royal Brunei Airlines"],
  ["RJ 512", "http://rj-cargo.com/track-and-trace", "约旦皇家航空 Royal Jordanian"],
  ["R4 827", "http://www.rusaviation.com/#e&tracking&", "RUS Aviation"],
  ["WB 459", "https://www.rwandair.com/business-solutions/cargo-tracking/", "卢旺达航空 RwandAir"],
  ["S6 817", "http://www.southamericanairways.com/tracking%5Fsummary.asp", "南美航空 SAC South American Airways"],
  ["SK 117", "https://www.sascargo.com/en/Booking/Track-Shipment", "北欧航空 SAS"],
  ["SP 737", "http://www.sata.pt/en/other-services/cargo-tracking", "SATA亚速尔 SATA Air Acores"],
  ["S4 331", "http://www.sata.pt/en/other-services/cargo-tracking", "SATA International"],
  ["FM 774", "http://cargo2.ceair.com/mu/", "上海航空 Shanghai Airlines"],
  ["S7 421", "https://www.freight.aero/tracking.asp", "西伯利亚航空 Siberia Airlines"],
  ["MI 629", "http://www.siacargo.com/", "胜安航空 Silk Air"],
  ["ZP 463", "https://www.freight.aero/tracking.asp", "丝绸之路航空 Silk Way Airlines"],
  ["GW 358", "https://www.freight.aero/tracking.asp", "Skygreece Airlines"],
  ["KY 576", "http://www.skyleasecargo.com/", "Skylease Cargo"],
  ["OO 302", "https://www.deltacargo.com/Cargo/", "美西航空 Sky West Airlines"],
  ["4S 644", "http://solarcargo.cargolink.aero/tracking/", "Solar Cargo"],
  ["WN 526", "https://www.swacargo.com/swacargo_com_ui/manage/tracking", "西南航空 Southwest Airlines"],
  ["4E 242", "https://www.freight.aero/tracking.asp", "Stabo Air"],
  ["QP 321", "http://www.starlightairline.com/track%5Fshipment.aspx", "星光航空 Starlight Airlines"],
  ["JX 189", "https://www.starluxcargo.com/", "星宇货运 Starlux Cargo"],
  ["DK 630", "https://pathfinder.digitalfactory.aero/", "Sunclass Airlines"],
  ["LX 724", "https://tools.swissworldcargo.com/en/track%5Fn%5Ftrace", "瑞士国际航空 Swiss"],
  ["RB 070", "https://www.freight.aero/tracking.asp", "叙利亚航空 Syrian Arab Airlines"],
  ["DT 118", "https://www.freight.aero/tracking.asp", "安哥拉航空 TAAG"],
  ["B1 901", "https://www.tabairlines.com/", "玻利维亚TAB航空 TAB"],
  ["TA 202", "http://www.aviancacargo.com", "中美洲航空 TACA"],
  ["RO 281", "https://www.freight.aero/tracking.asp", "罗马尼亚航空 Tarom"],
  ["UK 228", "https://www.airvistara.com/trip/cargo-services", "维斯塔拉货运 Vistara Cargo"],
  ["GS 826", "https://www.hnacargo.com/Portal2/AwbSearch.aspx", "天津航空 TianJin Airlines"],
  ["T0 530", "http://www.aviancacargo.com/", "TACA秘鲁 Trans American Airways"],
  ["CB 456", "https://www.tccargo.us/en/tracking-2/", "TransCaribbean Cargo"],
  ["TB 612", "https://pathfinder.digitalfactory.aero/", "途易航空 TUI Airlines"],
  ["TU 199", "http://prdcgotu.mercator.com/skychain/app?service=page/nwp:Trackshipmt", "突尼斯航空 Tunisair"],
  ["PS 566", "https://www.freight.aero/tracking.asp", "乌克兰国际航空 Ukraine Int'l Airlines"],
  ["B7 525", "http://www.brcargo.com/ec%5Fweb/Default.aspx", "立荣航空 Uni Airways"],
  ["UW 699", "http://www.uni-top.com:8081/CargoTracking/queryWaybill.aspx", "友和道通航空 Uni-Top Airlines"],
  ["U6 262", "https://cargo.uralairlines.ru/en/services/tracking/", "乌拉尔货运 Ural Airlines Cargo"],
  ["HY 250", "https://ebooking.champ.aero/trace/HY/trace.asp", "乌兹别克斯坦航空 Uzbekistan Airways"],
  ["RG 042 / 183", "http://apps.traxon.com/rg042.htm", "巴西航空 VARIG"],
  ["VJ 978", "https://cargo.vietjetair.com/", "越捷航空 Vietjet"],
  ["VN 738", "https://track.champ.aero/vn", "越南航空 Vietnam Airlines"],
  ["V4 946", "https://aviationcargo.dhl.com/aviationcargo/", "Vensecar Internacional"],
  ["VS 932", "https://www.virginatlanticcargo.com/gb/en.html", "维珍货运 Virgin Atlantic"],
  ["WS 838", "https://cargo.westjet.com/Tracking.aspx?Culture=EN", "西捷货运 Westjet Cargo"],
  ["W6 284", "http://www.utl-log.com/waybill", "威兹航空 Wizz Air"],
  ["WW 377", "http://tracecargo.info/track.php", "WOW Air"],
  ["MF 731", "https://cargo.xiamenair.com/Cargo/English/Search.html?status=1", "厦门航空 XiamenAir"],
  ["SE 473", "https://www.wfs.aero/tracking-page/", "XL Airways France"],
  ["IY 635", "https://yemenia.com/cargo", "也门航空 Yemenia Yemen Airways"],
];

function primaryKeyFromTitle(title) {
  const t = title.trim();
  const m = t.match(/^([A-Z0-9]{2})\s+(\d{3})/);
  if (!m) return null;
  return `${m[1]} ${m[2]}`;
}

function collectExistingKeys(sites) {
  const keys = new Set();
  for (const s of sites) {
    if (s.category !== "国际空运") continue;
    const k = primaryKeyFromTitle(s.title);
    if (k) keys.add(k);
  }
  return keys;
}

const nav = JSON.parse(fs.readFileSync(navPath, "utf8"));
if (nav.sites.some((s) => s.category === "国际空运" && s.title === "M3 549")) {
  console.error("已合并过 utopiax 航司数据（存在 M3 549），请勿重复运行。如需重做请先还原 navigation.json。");
  process.exit(1);
}
const existing = collectExistingKeys(nav.sites);
let maxId = Math.max(...nav.sites.map((s) => s.id));
let order = 996.999999;
const added = [];
const skipped = [];

for (const [title, url, description] of RAW) {
  const k = primaryKeyFromTitle(title);
  if (!k) {
    skipped.push({ title, reason: "no-key" });
    continue;
  }
  if (existing.has(k)) {
    skipped.push({ title, reason: "duplicate", key: k });
    continue;
  }
  existing.add(k);
  maxId += 1;
  order -= 0.000001;
  nav.sites.push({
    id: maxId,
    title,
    url,
    description,
    category: "国际空运",
    order,
    thumbnail: "",
  });
  added.push(title);
}

fs.writeFileSync(navPath, JSON.stringify(nav, null, 2) + "\n", "utf8");

console.log(`Added ${added.length} airlines. Skipped ${skipped.length}.`);
if (skipped.length) console.log("Skipped sample:", skipped.slice(0, 15));
console.log("New max id:", maxId);
