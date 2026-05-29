import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "out");
const SITE_URL = "https://www.huodaiagent.com";
const TODAY = new Date().toISOString().slice(0, 10);

// 单页导航站，所有分类通过锚点 #cat-XX 跳转，#fragment 在 SEO 中会被忽略，
// 因此 sitemap 只声明真实可索引的页面，避免 Search Console 把 13 个锚点
// 误报为"已发现页面"造成数据失真。
// 如果未来拆分成 /category/<slug> 等独立路由，再恢复批量生成。
const urls = [
  { loc: `${SITE_URL}/`, changefreq: "daily", priority: "1.0" },
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
