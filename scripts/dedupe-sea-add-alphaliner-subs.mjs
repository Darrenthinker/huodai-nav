/**
 * 1) 删除国际海运中与站内其他条目规范化 URL 完全重复的条目（本次处理明确列表）。
 * 2) 按 Alphaliner Top100 脚注常见「独立上榜/集团品牌」补充链接，跳过已存在规范化 URL。
 *
 * 运行: node scripts/dedupe-sea-add-alphaliner-subs.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const navPath = path.join(__dirname, "../src/data/navigation.json");

function normUrl(u) {
  try {
    let x = String(u || "").trim();
    if (!/^https?:\/\//i.test(x)) x = "https://" + x;
    const p = new URL(x);
    const host = p.hostname.replace(/^www\./i, "").toLowerCase();
    const pathn = (p.pathname.replace(/\/$/, "") || "").toLowerCase();
    return `${host}${pathn}`;
  } catch {
    return String(u || "").trim().toLowerCase();
  }
}

/** 与站内其他卡片同 URL 的重复项：删这些 id（保留先收录的条目） */
const REMOVE_IDS = new Set([2584, 3036, 3042, 3049, 3052, 3064]);

/** [title, url, description] — Alphaliner 脚注/集团中常见、且本站尚无该 URL */
const NEW_ROWS = [
  ["Log-In Logistica", "https://logai.loginlogistica.com.br/", "MSC旗下 巴西综合物流 Log-Aí"],
  ["Finnlines", "https://www.finnlines.com/", "Grimaldi旗下 北欧客滚/货运"],
  ["Samskip", "https://www.samskip.com/en/track-and-trace/", "多式联运 北欧"],
  ["Rifline", "https://www.rifline.it/en/", "意大利航运 Rifline"],
  ["Mariana Express Lines (MELL)", "https://www.mellship.com/", "PIL旗下 区域支线"],
  ["Westwood Shipping Lines", "https://www.westwoodshipping.com/", "Swire旗下 美加航线"],
  ["BG Freight Line", "https://www.bgfreightline.com/", "Peel Ports旗下 欧洲近洋"],
  ["Shreyas Shipping", "https://www.shreyasshipping.com/", "Unifeeder旗下 印度沿海"],
  ["Transworld Feeders", "https://www.transworldfeeders.com.sg/", "Unifeeder旗下 新加坡支线"],
  ["Advance Container Line", "https://www.aclship.com/", "PIL旗下 东南亚支线"],
  ["Coheung Shipping", "https://www.coheung.net/", "COSCO集团 京汉海运 中韩"],
  ["Shanghai Pan Asia Shipping", "https://www.panasiashipping.com/", "COSCO集团 上海泛亚航运"],
  ["New Golden Sea Shipping", "https://www.cosconsea.com.sg/", "COSCO集团 新金洋 新加坡"],
  ["Pacifica Shipping", "https://www.pacificashipping.co.nz/", "Swire旗下 南太平洋"],
  ["Nor Lines", "https://www.nor-lines.com/", "Samskip旗下 挪威近海"],
  ["Portusline (PCI)", "https://www.portusline.com/", "GS Lines旗下 地中海支线"],
];

const nav = JSON.parse(fs.readFileSync(navPath, "utf8"));
const before = nav.sites.length;

nav.sites = nav.sites.filter((s) => !REMOVE_IDS.has(s.id));
const removed = before - nav.sites.length;

const sea = nav.sites.filter((s) => s.category === "国际海运");
const used = new Set(sea.map((s) => normUrl(s.url)));

let maxId = Math.max(...nav.sites.map((s) => s.id));
let minOrder = Math.min(...sea.map((s) => s.order));
let order = minOrder - 1e-6;

let added = 0;
const skipped = [];

for (const [title, url, description] of NEW_ROWS) {
  const k = normUrl(url);
  if (used.has(k)) {
    skipped.push({ title, url, reason: "url-exists" });
    continue;
  }
  maxId += 1;
  order -= 1e-6;
  used.add(k);
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
console.log(`Removed ${removed} duplicate sea entries (ids ${[...REMOVE_IDS].join(",")}).`);
console.log(`Added ${added} Alphaliner-related operators. Skipped ${skipped.length}.`);
if (skipped.length) console.log(skipped);
console.log(`Sites: ${before} -> ${nav.sites.length}, maxId: ${maxId}`);
