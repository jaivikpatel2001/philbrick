/* =============================================================================
   PHILBRICK — IMAGE PIPELINE (static-export safe)

   Why this exists: the site is `output: "export"` (no server-side image
   optimizer), and the generated brand photography ships as 6-10 MB PNGs. Serving
   those raw would destroy performance. This script:

     1. Archives every full-resolution original into  image-sources/<page>/…png
        (organised, git-ignored — the untouched source of record).
     2. Writes a web-sized PNG fallback into           public/images/<page>/…png
        (the documented source + <img> fallback for the ~3% without WebP).
     3. Generates responsive WebP width variants into  public/images/<page>/…-<w>.webp
        so next/image keeps real srcset behaviour with zero server.
     4. Emits                                           lib/imageManifest.json
        mapping each "/images/<page>/<name>.png" -> the widths that exist, which
        lib/imageLoader.ts reads to rewrite requests to the right WebP.

   Re-runnable: after the first pass the flat originals are gone, so the source
   becomes the image-sources/ archive. Run:  node scripts/optimizeImages.mjs
   ========================================================================== */

import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FLAT = path.join(ROOT, "public", "images"); // where the 58 flat PNGs landed
const OUT = path.join(ROOT, "public", "images");
const ARCHIVE = path.join(ROOT, "image-sources");
const MANIFEST = path.join(ROOT, "lib", "imageManifest.json");

/* Responsive width ladders + fallback-PNG cap + WebP quality, per role.
   `withoutEnlargement` means variants never exceed the source width. */
const ROLE = {
  wide: { widths: [640, 1080, 1600, 2048], pngMax: 1440, q: 74 }, // page heroes, CTA band
  product: { widths: [384, 640, 1080, 1600, 2048], pngMax: 1440, q: 74 }, // card + full-bleed hero
  section: { widths: [384, 640, 960, 1280], pngMax: 1280, q: 78 }, // 4:5 editorial media
  application: { widths: [320, 560, 900, 1200], pngMax: 1200, q: 78 }, // 3:4 carousel cards
  news: { widths: [384, 768, 1200, 1600], pngMax: 1440, q: 76 }, // 16:10 card + 16:9 hero
};

/* [ flat base name (no ext) , page-wise output path (no ext) , role ] */
const MAP = [
  // ---- Page heroes (16:9) ----
  ["hero-products", "products/products-hero", "wide"],
  ["hero-about", "about/about-hero", "wide"],
  ["hero-vision-mission", "vision-mission/vision-mission-hero", "wide"],
  ["hero-milestone", "milestone/milestone-hero", "wide"],
  ["hero-infrastructure", "infrastructure/infrastructure-hero", "wide"],
  ["hero-network", "network/network-hero", "wide"],
  ["hero-news-events", "news-events/news-events-hero", "wide"],
  ["hero-contact", "contact/contact-hero", "wide"],
  // ---- Section media (4:5) ----
  ["section-who-we-are", "home/who-we-are", "section"],
  ["section-about-story", "about/about-story", "section"],
  ["section-infrastructure-intro", "infrastructure/infrastructure-intro", "section"],
  // ---- Applications (3:4) ----
  ["application-residential", "home/application-residential", "application"],
  ["application-commercial", "home/application-commercial", "application"],
  ["application-healthcare", "home/application-healthcare", "application"],
  ["application-hospitality", "home/application-hospitality", "application"], // MISSING (expected absent)
  ["application-industrial", "home/application-industrial", "application"],
  ["application-institutional", "home/application-institutional", "application"],
  ["application-transit", "home/application-transit", "application"],
  // ---- Product categories (4:3) ----
  ["category-elevator-control-panel", "products/elevator-control-panel/elevator-control-panel", "product"],
  ["category-integrated-control-panel", "products/integrated-control-panel/integrated-control-panel", "product"],
  ["category-elevator-iot", "products/elevator-iot/elevator-iot", "product"],
  ["category-ard", "products/ard/ard", "product"],
  ["category-lift-master", "products/lift-master/lift-master", "product"],
  ["category-synergy-auto-door", "products/synergy-auto-door/synergy-auto-door", "product"], // MISSING (expected absent)
  ["category-elevator-doors", "products/elevator-doors/elevator-doors", "product"],
  ["category-elevator-cabin", "products/elevator-cabin/elevator-cabin", "product"],
  ["category-elevator-display", "products/elevator-display/elevator-display", "product"],
  ["category-cop-lop", "products/cop-lop/cop-lop", "product"],
  ["category-touch-cop-lop", "products/touch-cop-lop/touch-cop-lop", "product"],
  ["category-voice-announcing-systems", "products/voice-announcing-systems/voice-announcing-systems", "product"],
  ["category-elevator-kit-accessories", "products/elevator-kit-accessories/elevator-kit-accessories", "product"],
  ["category-step-products", "products/step-products/step-products", "product"],
  // ---- Individual products (4:3) ----
  ["product-automatic-door-controller", "products/elevator-control-panel/automatic-door-controller", "product"],
  ["product-manual-door-controller", "products/elevator-control-panel/manual-door-controller", "product"],
  ["product-hydraulic-controller", "products/elevator-control-panel/hydraulic-controller", "product"],
  ["product-parallel-type-controller", "products/integrated-control-panel/parallel-type-controller", "product"],
  ["product-serial-can-bus-type-controller", "products/integrated-control-panel/serial-can-bus-type-controller", "product"],
  ["product-mrl-control-panel", "products/integrated-control-panel/mrl-control-panel", "product"],
  ["product-2-panel-centre-opening", "products/synergy-auto-door/2-panel-centre-opening", "product"],
  ["product-2-panel-telescopic-side-opening", "products/synergy-auto-door/2-panel-telescopic-side-opening", "product"],
  ["product-4-panel-centre-opening", "products/synergy-auto-door/4-panel-centre-opening", "product"],
  ["product-xn-1000-led-segment-display", "products/elevator-display/xn-1000-led-segment-display", "product"],
  ["product-xn-2000-dot-matrix-display", "products/elevator-display/xn-2000-dot-matrix-display", "product"],
  ["product-xn-2100-dot-matrix-display", "products/elevator-display/xn-2100-dot-matrix-display", "product"],
  ["product-xn-3000-dot-matrix-display", "products/elevator-display/xn-3000-dot-matrix-display", "product"],
  ["product-xn-4000-date-time-temperature-display", "products/elevator-display/xn-4000-date-time-temperature-display", "product"],
  ["product-xlcd-01-monochrome-lcd-display", "products/elevator-display/xlcd-01-monochrome-lcd-display", "product"],
  ["product-xlcd-02-monochrome-lcd-display", "products/elevator-display/xlcd-02-monochrome-lcd-display", "product"],
  ["product-xtft-043-tft-display", "products/elevator-display/xtft-043-tft-display", "product"],
  ["product-fa-50-chip-based", "products/voice-announcing-systems/fa-50-chip-based", "product"],
  ["product-fa-250-mp3", "products/voice-announcing-systems/fa-250-mp3", "product"],
  ["product-close-door-announcer", "products/voice-announcing-systems/close-door-announcer", "product"],
  ["product-elevator-gong", "products/voice-announcing-systems/elevator-gong", "product"],
  // ---- News & Events (16:9, mock) ----
  ["news-serial-can-bus", "news-events/news-serial-can-bus", "news"],
  ["news-expo", "news-events/news-expo", "news"],
  ["news-training", "news-events/news-training", "news"],
  ["news-facility-upgrade", "news-events/news-facility-upgrade", "news"],
  ["news-ard-safety", "news-events/news-ard-safety", "news"],
  ["news-network", "news-events/news-network", "news"],
  // ---- CTA band (21:9, shared) ----
  ["cta-band", "shared/cta-band", "wide"],
];

const exists = async (p) => !!(await fs.stat(p).catch(() => null));
const kb = (b) => (b / 1024).toFixed(0);

async function resolveSource(flatBase, outRel) {
  const flat = path.join(FLAT, `${flatBase}.png`);
  const archived = path.join(ARCHIVE, `${outRel}.png`);
  if (await exists(flat)) {
    // First pass: move the flat original into the organised archive.
    await fs.mkdir(path.dirname(archived), { recursive: true });
    await fs.rename(flat, archived);
    return archived;
  }
  if (await exists(archived)) return archived; // re-run: use the archive
  const placed = path.join(OUT, `${outRel}.png`);
  if (await exists(placed)) return placed; // last resort: the already-placed png
  return null;
}

async function run() {
  const manifest = {};
  const missing = [];
  let done = 0,
    pngBytes = 0,
    webpBytes = 0,
    srcBytes = 0;

  for (const [flatBase, outRel, role] of MAP) {
    const src = await resolveSource(flatBase, outRel);
    const key = `/images/${outRel}.png`;
    if (!src) {
      missing.push({ flatBase, outRel, role });
      continue;
    }
    const cfg = ROLE[role];
    const outPngPath = path.join(OUT, `${outRel}.png`);
    await fs.mkdir(path.dirname(outPngPath), { recursive: true });

    const input = sharp(src, { limitInputPixels: false });
    const meta = await input.metadata();
    const srcW = meta.width ?? cfg.pngMax;
    srcBytes += (await fs.stat(src)).size;

    // Source of record + non-WebP fallback: keep the delivered originals verbatim
    // (they are already web-sized ~100-475 KB). Re-encoding photos to a palette
    // PNG would only add banding; WebP variants below carry the real delivery.
    if (path.resolve(src) !== path.resolve(outPngPath)) {
      await fs.copyFile(src, outPngPath);
    }
    pngBytes += (await fs.stat(outPngPath)).size;

    // Responsive WebP variants (the real delivery), capped at the source width.
    const effWidths = [];
    for (const w of cfg.widths) {
      const target = Math.min(w, srcW);
      if (effWidths.includes(target)) continue;
      effWidths.push(target);
      const wpath = path.join(OUT, `${outRel}-${target}.webp`);
      await sharp(src, { limitInputPixels: false })
        .resize({ width: target, withoutEnlargement: true })
        .webp({ quality: cfg.q, effort: 5 })
        .toFile(wpath);
      webpBytes += (await fs.stat(wpath)).size;
      if (w >= srcW) break; // no larger duplicates
    }
    manifest[key] = effWidths;
    done++;
    process.stdout.write(`  ✓ ${outRel}  [${effWidths.join(",")}]\n`);
  }

  // Stable, sorted manifest for clean diffs.
  const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
  await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
  await fs.writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");

  console.log("\n──────── image pipeline summary ────────");
  console.log(`processed:        ${done}/${MAP.length}`);
  console.log(`source (archive): ${kb(srcBytes)} KB total`);
  console.log(`png fallbacks:    ${kb(pngBytes)} KB total`);
  console.log(`webp variants:    ${kb(webpBytes)} KB total`);
  console.log(`manifest entries: ${Object.keys(sorted).length} -> ${MANIFEST.replace(ROOT + path.sep, "")}`);
  if (missing.length) {
    console.log(`\n⚠ MISSING ${missing.length} source image(s) (expected — user to supply):`);
    for (const m of missing) console.log(`   - ${m.flatBase}.png  ->  public/images/${m.outRel}.png`);
  } else {
    console.log("\nNo missing sources.");
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
