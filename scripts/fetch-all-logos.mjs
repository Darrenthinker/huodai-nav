/**
 * 一次性抓取全部站点图标，保存到 public/logos/{id}.png
 * 之后前端直接用本地文件，不再依赖任何外部服务。
 *
 * 用法：
 *   node scripts/fetch-all-logos.mjs          全量抓取（跳过已有的）
 *   node scripts/fetch-all-logos.mjs --force   强制重新抓取全部
 *   node scripts/fetch-all-logos.mjs --id 45   只抓一个站点
 *   node scripts/fetch-all-logos.mjs --min-id 2837  只处理 id >= 2837（如新增航司）
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const navPath = path.join(root, "src/data/navigation.json");
const logosDir = path.join(root, "public/logos");

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

if (!fs.existsSync(logosDir)) fs.mkdirSync(logosDir, { recursive: true });

function parseArgs() {
  const a = process.argv.slice(2);
  return {
    force: a.includes("--force"),
    id: a.includes("--id") ? parseInt(a[a.indexOf("--id") + 1], 10) : null,
    minId: a.includes("--min-id") ? parseInt(a[a.indexOf("--min-id") + 1], 10) : null,
    maxId: a.includes("--max-id") ? parseInt(a[a.indexOf("--max-id") + 1], 10) : null,
  };
}

/** 卡片标题形如 "QF 081"、"D5 992"、"EI 053 / 125" 时取二字码，用于航司图标 CDN */
function iataFromTitle(title) {
  const m = String(title || "")
    .trim()
    .match(/^([A-Z0-9]{2})\s+\d/);
  return m ? m[1] : null;
}

function airlineLogoCandidateUrls(code) {
  if (!code || code.length !== 2) return [];
  const c = code.toUpperCase();
  return [
    `https://images.kiwi.com/airlines/128x128/${c}.png`,
    `https://pics.avs.io/128/128/${c}.png`,
  ];
}

function getDomain(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function domainVariants(hostname) {
  const out = [hostname];
  if (hostname.startsWith("www.")) out.push(hostname.slice(4));
  const parts = hostname.split(".");
  if (parts.length > 2) out.push(parts.slice(-2).join("."));
  return [...new Set(out)];
}

function buildCandidateUrls(site) {
  const domain = getDomain(site.url);
  if (!domain) return [];
  const urls = [];

  for (const d of domainVariants(domain)) {
    urls.push(
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(d)}&sz=128`,
      `https://${d}/apple-touch-icon.png`,
      `https://${d}/apple-touch-icon-precomposed.png`,
      `https://${d}/favicon.ico`,
      `https://${d}/favicon-32x32.png`,
      `https://${d}/android-chrome-192x192.png`,
      `https://icon.horse/icon/${encodeURIComponent(d)}`,
      `https://unavatar.io/${encodeURIComponent(d)}?fallback=false`
    );
  }

  const thumb = (site.thumbnail || "").trim();
  if (thumb) {
    let t = thumb;
    if (t.startsWith("http:") && t.includes("huodaiagent.com")) {
      t = "https:" + t.slice(5);
    }
    urls.unshift(t);
  }

  return [...new Set(urls)];
}

const SKIP_PATTERNS = [
  /^data:/,
  /\.svg$/i,
];

/** 16x16 的 Google 默认地球图恰好 726 字节；小图标也无意义 */
const MIN_USEFUL_BYTES = 800;

async function fetchImage(url, timeoutMs = 8000) {
  for (const pat of SKIP_PATTERNS) {
    if (pat.test(url)) return null;
  }
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) return null;
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  if (ct.includes("text/html") || ct.includes("application/json")) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < MIN_USEFUL_BYTES) return null;

  const head = buf.slice(0, 4);
  const isPNG = head[0] === 0x89 && head[1] === 0x50;
  const isJPG = head[0] === 0xff && head[1] === 0xd8;
  const isICO = head[0] === 0x00 && head[1] === 0x00 && (head[2] === 0x01 || head[2] === 0x02);
  const isWEBP = buf.length > 12 && buf.slice(8, 12).toString() === "WEBP";
  const isGIF = head.slice(0, 3).toString() === "GIF";
  if (!isPNG && !isJPG && !isICO && !isWEBP && !isGIF) return null;

  return buf;
}

/** 尝试从目标站 HTML 里提取 <link rel="icon"> 和 og:image */
async function fetchPageIcons(siteUrl) {
  try {
    const res = await fetch(siteUrl, {
      redirect: "follow",
      headers: { Accept: "text/html", "User-Agent": UA },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return [];
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("text/html")) return [];
    const html = await res.text();
    const base = new URL(res.url);

    const found = [];
    const linkRe = /<link\b[^>]*>/gi;
    let m;
    while ((m = linkRe.exec(html)) !== null) {
      const tag = m[0];
      const relM = tag.match(/\brel\s*=\s*["']([^"']+)["']/i);
      const hrefM = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i);
      if (!relM || !hrefM) continue;
      const rel = relM[1].toLowerCase();
      const href = hrefM[1].trim();
      if (!href || href.startsWith("data:")) continue;
      if (rel.includes("apple-touch-icon")) {
        try { found.unshift(new URL(href, base).href); } catch {}
      } else if (rel.includes("icon") && !rel.includes("mask")) {
        try { found.push(new URL(href, base).href); } catch {}
      }
    }

    const ogRe = /(?:property|name)=["'](?:og:image|twitter:image)["'][^>]*content=["']([^"']+)["']|content=["']([^"']+)["'][^>]*(?:property|name)=["'](?:og:image|twitter:image)["']/gi;
    while ((m = ogRe.exec(html)) !== null) {
      const u = (m[1] || m[2] || "").trim();
      if (u) {
        try { found.push(new URL(u, base).href); } catch {}
      }
    }
    return found;
  } catch {
    return [];
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function processSite(site) {
  const candidates = buildCandidateUrls(site);
  const thumb = (site.thumbnail || "").trim();
  let normalizedThumb = null;
  if (thumb) {
    let t = thumb;
    if (t.startsWith("http:") && t.includes("huodaiagent.com")) {
      t = "https:" + t.slice(5);
    }
    normalizedThumb = t;
  }

  /** 缩略图 → 航司二字码 CDN（国际空运卡片，避免 Pathfinder 等聚合站 favicon）→ 域名 favicon 链 */
  const ordered = [];
  const seen = new Set();
  const push = (u) => {
    if (!u || seen.has(u)) return;
    seen.add(u);
    ordered.push(u);
  };

  if (normalizedThumb) push(normalizedThumb);
  if (site.category === "国际空运") {
    for (const u of airlineLogoCandidateUrls(iataFromTitle(site.title))) push(u);
  }
  for (const u of candidates) push(u);

  for (const url of ordered) {
    try {
      const buf = await fetchImage(url);
      if (buf) return buf;
    } catch {}
  }

  const pageIcons = await fetchPageIcons(site.url);
  for (const url of pageIcons) {
    try {
      const buf = await fetchImage(url);
      if (buf) return buf;
    } catch {}
  }

  return null;
}

async function main() {
  const { force, id, minId, maxId } = parseArgs();
  const raw = JSON.parse(fs.readFileSync(navPath, "utf-8"));
  let sites = raw.sites || [];
  if (id != null && !Number.isNaN(id)) {
    sites = sites.filter((s) => s.id === id);
  } else {
    if (minId != null && !Number.isNaN(minId)) {
      sites = sites.filter((s) => s.id >= minId);
    }
    if (maxId != null && !Number.isNaN(maxId)) {
      sites = sites.filter((s) => s.id <= maxId);
    }
  }

  let skip = 0;
  let ok = 0;
  let fail = 0;
  const total = sites.length;
  const failed = [];

  console.log(`\n=== 批量抓取站点图标 ===`);
  console.log(`总计: ${total} 个站点\n`);

  for (let i = 0; i < total; i++) {
    const site = sites[i];
    const outFile = path.join(logosDir, `${site.id}.png`);

    if (!force && fs.existsSync(outFile)) {
      skip++;
      continue;
    }

    const title = (site.title || "").slice(0, 28).padEnd(28);
    const progress = `[${String(i + 1).padStart(3)}/${total}]`;
    process.stdout.write(`${progress} ${title} `);

    const buf = await processSite(site);
    if (buf) {
      fs.writeFileSync(outFile, buf);
      const kb = (buf.length / 1024).toFixed(1);
      console.log(`✓ ${kb}KB`);
      ok++;
    } else {
      console.log(`✗ 未找到`);
      fail++;
      failed.push({ id: site.id, title: site.title, url: site.url });
    }

    await sleep(150);
  }

  console.log(`\n=== 完成 ===`);
  console.log(`成功: ${ok}  跳过(已有): ${skip}  失败: ${fail}`);
  if (failed.length > 0) {
    const failPath = path.join(root, "scripts/logo-failed.json");
    fs.writeFileSync(failPath, JSON.stringify(failed, null, 2), "utf-8");
    console.log(`失败列表已保存到: ${failPath}`);
  }
  console.log(`图标目录: ${logosDir}\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
