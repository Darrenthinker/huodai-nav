const sites = [
  { id: 2819, label: "货代知识库", url: "https://get.huodaiagent.com/" },
  { id: 2509, label: "51Tracking", url: "https://www.51tracking.com/aircargo/cn/" },
];

for (const s of sites) {
  try {
    const res = await fetch(s.url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
    });
    const html = await res.text();
    const icons = [];
    const re = /<link[^>]+>/gi;
    let m;
    while ((m = re.exec(html)) !== null) {
      const tag = m[0];
      if (!/icon/i.test(tag)) continue;
      const href = tag.match(/href=["']([^"']+)["']/i);
      const rel = tag.match(/rel=["']([^"']+)["']/i);
      if (href) {
        try {
          const abs = new URL(href[1], res.url).href;
          icons.push({ rel: rel?.[1] || "", href: abs });
        } catch {}
      }
    }
    console.log(`\n${s.label} (id=${s.id}):`);
    if (icons.length) icons.forEach((i) => console.log(`  ${i.rel} => ${i.href}`));
    else console.log("  (no icon links found)");
  } catch (e) {
    console.log(`${s.label}: ERROR ${e.message}`);
  }
}
