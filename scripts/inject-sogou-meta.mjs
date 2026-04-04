/**
 * 将搜狗验证 meta 紧接插入 <head> 后（在 Next 注入的 script 之前），避免爬虫只扫 head 前段时漏检。
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "out");
const TAG = '<meta name="sogou_site_verification" content="lqd7fsNXYf"/>';

function patch(file) {
  const p = path.join(OUT, file);
  if (!fs.existsSync(p)) return;
  let html = fs.readFileSync(p, "utf8");
  html = html.replace(/<meta name="sogou_site_verification"[^>]*\/?>/gi, "");
  const needle = "<head>";
  const i = html.indexOf(needle);
  if (i === -1) return;
  const insertAt = i + needle.length;
  if (html.slice(insertAt, insertAt + TAG.length) === TAG) return;
  html = html.slice(0, insertAt) + TAG + html.slice(insertAt);
  fs.writeFileSync(p, html);
}

patch("index.html");
