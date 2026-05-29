/**
 * 针对无法自动抓取的商业网站，用更多路径和更真实的浏览器头来获取 favicon
 * 用法：node scripts/fetch-commercial-logos.mjs
 */
import fs from "fs";
import https from "https";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logosDir = path.join(__dirname, "../public/logos");

// 需要处理的商业站点
const targets = [
  { id: 2022,  url: "https://www.airfreightabc.com/" },
  { id: 2107,  url: "https://www.qingdao-port.net/" },
  { id: 2288,  url: "https://cx.nbct.com.cn/" },
  { id: 2335,  url: "https://www.irislgroup.com/" },
  { id: 2589,  url: "https://www.anaf.ro" },
  { id: 2788,  url: "https://cursor.com" },
  { id: 3032,  url: "http://www.hdasco.com/" },
  { id: 3045,  url: "https://www.macandrews.com/" },
  { id: 3077,  url: "https://www.rifline.it/" },
  { id: 3083,  url: "https://www.aclship.com/" },
  { id: 3089,  url: "https://www.portusline.com/" },
  { id: 3163,  url: "https://www.bpost.be/" },
  { id: 3295,  url: "https://www.i-parcel.com/" },
  { id: 3326,  url: "https://www.fastway.ie/" },
  { id: 3356,  url: "https://th.kerryexpress.com/" },
  { id: 3361,  url: "https://www.jet-logistics.com/" },
  { id: 3367,  url: "https://hk.kerryexpress.com/" },
  { id: 3388,  url: "https://www.kerrylogistics.com/" },
  { id: 3396,  url: "https://www.estafeta.com/" },
  { id: 3409,  url: "https://www.dpd.uz/" },
  { id: 3428,  url: "https://www.wing.ae/" },
  { id: 3441,  url: "https://www.saee.sa/" },
  { id: 3492,  url: "https://www.servientrega.com/" },
  { id: 3516,  url: "https://www.yusen-logistics.com/" },
  { id: 3526,  url: "https://www.amtrucking.com/" },
];

// 真实浏览器 User-Agent
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function getDomain(urlStr) {
  try {
    const u = new URL(urlStr);
    return u.hostname.replace(/^www\./, "");
  } catch { return null; }
}

function fetchBuffer(urlStr, timeoutMs = 8000) {
  return new Promise((resolve) => {
    try {
      const u = new URL(urlStr);
      const mod = u.protocol === "https:" ? https : http;
      const req = mod.get(urlStr, {
        headers: {
          "User-Agent": UA,
          "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Referer": u.origin + "/",
        },
        timeout: timeoutMs,
      }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
          const loc = res.headers.location;
          if (loc) {
            res.destroy();
            fetchBuffer(new URL(loc, urlStr).href, timeoutMs).then(resolve);
            return;
          }
        }
        if (res.statusCode !== 200) { res.destroy(); resolve(null); return; }
        const ct = (res.headers["content-type"] || "").toLowerCase();
        if (ct.includes("text/html") || ct.includes("json")) { res.destroy(); resolve(null); return; }
        const chunks = [];
        res.on("data", c => chunks.push(c));
        res.on("end", () => {
          const buf = Buffer.concat(chunks);
          resolve(buf.length > 200 ? buf : null);
        });
        res.on("error", () => resolve(null));
      });
      req.on("error", () => resolve(null));
      req.on("timeout", () => { req.destroy(); resolve(null); });
    } catch { resolve(null); }
  });
}

function buildCandidates(urlStr) {
  const domain = getDomain(urlStr);
  if (!domain) return [];
  try {
    const base = new URL(urlStr).origin;
    return [
      `https://logo.clearbit.com/${domain}`,
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${base}&size=128`,
      `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      `${base}/apple-touch-icon.png`,
      `${base}/apple-touch-icon-precomposed.png`,
      `${base}/favicon-32x32.png`,
      `${base}/favicon-16x16.png`,
      `${base}/favicon.png`,
      `${base}/favicon.ico`,
      `${base}/static/favicon.ico`,
      `${base}/assets/favicon.ico`,
      `${base}/images/favicon.ico`,
      `${base}/img/favicon.ico`,
    ];
  } catch { return []; }
}

async function processOne(target, index, total) {
  const label = `[${String(index+1).padStart(2)}/${total}] ID ${target.id}`.padEnd(25);
  const outPath = path.join(logosDir, `${target.id}.png`);
  if (fs.existsSync(outPath)) {
    console.log(`${label} ⏭  已有`);
    return;
  }
  const candidates = buildCandidates(target.url);
  for (const u of candidates) {
    const buf = await fetchBuffer(u);
    if (buf) {
      fs.writeFileSync(outPath, buf);
      const src = u.length > 60 ? "..." + u.slice(-50) : u;
      console.log(`${label} ✓  ${src}`);
      return;
    }
  }
  console.log(`${label} ✗  未找到`);
}

async function main() {
  console.log(`=== 商业网站 Logo 补抓 ===\n`);
  const missing = targets.filter(t => !fs.existsSync(path.join(logosDir, `${t.id}.png`)));
  console.log(`需处理: ${missing.length} 个\n`);
  for (let i = 0; i < missing.length; i++) {
    await processOne(missing[i], i, missing.length);
  }
  console.log(`\n=== 完成 ===`);
}

main();
