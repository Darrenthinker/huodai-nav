/**
 * 专门补抓缺失 logo 的脚本（比 fetch-all-logos.mjs 更可靠）
 * 用法：node scripts/fix-missing-logos.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const navPath = path.join(root, "src/data/navigation.json");
const logosDir = path.join(root, "public/logos");

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36";
const TIMEOUT_MS = 6000;

if (!fs.existsSync(logosDir)) fs.mkdirSync(logosDir, { recursive: true });

function getDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return null; }
}

/** 多个 favicon 服务，按可靠性排序 */
function candidateUrls(domain) {
  return [
    `https://logo.clearbit.com/${domain}`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    `https://icon.horse/icon/${domain}`,
    `https://${domain}/apple-touch-icon.png`,
    `https://${domain}/favicon-32x32.png`,
    `https://${domain}/favicon.ico`,
  ];
}

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      redirect: "follow",
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (ct.includes("text/html") || ct.includes("application/json")) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 200) return null; // 太小的跳过
    return buf;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

async function fetchLogo(site) {
  const domain = getDomain(site.url);
  if (!domain) return false;

  for (const url of candidateUrls(domain)) {
    const buf = await fetchWithTimeout(url);
    if (buf) {
      const outPath = path.join(logosDir, `${site.id}.png`);
      fs.writeFileSync(outPath, buf);
      return url; // 返回成功的 URL
    }
  }
  return false;
}

async function main() {
  const data = JSON.parse(fs.readFileSync(navPath, "utf8"));
  const missing = data.sites.filter(s => !fs.existsSync(path.join(logosDir, `${s.id}.png`)));

  console.log(`=== 补抓缺失 logo ===`);
  console.log(`缺失数量: ${missing.length} 个\n`);

  let success = 0, fail = 0;
  const failed = [];

  for (let i = 0; i < missing.length; i++) {
    const site = missing[i];
    const prefix = `[${String(i + 1).padStart(3)}/${missing.length}]`;
    const label = site.title.padEnd(30);
    process.stdout.write(`${prefix} ${label}`);

    const result = await fetchLogo(site);
    if (result) {
      console.log(`✓ 成功`);
      success++;
    } else {
      console.log(`✗ 未找到`);
      fail++;
      failed.push({ id: site.id, title: site.title, url: site.url });
    }
  }

  console.log(`\n=== 完成 ===`);
  console.log(`成功: ${success}  失败: ${fail}`);

  if (failed.length > 0) {
    const failPath = path.join(__dirname, "logo-still-missing.json");
    fs.writeFileSync(failPath, JSON.stringify(failed, null, 2));
    console.log(`仍缺失列表: ${failPath}`);
  }
}

main().catch(console.error);
