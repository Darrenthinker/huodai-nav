/**
 * 与 utopiax.org/index.html 对齐：删除该页未给出专属链接的航司卡片；
 * 修正主链接与 utopiax 主链不一致的条目。
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const navPath = path.join(__dirname, "../src/data/navigation.json");

/** utopiax 页面上该航司无专属超链接，或与航司无对应关系，已移除 */
const REMOVE_IDS = new Set([
  2880, 2888, 2903, 2904, 2920, 2931, 2955, 2979, 2989,
]);

/** id -> partial patch */
const PATCH = {
  2837: {
    description: "拉美货运 ABSA Cargo / LATAM Cargo Brasil",
  },
  2842: {
    description: "加勒比货运 Aerolinea Del Caribe / Aercaribe",
  },
  2847: {
    url: "https://airarabia-g9.ibsplc.aero/icargoneoportal/app/main/#/app",
  },
  2855: {
    description: "西班牙货运航空 Airclass Lineas Aereas",
  },
  2864: {
    description: "秘鲁货运 Airmax Cargo",
  },
  2871: {
    url: "https://pathfinder.digitalfactory.aero/",
  },
  2882: {
    url: "https://en.belavia.by/carriage_of_cargo/tracking/",
  },
  2909: {
    url: "https://www.cathaypacificcargo.com/en-us/manageyourshipment/trackyourshipment.aspx",
  },
  2932: {
    url: "http://cargo.juneyaoair.com/Index_en.aspx",
  },
  2959: {
    url: "https://www.stratair.net/shipment-tracking/",
    description: "北方货运/Stratair Northern Air Cargo / Stratair",
  },
  2971: {
    url: "http://www.southamericanairways.com/tracking_summary.asp",
  },
  2985: {
    url: "http://www.starlightairline.com/track_shipment.aspx",
  },
  2988: {
    url: "https://tools.swissworldcargo.com/en/track_n_trace",
  },
  3001: {
    url: "http://www.brcargo.com/ec_web/Default.aspx",
  },
};

const nav = JSON.parse(fs.readFileSync(navPath, "utf8"));
const before = nav.sites.length;
nav.sites = nav.sites.filter((s) => !REMOVE_IDS.has(s.id));
let patched = 0;
for (const s of nav.sites) {
  const p = PATCH[s.id];
  if (p) {
    Object.assign(s, p);
    patched++;
  }
}
fs.writeFileSync(navPath, JSON.stringify(nav, null, 2) + "\n", "utf8");
console.log(`Removed ${before - nav.sites.length} sites (no dedicated link on utopiax). Patched ${patched} records. Total sites: ${nav.sites.length}.`);
