import fs from 'fs';

const NAV_FILE = 'src/data/navigation.json';
const CATEGORY = '国际小包';
const REMOVE_ID = 2816; // 占位符

const CARRIERS = [
  ["PostNL", "https://www.postnl.nl/", "荷兰邮政"],
  ["Bosnia And Herzegovina Post", "https://www.posta.ba/", "波黑邮政"],
  ["Bpost", "https://www.bpost.be/", "比利时邮政"],
  ["Post Haste", "https://www.posthaste.co.nz/default.html", "新西兰快递 Post Haste"],
  ["PostaPlus", "https://www.postaplus.com/", "中东快递 PostaPlus"],
  ["Turkish Post (PTT)", "https://www.ptt.gov.tr/", "土耳其邮政"],
  ["Latvia Post", "https://www.pasts.lv/", "拉脱维亚邮政"],
  ["Belarus Post", "https://belpost.by/", "白俄罗斯邮政"],
  ["PostNL International", "https://postnl.post/", "荷兰邮政国际"],
  ["Swiss Post", "https://www.post.ch/", "瑞士邮政"],
  ["Posten Norge", "https://www.posten.no/", "挪威邮政"],
  ["PostNord", "https://www.postnord.se/en", "北欧邮政 瑞典/丹麦"],
  ["Estonia Post (Omniva)", "https://www.omniva.ee/", "爱沙尼亚邮政"],
  ["Malta Post", "https://www.maltapost.com/", "马耳他邮政"],
  ["Chronopost", "https://www.chronopost.fr/", "法国快递 Chronopost"],
  ["Montenegro Post", "https://www.postacg.me/", "黑山邮政"],
  ["APC Postal Logistics", "https://www.apc-pli.com/", "美国邮政物流 APC"],
  ["Espost", "https://www.espost.es/track", "西班牙快递 Espost"],
  ["Poste Italiane", "https://www.poste.it/", "意大利邮政"],
  ["Sailpost", "https://www.sailpost.it/traccia-il-pacco/", "意大利快递 Sailpost"],
  ["Gibraltar Post", "https://www.post.gi/", "直布罗陀邮政"],
  ["Cacesa Postal", "https://www.cacesapostal.com/", "西班牙邮政 Cacesa"],
  ["Iceland Post", "https://www.postur.is/", "冰岛邮政"],
  ["Denmark Post", "https://www.postdanmark.dk/", "丹麦邮政"],
  ["ELTA Hellenic Post", "https://www.elta.gr/en/", "希腊邮政"],
  ["Macedonia Post", "https://www.posta.mk/", "北马其顿邮政"],
  ["Monaco Post", "https://www.lapostemonaco.mc/", "摩纳哥邮政"],
  ["Deutsche Post", "https://www.deutschepost.de/", "德国邮政"],
  ["Magyar Posta", "https://posta.hu/", "匈牙利邮政"],
  ["Romania Post", "https://www.posta-romana.ro/", "罗马尼亚邮政"],
  ["Moldova Post", "https://www.posta.md/", "摩尔多瓦邮政"],
  ["Lithuania Post", "https://www.post.lt/", "立陶宛邮政"],
  ["Liechtenstein Post", "https://www.post.li/", "列支敦士登邮政"],
  ["Chronopost Portugal (DPD)", "https://chronopost.pt/", "葡萄牙快递 DPD"],
  ["Austrian Post", "https://www.post.at/", "奥地利邮政"],
  ["Georgia Post", "https://www.gpost.ge/", "格鲁吉亚邮政"],
  ["Jersey Post", "https://www.jerseypost.com/track/", "泽西岛邮政"],
  ["Posta Bez Hranic", "https://www.postabezhranic.cz/", "捷克跨境邮政"],
  ["San Marino Post", "https://www.poste.sm/on-line/home.html", "圣马力诺邮政"],
  ["Serbia Post", "https://www.posta.rs/", "塞尔维亚邮政"],
  ["A1 Post", "https://a1post.bg/track.php", "保加利亚快递 A1"],
  ["Russian Post", "https://pochta.ru/", "俄罗斯邮政"],
  ["Aland Post", "https://www.posten.ax/", "奥兰群岛邮政"],
  ["Post One", "https://postone.eu/", "保加利亚快递 Post One"],
  ["Czech Post", "https://www.ceskaposta.cz/", "捷克邮政"],
  ["La Poste", "https://www.laposte.fr/", "法国邮政"],
  ["InPost", "https://inpost.pl/", "波兰智能快递柜 InPost"],
  ["Andorra Post", "https://www.correos.ad/", "安道尔邮政"],
  ["Poland Post", "https://www.poczta-polska.pl/", "波兰邮政"],
  ["Faroe Islands Post", "https://www.posta.fo/", "法罗群岛邮政"],
  ["Netherlands Post (TNT)", "https://www.tnt.com/", "荷兰TNT快递"],
  ["Finland Post (Posti)", "https://www.posti.fi/", "芬兰邮政"],
  ["Guernsey Post", "https://www.guernseypost.com/", "根西岛邮政"],
  ["Cyprus Post", "https://www.cypruspost.post/", "塞浦路斯邮政"],
  ["Hispapost", "https://www.hispapost.es/", "西班牙快递 Hispapost"],
  ["Slovakia Post", "https://www.posta.sk/", "斯洛伐克邮政"],
  ["Bulgaria Post", "https://www.bgpost.bg/", "保加利亚邮政"],
  ["Slovenia Post", "https://www.posta.si/", "斯洛文尼亚邮政"],
  ["Luxembourg Post", "https://www.post.lu/", "卢森堡邮政"],
  ["An Post", "https://www.anpost.ie/", "爱尔兰邮政"],
  ["Albania Post", "https://www.postashqiptare.al/", "阿尔巴尼亚邮政"],
  ["Ukraine Post", "https://www.ukrposhta.ua/", "乌克兰邮政"],
  ["Postal State International", "https://www.youban.de/", "德国友邦速递 中欧跨境"],
];

const nav = JSON.parse(fs.readFileSync(NAV_FILE, 'utf8'));

const before = nav.sites.length;
nav.sites = nav.sites.filter(s => s.id !== REMOVE_ID);
console.log(`Removed placeholder (id ${REMOVE_ID}). ${before} -> ${nav.sites.length}`);

const existHosts = new Set();
nav.sites.forEach(s => {
  try { existHosts.add(new URL(s.url).hostname.replace(/^www\./, '')); } catch {}
});

const seenHosts = new Set();
let nextId = Math.max(...nav.sites.map(s => s.id)) + 1;
let order = 1500;
let added = 0;
let skipped = 0;

for (const [title, url, desc] of CARRIERS) {
  let host;
  try { host = new URL(url).hostname.replace(/^www\./, ''); } catch { continue; }

  if (existHosts.has(host)) {
    console.log(`SKIP (exists in other category): ${title} -> ${host}`);
    skipped++;
    continue;
  }
  if (seenHosts.has(host)) {
    console.log(`SKIP (dup in batch): ${title} -> ${host}`);
    skipped++;
    continue;
  }

  seenHosts.add(host);
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

console.log(`Added: ${added}, Skipped: ${skipped}, Total sites: ${nav.sites.length}`);
fs.writeFileSync(NAV_FILE, JSON.stringify(nav, null, 2) + '\n');
console.log('Saved!');
