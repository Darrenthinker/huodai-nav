import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const DATA_FILE = path.join(ROOT, "src", "data", "navigation.json");
const OUT_DIR = path.join(ROOT, "out");
const SITE_URL = "https://www.huodaiagent.com";
const TODAY = new Date().toISOString().slice(0, 10);

const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
const categories = data.categories;

const urls = [
  { loc: `${SITE_URL}/`, changefreq: "daily", priority: "1.0" },
  ...categories.map((cat) => ({
    loc: `${SITE_URL}/#cat-${cat.id}`,
    changefreq: "weekly",
    priority: "0.8",
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const txt = urls.map((u) => u.loc).join("\n") + "\n";

fs.writeFileSync(path.join(OUT_DIR, "sitemap.xml"), xml);
fs.writeFileSync(path.join(OUT_DIR, "sitemap.txt"), txt);

fs.writeFileSync(path.join(ROOT, "public", "sitemap.xml"), xml);
fs.writeFileSync(path.join(ROOT, "public", "sitemap.txt"), txt);

console.log(`Sitemap generated: ${urls.length} URLs (${TODAY})`);
