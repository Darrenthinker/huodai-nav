import fs from 'fs';

const CSV_FILE  = 'C:/Users/Administrator/Desktop/carriers.csv';
const NAV_FILE  = 'src/data/navigation.json';

// ─── Parse CSV ───
const text = fs.readFileSync(CSV_FILE, 'utf8');
const csvLines = text.split('\n').filter(l => l.trim());
const csvRows = [];
for (let i = 1; i < csvLines.length; i++) {
  const line = csvLines[i];
  const fc = line.indexOf(',');
  const lc = line.lastIndexOf(',');
  if (fc < 0) continue;
  const key    = parseInt(line.substring(0, fc));
  const url    = line.substring(lc + 1).trim();
  const middle = line.substring(fc + 1, lc);
  const parts  = middle.split(',');
  csvRows.push({
    key,
    name_en: (parts[0] || '').trim(),
    name_cn: (parts[1] || '').trim(),
    name_hk: (parts[2] || '').trim(),
    url
  });
}
console.log(`CSV parsed: ${csvRows.length} rows`);

// ─── Load navigation.json ───
const nav = JSON.parse(fs.readFileSync(NAV_FILE, 'utf8'));
const beforeCount = nav.sites.length;

// Build host set of existing entries
const existHosts = new Set();
nav.sites.forEach(s => {
  try { existHosts.add(new URL(s.url).hostname.replace(/^www\./, '')); } catch {}
});

// ─── Category 1: National Postal Services (key < 100000) → 国际小包 ───
const postalRows = csvRows.filter(r => r.key < 100000);

// ─── Category 2: Known International Couriers (key 100000-109999) ───
const INTL_KEYWORDS = [
  'DHL','UPS','FedEx','TNT','GLS','Aramex','DPD','Hermes','Evri',
  'Toll','DPEX','Asendia','Yodel','Chronopost','PostNL','InPost',
  'Mondial Relay','Colissimo','Correos','Purolator','SF Express',
  'Skynet','CDEK','Sagawa','Yamato','i-Parcel','Landmark',
  'Pitney Bowes','Estafeta','OnTrac','Ninja Van','J&T',
  'Flash Express','Kerry','LaserShip','Sendle','Fastway',
  'StarTrack','CouriersPlease','Blue Dart','Delhivery',
  'Ecom Express','DTDC','XpressBees','Pos Laju','GD Express',
  'CJ Logistics','Kuroneko','Japan Post','SingPost',
  'Royal Mail','Parcelforce','La Poste','Swiss Post',
  'Deutsche Post','Austrian Post','Norway Post','Sweden Post',
  'Finland Post','Czech Post','Poland Post','Omniva',
  'Malta Post','Serbia Post','Slovakia Post','Slovenia Post',
  'Romania Post','Bulgaria Post','Croatia Post','Hungary Post',
  'SMSA','Fetchr','Naqel','SPL','ELTA','An Post',
  'MRW','Envialia','Correos Express','BRT','Bartolini',
  'Poste Italiane','SDA','Nexive','ABX Express',
  'Pos Indonesia','Thailand Post','VietNam Post','PHLPost',
  'Meest','Nova Poshta','Russian Post','EMS',
  'Cainiao','4PX','Yanwen',
];
const CHINESE_LOGISTICS = /物流|货运|速递|快运|专线|仓储|供应链|转运|圆通|中通|韵达|百世|极兔|申通|天天|宅急送|邮政|优速|德邦|京东|安能|跨越/;

const bRange = csvRows.filter(r => r.key >= 100000 && r.key < 110000);
const intlCouriers = bRange.filter(r => {
  const combined = (r.name_en + ' ' + r.name_cn).toLowerCase();
  return INTL_KEYWORDS.some(k => combined.includes(k.toLowerCase()));
});

// ─── Category 3: Curated well-known regional carriers ───
const CURATED_KEYS = new Set([
  // Southeast Asia
  100086, // JNE Express (Indonesia)
  100124, // Ninjavan (SG)
  100264, // LBC Express (Philippines)
  100354, // 2GO (Philippines)
  100391, // BEST EXPRESS (Thailand)
  100511, // IDexpress Indonesia
  100586, // Lion Parcel (Indonesia)
  100589, // Anteraja (Indonesia)
  100590, // SiCepat (Indonesia)
  100588, // TIKI (Indonesia)
  100593, // GHN Giao Hang Nhanh (Vietnam)
  100611, // Viettel Post (Vietnam)
  100228, // JDL Express (Indonesia)
  100344, // SAP Express (Indonesia)

  // India / South Asia
  100056, // Ekart (Flipkart)
  100102, // Shadowfax
  100180, // Trackon
  100260, // TCS (Pakistan)
  100279, // The Professional Couriers (India)
  100366, // Leopards Courier (Pakistan)
  100098, // BlueEx (Pakistan)
  100505, // Trax (Pakistan)
  100662, // Shiprocket (India)
  100717, // Gati (India)
  100683, // Safexpress (India)

  // Japan / Korea
  100163, // Tonami
  100171, // Seino
  100266, // Hanjin (Korea)
  100506, // Lotte Global Logistics (Korea)
  100599, // Fukuyama Transporting
  100601, // Nippon Express
  100748, // Kintetsu World Express (KWE)

  // Europe
  100027, // Colis Privé (France)
  100050, // UK Mail
  100070, // ACS (Greece)
  100114, // CTT Express (Portugal/Spain)
  100132, // Packeta (Czech)
  100157, // Boxberry (Russia)
  100161, // Matkahuolto (Finland)
  100174, // Cargus (Romania)
  100176, // PPL CZ
  100186, // DSV
  100196, // EURODIS
  100206, // DB Schenker
  100213, // Spring GDS
  100218, // Venipak (Lithuania)
  100265, // Express One (Hungary)
  100315, // SPEEDEX (Greece)
  100320, // Sameday (Romania)
  100342, // DACHSER (Germany)
  100419, // Zásilkovna (Czech)
  100423, // Bring (Norway)
  100436, // Nacex (Spain)
  100438, // Seur (Spain)
  100461, // RelaisColis (France)
  100484, // DX (UK)
  100568, // Econt (Bulgaria)
  100609, // Budbee (Sweden)
  100629, // FAN Courier (Romania)

  // Middle East / Turkey
  100058, // Posta Plus
  100082, // Zajil Express
  100100, // Wing
  100165, // SAEE (Saudi)
  100296, // AJEX
  100348, // Yurtici Kargo (Turkey)
  100607, // Aras Kargo (Turkey)
  100642, // HepsiJET (Turkey)

  // Latin America
  100138, // Redpack (Mexico)
  100147, // Paquetexpress (Mexico)
  100199, // OCA (Argentina)
  100246, // Starken (Chile)
  100250, // Blue Express (Chile)
  100278, // Chilexpress (Chile)
  100457, // Loggi Express BR (Brazil)
  100477, // 99Minutos (Mexico)
  100491, // Inter Rapidisimo (Colombia)
  100493, // Coordinadora (Colombia)
  100495, // Servientrega (Colombia)
  100497, // Andreani (Argentina)

  // North America
  100061, // TForce Final Mile
  100134, // UniUni (Canada)
  100146, // Canpar Express (Canada)
  100205, // Loomis Express (Canada)
  100337, // LSO (US)
  100447, // Spee-Dee Delivery (US)
  100406, // Day & Ross (Canada)
  100555, // Intelcom (Canada)

  // Africa
  100184, // The Courier Guy (South Africa)
  100131, // CourierPlus Nigeria
  100307, // Speedaf (Africa)

  // Australia / NZ
  100233, // Hunter Express
  100414, // Border Express
  100507, // Mainfreight
  100592, // New Zealand Couriers

  // Global logistics
  100164, // Kuehne Nagel
  100251, // Agility
  100254, // XPO
  100270, // Expeditors
  100297, // CEVA Logistics
  100332, // SEKO Logistics
  100356, // GEODIS
  100518, // Hellmann
  100686, // Yusen Logistics
]);

const curatedRows = bRange.filter(r => CURATED_KEYS.has(r.key));

// Merge category 2 + 3 (dedup by key)
const courierKeySet = new Set();
const allCouriers = [];
for (const r of [...intlCouriers, ...curatedRows]) {
  if (!courierKeySet.has(r.key)) {
    courierKeySet.add(r.key);
    allCouriers.push(r);
  }
}

console.log(`\nCategory 1 (Postal → 国际小包): ${postalRows.length}`);
console.log(`Category 2 (Intl Courier): ${intlCouriers.length}`);
console.log(`Category 3 (Curated Regional): ${curatedRows.length}`);
console.log(`Category 2+3 merged (→ 国际快递): ${allCouriers.length}`);

// ─── Helper: normalize host ───
function getHost(url) {
  try { return new URL(url.startsWith('http') ? url : 'http://' + url).hostname.replace(/^www\./, ''); }
  catch { return null; }
}

// ─── Helper: generate description ───
// Country mapping for postal services
const COUNTRY_MAP = {
  'Afghan': '阿富汗', 'Albanian': '阿尔巴尼亚', 'Algeria': '阿尔及利亚',
  'Argentin': '阿根廷', 'Armenia': '亚美尼亚', 'Australia': '澳大利亚',
  'Austrian': '奥地利', 'Azerbaij': '阿塞拜疆', 'Bangladesh': '孟加拉',
  'Barbados': '巴巴多斯', 'Belize': '伯利兹', 'Benin': '贝宁',
  'Bhutan': '不丹', 'Botswana': '博茨瓦纳', 'Brazil': '巴西',
  'Brunei': '文莱', 'Bulgaria': '保加利亚', 'Burkina': '布基纳法索',
  'Burundi': '布隆迪', 'Cambodia': '柬埔寨', 'Cameroon': '喀麦隆',
  'Canada': '加拿大', 'Cabo Verde': '佛得角', 'Chile': '智利',
  'China': '中国', 'Colombia': '哥伦比亚', 'Costa Rica': '哥斯达黎加',
  'Croatia': '克罗地亚', 'Cuba': '古巴', 'Cyprus': '塞浦路斯',
  'Czech': '捷克', 'Danmark': '丹麦', 'Dominican': '多米尼加',
  'Ecuador': '厄瓜多尔', 'Egypt': '埃及', 'Emirates': '阿联酋',
  'Estonia': '爱沙尼亚', 'Ethiopia': '埃塞俄比亚', 'Fiji': '斐济',
  'Finland': '芬兰', 'France': '法国', 'Georgia': '格鲁吉亚',
  'German': '德国', 'Ghana': '加纳', 'Greece': '希腊',
  'Guatemala': '危地马拉', 'Guyana': '圭亚那', 'Honduras': '洪都拉斯',
  'HongKong': '中国香港', 'Hungar': '匈牙利', 'Iceland': '冰岛',
  'India': '印度', 'Indonesia': '印尼', 'Iran': '伊朗',
  'Iraq': '伊拉克', 'Ireland': '爱尔兰', 'Israel': '以色列',
  'Itali': '意大利', 'Jamaica': '牙买加', 'Japan': '日本',
  'Jordan': '约旦', 'Kazak': '哈萨克斯坦', 'Kenya': '肯尼亚',
  'Kingdom': '英国', 'Kiribati': '基里巴斯', 'Korea': '韩国',
  'Kosovo': '科索沃', 'Kuwait': '科威特', 'Kyrgyz': '吉尔吉斯斯坦',
  'Lao': '老挝', 'Latvia': '拉脱维亚', 'Lebanon': '黎巴嫩',
  'Lesotho': '莱索托', 'Libya': '利比亚', 'Lithuania': '立陶宛',
  'Lucia': '圣卢西亚', 'Luxembourg': '卢森堡', 'Macau': '中国澳门',
  'Macedonia': '北马其顿', 'Madagascar': '马达加斯加', 'Malaysia': '马来西亚',
  'Maldives': '马尔代夫', 'Mali': '马里', 'Malta': '马耳他',
  'Mauritius': '毛里求斯', 'Mexico': '墨西哥', 'Moldova': '摩尔多瓦',
  'Mongolia': '蒙古', 'Montenegro': '黑山', 'Morocco': '摩洛哥',
  'Mozambique': '莫桑比克', 'Moçambique': '莫桑比克', 'Myanmar': '缅甸',
  'Namibia': '纳米比亚', 'Nepal': '尼泊尔', 'Nether': '荷兰',
  'New Zealand': '新西兰', 'Nicaragua': '尼加拉瓜', 'Nigeria': '尼日利亚',
  'Norway': '挪威', 'Oman': '阿曼', 'Pakistan': '巴基斯坦',
  'Palestine': '巴勒斯坦', 'Panama': '巴拿马', 'PNG': '巴布亚新几内亚',
  'Paraguay': '巴拉圭', 'Peru': '秘鲁', 'Philippine': '菲律宾',
  'Poland': '波兰', 'Portugal': '葡萄牙', 'Qatar': '卡塔尔',
  'Romania': '罗马尼亚', 'Russia': '俄罗斯', 'Rwanda': '卢旺达',
  'Samoa': '萨摩亚', 'San Marino': '圣马力诺', 'Saudi': '沙特',
  'Senegal': '塞内加尔', 'Serbia': '塞尔维亚', 'Seychelles': '塞舌尔',
  'Singapore': '新加坡', 'Slovakia': '斯洛伐克', 'Slovenia': '斯洛文尼亚',
  'Solomon': '所罗门群岛', 'South Africa': '南非', 'Spain': '西班牙',
  'Sri Lanka': '斯里兰卡', 'Sudan': '苏丹', 'Sweden': '瑞典',
  'Swiss': '瑞士', 'Taiwan': '中国台湾', 'Tanzania': '坦桑尼亚',
  'Thailand': '泰国', 'Togo': '多哥', 'Tonga': '汤加',
  'Trinidad': '特立尼达', 'Tunisia': '突尼斯', 'Turk': '土耳其',
  'Tuvalu': '图瓦卢', 'Uganda': '乌干达', 'Ukraine': '乌克兰',
  'Uzbek': '乌兹别克斯坦', 'Uruguay': '乌拉圭', 'USPS': '美国',
  'Vanuatu': '瓦努阿图', 'Venezuela': '委内瑞拉', 'Vietnam': '越南',
  'VietNam': '越南', 'Yemen': '也门', 'Zambia': '赞比亚',
  'Zimbabwe': '津巴布韦', 'Anguilla': '安圭拉', 'Bermuda': '百慕大',
  'Gibraltar': '直布罗陀', 'Jersey': '泽西岛', 'Aland': '奥兰群岛',
  'Aruba': '阿鲁巴', 'Faroe': '法罗群岛', 'Greenland': '格陵兰',
  'New Caledonia': '新喀里多尼亚', 'Chunghwa': '中国台湾',
  'Srpske': '波黑塞族', 'Mostar': '波黑克族', 'Bosni': '波黑',
  'El Salvador': '萨尔瓦多', 'Correo': '邮政',
};

function getPostalDesc(name_en, name_cn) {
  if (name_cn && /[\u4e00-\u9fff]/.test(name_cn) && name_cn !== name_en) {
    return name_cn;
  }
  for (const [keyword, cn] of Object.entries(COUNTRY_MAP)) {
    if (name_en.includes(keyword)) return cn + '邮政';
  }
  return name_en;
}

function getCourierDesc(name_en, name_cn) {
  if (name_cn && /[\u4e00-\u9fff]/.test(name_cn) && name_cn !== name_en) {
    return name_cn;
  }
  return name_en;
}

// ─── Add entries ───
let nextId = Math.max(...nav.sites.map(s => s.id)) + 1;
const seenHosts = new Set([...existHosts]);
let addedPostal = 0, addedCourier = 0, skippedDup = 0;

// === Category 1 → 国际小包 ===
let postalOrder = 1499.5; // after existing 国际小包 entries (which start at 1500)
for (const r of postalRows) {
  const host = getHost(r.url);
  if (!host) continue;
  if (seenHosts.has(host)) {
    skippedDup++;
    continue;
  }
  seenHosts.add(host);

  nav.sites.push({
    id: nextId++,
    title: r.name_en,
    url: r.url.startsWith('http') ? r.url : 'http://' + r.url,
    description: getPostalDesc(r.name_en, r.name_cn),
    category: '国际小包',
    order: postalOrder,
    thumbnail: ''
  });
  postalOrder -= 0.01;
  addedPostal++;
}

// === Category 2+3 → 国际快递 ===
// Find lowest order in 国际快递
const kuaidiItems = nav.sites.filter(s => s.category === '国际快递');
const minKuaidiOrder = kuaidiItems.length > 0
  ? Math.min(...kuaidiItems.map(s => s.order))
  : 1988;
let courierOrder = minKuaidiOrder - 0.01;

for (const r of allCouriers) {
  const host = getHost(r.url);
  if (!host) continue;
  if (seenHosts.has(host)) {
    skippedDup++;
    continue;
  }
  seenHosts.add(host);

  nav.sites.push({
    id: nextId++,
    title: r.name_en,
    url: r.url.startsWith('http') ? r.url : 'http://' + r.url,
    description: getCourierDesc(r.name_en, r.name_cn),
    category: '国际快递',
    order: courierOrder,
    thumbnail: ''
  });
  courierOrder -= 0.01;
  addedCourier++;
}

console.log(`\n=== Results ===`);
console.log(`Postal added to 国际小包: ${addedPostal}`);
console.log(`Couriers added to 国际快递: ${addedCourier}`);
console.log(`Skipped (duplicate hosts): ${skippedDup}`);
console.log(`Total sites: ${beforeCount} → ${nav.sites.length}`);
console.log(`New ID range: ${nextId - addedPostal - addedCourier} - ${nextId - 1}`);

fs.writeFileSync(NAV_FILE, JSON.stringify(nav, null, 2) + '\n');
console.log('Saved!');
