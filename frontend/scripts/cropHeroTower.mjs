/* =============================================================================
   CROP THE HERO TOWER PLATES  (variant18)

   `hero-tower-{day,night}.png` are 1024x1536 plates whose building occupies a
   thin 213x1083 column of opaque pixels — the rest is transparent padding used
   to position it inside a full-bleed layer. Variant 18 needs the building as a
   foreground cutout whose width and height it can drive independently, so the
   padding is cropped away here and the result written as
   `hero-tower-cut-{day,night}.png`.

   ONE crop box is used for both plates (the union of their alpha bounds, plus a
   small bleed) so the day and night cutouts stay pixel-aligned and the CSS
   cross-fade between them never shifts.

   Derived asset: nothing is generated or repainted, this only trims transparent
   padding. Re-run after either source plate is replaced:

     node scripts/cropHeroTower.mjs
     node scripts/optimizeImages.mjs
   ========================================================================== */
import { readdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const DIR = "public/images/home/hero-exploration/environment";
const SOURCES = ["hero-tower-day.png", "hero-tower-night.png"];

/** Alpha above this counts as building rather than a soft edge. */
const ALPHA_FLOOR = 24;
/** Keep a few pixels of the soft edge so the cutout does not look sliced. */
const BLEED = 6;

async function bounds(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  let minX = W, maxX = 0, minY = H, maxY = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * C + 3] > ALPHA_FLOOR) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { minX, maxX, minY, maxY, W, H };
}

const all = [];
for (const name of SOURCES) {
  const b = await bounds(path.join(DIR, name));
  console.log(`${name}: x ${b.minX}–${b.maxX}  y ${b.minY}–${b.maxY}`);
  all.push(b);
}

/* Union box, clamped to the plate, so both cutouts share one frame. */
const W = all[0].W;
const H = all[0].H;
const left = Math.max(0, Math.min(...all.map((b) => b.minX)) - BLEED);
const top = Math.max(0, Math.min(...all.map((b) => b.minY)) - BLEED);
const right = Math.min(W - 1, Math.max(...all.map((b) => b.maxX)) + BLEED);
const bottom = Math.min(H - 1, Math.max(...all.map((b) => b.maxY)) + BLEED);
const box = { left, top, width: right - left + 1, height: bottom - top + 1 };

console.log("shared crop box:", box, "aspect", (box.width / box.height).toFixed(4));

for (const name of SOURCES) {
  const out = name.replace("hero-tower-", "hero-tower-cut-");
  await sharp(path.join(DIR, name))
    .extract(box)
    .png()
    .toFile(path.join(DIR, out));
  console.log("wrote", out);
}

console.log(
  "\nRun `node scripts/optimizeImages.mjs` to generate the WebP variants.\n" +
    "Files now in the folder:",
  readdirSync(DIR).filter((f) => f.includes("tower-cut")).join(", ")
);
