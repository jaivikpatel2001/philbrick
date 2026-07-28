/* =============================================================================
   HERO SCENE OPTIMISER — the homepage hero plates (Variant18Hero).

   The hero is art-directed: a LANDSCAPE plate on wide screens and a PORTRAIT
   plate on narrow ones, one pair per theme (day/night), each with the headline
   baked into the photograph. This script turns the four source PNGs into WebP
   ladders that a plain <picture> element references directly (the hero does NOT
   go through next/image — orientation art-direction needs <source media>, which
   a single next/image src can't express).

   Sources (public/images/home/hero-exploration/environment/):
     hero-scene-day-landscape.png    ~1672x941
     hero-scene-day-portrait.png     ~864x1821
     hero-scene-night-landscape.png  ~1672x941
     hero-scene-night-portrait.png   ~852x1846

   Output: hero-scene-<theme>-<orientation>-<width>.webp

   Run after replacing any of the four plates:  node scripts/optimizeHeroScene.mjs
   ========================================================================== */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "public", "images", "home", "hero-exploration", "environment");

const QUALITY = 84; // matches the hero full-bleed quality (see optimizeHeroExploration)
const EFFORT = 6;

/* One entry per plate. Ladders never enlarge past the source width. */
const PLATES = [
  { file: "hero-scene-day-landscape.png", widths: [640, 960, 1280, 1536, 1672] },
  { file: "hero-scene-night-landscape.png", widths: [640, 960, 1280, 1536, 1672] },
  { file: "hero-scene-day-portrait.png", widths: [384, 640, 820] },
  { file: "hero-scene-night-portrait.png", widths: [384, 640, 820] },
];

async function main() {
  let variants = 0;
  let bytes = 0;

  for (const { file, widths } of PLATES) {
    const src = path.join(DIR, file);
    const meta = await sharp(src).metadata();
    const usable = widths.filter((w) => w <= (meta.width ?? Infinity));
    if (usable.length === 0) usable.push(meta.width ?? widths[0]);

    const base = file.replace(/\.png$/i, "");
    for (const w of usable) {
      const out = path.join(DIR, `${base}-${w}.webp`);
      await sharp(src)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: EFFORT })
        .toFile(out);
      bytes += (await fs.stat(out)).size;
      variants++;
    }
    console.log(`  ${file}  (${meta.width}x${meta.height})  ->  ${usable.join(", ")}`);
  }

  console.log(`\nGenerated ${variants} WebP variants (${Math.round(bytes / 1024)} KB total).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
