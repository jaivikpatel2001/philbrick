/* =============================================================================
   NETWORK MAP QA RENDER
   Parses data/network.ts (one city per line) + data/indiaMap.ts, replicates the
   NetworkMap component's projection, point-in-polygon nudge and label layout,
   ASSERTS every marker sits safely inside the landmass, and renders a PNG
   preview (dark + light) for visual collision review.

   Usage: node scripts/checkNetworkMap.mjs [out.png]
   ========================================================================== */
import sharp from "sharp";
import { readFileSync } from "node:fs";

const OUT =
  process.argv[2] ??
  "C:/Users/patel/AppData/Local/Temp/claude/D--Personal-Projects-Elevetor/4bfde713-5734-4c6b-a6d2-d50cc64e2025/scratchpad/network-map-check.png";

/* ---- load generated outline + projection ------------------------------- */
const mapSrc = readFileSync("data/indiaMap.ts", "utf8");
const PATH = mapSrc.match(/INDIA_PATH =\s*"([^"]+)"/)[1];
const XS = +mapSrc.match(/const XS = ([\d.]+)/)[1];
const SCALE = +mapSrc.match(/const SCALE = ([\d.]+)/)[1];
const MINLON = +mapSrc.match(/lon - ([\d.]+)/)[1];
const MAXLAT = +mapSrc.match(/\(([\d.]+) - lat\)/)[1];
const VIEW = { width: +mapSrc.match(/width: (\d+)/)[1], height: +mapSrc.match(/height: (\d+)/)[1] };
const proj = (lon, lat) => ({ x: (lon - MINLON) * XS * SCALE, y: (MAXLAT - lat) * SCALE });

/* ---- parse cities (one per line in data/network.ts) --------------------- */
const netSrc = readFileSync("data/network.ts", "utf8");
const cities = [...netSrc.matchAll(
  /\{ name: "([^"]+)", state: "([^"]+)", lon: ([\d.]+), lat: ([\d.]+),( hq: true,)? labelDx: (-?[\d.]+), labelDy: (-?[\d.]+), labelAnchor: "(\w+)" \}/g
)].map((m) => ({
  name: m[1], state: m[2], lon: +m[3], lat: +m[4], hq: !!m[5],
  labelDx: +m[6], labelDy: +m[7], labelAnchor: m[8],
}));
if (cities.length !== 31) {
  console.error(`✗ parsed ${cities.length} cities, expected 31 — check the one-line format`);
  process.exit(1);
}

/* ---- PIP + nudge (mirror of NetworkMap.tsx) ----------------------------- */
const POLY = (PATH.match(/[ML]([\d.]+) ([\d.]+)/g) ?? []).map((s) => s.slice(1).split(" ").map(Number));
const inside = (x, y) => {
  let ins = false;
  for (let i = 0, j = POLY.length - 1; i < POLY.length; j = i++) {
    const [xi, yi] = POLY[i], [xj, yj] = POLY[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) ins = !ins;
  }
  return ins;
};
const safe = (x, y, m = 6) =>
  inside(x, y) && inside(x - m, y) && inside(x + m, y) && inside(x, y - m) && inside(x, y + m);
/* radial search: smallest displacement in any direction (mirror of component) */
const nudge = (x, y) => {
  if (safe(x, y)) return { x, y, moved: 0 };
  for (let r = 2.5; r <= 60; r += 2.5) {
    for (let a = 0; a < 12; a++) {
      const t = (a / 12) * Math.PI * 2;
      const px = x + Math.cos(t) * r, py = y + Math.sin(t) * r;
      if (safe(px, py)) return { x: px, y: py, moved: r };
    }
  }
  return { x, y, moved: -1 };
};

/* ---- assert every marker is safely inside ------------------------------- */
let fail = 0;
const pos = cities.map((c) => {
  const raw = proj(c.lon, c.lat);
  const p = nudge(raw.x, raw.y);
  const ok = safe(p.x, p.y);
  if (!ok || p.moved === -1) { console.error(`✗ ${c.name} still outside after nudge`); fail++; }
  if (p.moved > 0) console.log(`  nudged ${c.name} inland by ${p.moved.toFixed(1)} units`);
  return { ...c, ...p };
});
console.log(fail ? `✗ ${fail} markers outside` : `✓ all ${pos.length} markers safely inside the landmass`);
if (fail) process.exit(1);

/* ---- render preview (dark + light, side by side) ------------------------ */
const PAD = { l: 24, r: 24, t: 22, b: 32 };
const VW = VIEW.width + PAD.l + PAD.r, VH = VIEW.height + PAD.t + PAD.b;
const hq = pos.find((c) => c.hq);
const arcTargets = ["New Delhi", "Mumbai", "Kolkata", "Chennai", "Bangalore", "Hyderabad", "Guwahati", "Srinagar"];
const arcs = arcTargets.map((n) => {
  const p = pos.find((x) => x.name === n);
  const mx = (hq.x + p.x) / 2, my = (hq.y + p.y) / 2;
  const dx = p.x - hq.x, dy = p.y - hq.y, len = Math.hypot(dx, dy) || 1;
  const lift = Math.min(46, len * 0.22);
  return `M${hq.x.toFixed(1)} ${hq.y.toFixed(1)} Q${(mx - (dy / len) * lift).toFixed(1)} ${(my + (dx / len) * lift).toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
});

const theme = (dark) => {
  const bg = dark ? "#0A0E14" : "#F4F6F8";
  const text = dark ? "#aebacb" : "#3c4657";
  const halo = bg;
  const accent = dark ? "#2FADEC" : "#0A6A9C";
  const nodes = pos.map((c) => {
    const r = c.hq ? 6 : 4;
    const fill = c.hq ? "#E11F26" : accent;
    return `<circle cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="${r}" fill="${fill}"/>`;
  }).join("");
  const labels = pos.map((c) =>
    `<text x="${(c.x + c.labelDx).toFixed(1)}" y="${(c.y + c.labelDy).toFixed(1)}" text-anchor="${c.labelAnchor}" font-family="Consolas, monospace" font-size="11.5" letter-spacing="0.4" fill="${text}" stroke="${halo}" stroke-width="3" paint-order="stroke" ${c.hq ? 'font-weight="700"' : ""}>${c.name}</text>`
  ).join("");
  const arcEls = arcs.map((d) => `<path d="${d}" fill="none" stroke="${accent}" stroke-width="1" opacity="0.3"/>`).join("");
  return `<g><rect x="${-PAD.l}" y="${-PAD.t}" width="${VW}" height="${VH}" fill="${bg}"/>
    <path d="${PATH}" fill="${accent}12" stroke="${accent}" stroke-width="1.7"/>${arcEls}${nodes}${labels}</g>`;
};

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-PAD.l} ${-PAD.t} ${VW * 2 + 20} ${VH}" width="${(VW * 2 + 20) * 1.15}" height="${VH * 1.15}">
  ${theme(true)}
  <g transform="translate(${VW + 20} 0)">${theme(false)}</g>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile(OUT);
console.log("preview written:", OUT);
