import fs from 'fs';

const NAV_FILE = 'src/data/navigation.json';
const CATEGORY = '国际专线';

const FREIGHT_CARRIERS = [
  // 美国主要LTL/卡车运输
  ["ABF Freight", "https://www.abfs.com/", "美国LTL零担卡车 ABF"],
  ["Old Dominion Freight Line", "https://www.odfl.com/", "美国LTL零担 ODFL"],
  ["Southeastern Freight Lines", "https://www.sefl.com/", "美国LTL零担 东南区域"],
  ["YRC Freight", "https://yrc.com/", "美国LTL零担卡车 YRC"],
  ["Dayton Freight", "https://www.daytonfreight.com/", "美国LTL零担 中西部"],
  ["CrossCountry Freight", "https://ccfs.com/", "美国LTL跨区域货运"],
  ["Oak Harbor Freight Lines", "https://oakh.com/", "美国LTL零担 西北区域"],
  ["AM Trucking", "http://www.amtrucking.com/", "美国卡车运输 AM"],
  ["Pilot Freight Services", "https://www.pilotdelivers.com/", "美国货运 Maersk旗下"],
  ["Freightquote (C.H. Robinson)", "https://www.freightquote.com/", "美国货运报价平台 CH Robinson"],
  ["Frontline Freight", "http://frontlinefreightinc.com/", "美国货运 Frontline"],
  ["Best Yet Express", "https://www.bestyetexpresstrucking.com/", "美国卡车运输"],
  ["US Cargo", "https://www.us-cargo.com/", "美国货运 US Cargo"],
  ["Hercules Freight", "https://www.herculesfreight.com/", "美国货运 Hercules"],
  ["Performance Freight", "https://performancefreight.com/", "美国货运 Performance"],
  ["Maroon Freight", "https://www.maroonfreight.com/", "美国货运 Maroon"],
  ["TIG Freight", "https://www.tigfreight.com/", "美国货运 TIG"],
  ["Alliance Air Freight", "https://shipalliance.com/", "美国空运货代 Alliance"],

  // 国际/区域货运物流
  ["Cargo Partner", "https://www.cargo-partner.com/", "全球综合货运 奥地利 Cargo Partner"],
  ["Cargo International", "https://www.cargointernational.de/", "德国货运 Cargo International"],
  ["Rhenus Logistics", "https://freightportal.rhenus.cloud/tnt/login/auth", "德国物流巨头 Rhenus"],
  ["Cargoboard", "https://cargoboard.com/", "欧洲数字化货运平台"],
  ["Direct Freight Express", "https://www.directfreight.com.au/", "澳大利亚货运 Direct Freight"],
  ["COPE Sensitive Freight", "https://www.cope.com.au/", "澳大利亚精密货运 COPE"],
  ["Manga Freight", "https://mangafreight.co.nz/", "新西兰货运 Manga"],
  ["TRANSource Freightways", "https://transourcefreightways.com/", "新西兰货运 TRANSource"],
  ["Matson", "https://www.cargo.chinamatson.com/", "太平洋海运/货运 Matson"],
  ["Via Cargo", "https://viacargo.com.ar/", "阿根廷货运 Via Cargo"],
  ["Pullman Cargo", "https://www.pullmango.cl/", "智利货运 Pullman"],
  ["A Tiempo Cargo", "https://atiempocargo.com/", "拉美货运 A Tiempo"],
  ["Chunil Cargo", "https://www.chunil.co.kr/", "韩国货运 天一 Chunil"],
  ["PLUS Cargo Service", "https://www.plus-cs.co.jp/", "日本货运 プラスカーゴ"],
  ["AP Cargo", "https://apcargo.com.ph/", "菲律宾货运 AP Cargo"],
  ["Sentral Cargo", "https://sentralcargo.co.id/", "印尼货运 Sentral"],
];

const nav = JSON.parse(fs.readFileSync(NAV_FILE, 'utf8'));
const existHosts = new Set();
nav.sites.forEach(s => {
  try { existHosts.add(new URL(s.url).hostname.replace(/^www\./, '')); } catch {}
});

const zxItems = nav.sites.filter(s => s.category === CATEGORY);
const minOrder = Math.min(...zxItems.map(s => s.order));
let nextId = Math.max(...nav.sites.map(s => s.id)) + 1;
let order = minOrder - 0.01;
let added = 0, skipped = 0;

for (const [title, url, desc] of FREIGHT_CARRIERS) {
  let host;
  try { host = new URL(url).hostname.replace(/^www\./, ''); } catch { continue; }
  if (existHosts.has(host)) {
    console.log(`SKIP (exists): ${title} -> ${host}`);
    skipped++;
    continue;
  }
  existHosts.add(host);
  nav.sites.push({
    id: nextId++,
    title,
    url,
    description: desc,
    category: CATEGORY,
    order: order,
    thumbnail: ''
  });
  order -= 0.01;
  added++;
}

console.log(`\nAdded: ${added}, Skipped: ${skipped}`);
console.log(`国际专线 now has: ${nav.sites.filter(s=>s.category===CATEGORY).length} entries`);
console.log(`Total sites: ${nav.sites.length}`);
fs.writeFileSync(NAV_FILE, JSON.stringify(nav, null, 2) + '\n');
console.log('Saved!');
