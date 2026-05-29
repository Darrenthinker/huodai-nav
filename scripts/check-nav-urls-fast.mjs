import fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const navPath = join(__dirname, "../src/data/navigation.json");
const MS = Number(process.env.URL_CHECK_MS || 8000);
const CAT = process.env.URL_CHECK_CATEGORY || ""; // e.g. 国际海运

const data = JSON.parse(fs.readFileSync(navPath, "utf8"));
let sites = data.sites ?? [];
if (CAT) sites = sites.filter((s) => s.category === CAT);
const urls = [...new Set(sites.map((x) => x.url).filter(Boolean))];

/** @type {{ u: string, code?: number, err?: string, title?: string }[]} */
const bad = [];

async function tryFetch(u, method) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), MS);
  try {
    const res = await fetch(u, {
      method,
      signal: ctrl.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; NavLinkCheck/1.0)" },
    });
    clearTimeout(t);
    return res.status;
  } catch (e) {
    clearTimeout(t);
    throw e;
  }
}

async function checkOne(u) {
  const site = sites.find((s) => s.url === u);
  const title = site?.title ?? "";
  try {
    let code = await tryFetch(u, "HEAD");
    if (code === 405 || code === 501) code = await tryFetch(u, "GET");
    if (code >= 400) bad.push({ u, code, title });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    bad.push({ u, err: msg, title });
  }
}

const batch = 24;
for (let i = 0; i < urls.length; i += batch) {
  await Promise.all(urls.slice(i, i + batch).map(checkOne));
  process.stderr.write(`${Math.min(i + batch, urls.length)}/${urls.length}\r`);
}
console.error("");
console.log(
  JSON.stringify(
    {
      categoryFilter: CAT || "(all)",
      timeoutMs: MS,
      total: urls.length,
      failed: bad.length,
      bad,
    },
    null,
    2
  )
);
