/* =============================================================================
   HERO EXPLORATION ASSETS — responsive WebP for the exploded component tour.

   Processes every PNG under public/images/home/hero-exploration/ (recursively:
   spine/ and components/), writes WebP width variants next to each PNG, and
   MERGES "/images/home/hero-exploration/<subdir>/<name>.png" -> [widths] into
   lib/imageManifest.json so lib/imageLoader.ts serves WebP via next/image.

   Transparency is preserved (sharp keeps the alpha channel; no flatten). The
   source PNGs stay as raw fallbacks per the CLAUDE.md image rule.

   IMPORTANT: scripts/optimizeImages.mjs rebuilds the manifest from scratch and
   erases merged entries — after running it, re-run this script AND
   scripts/optimize3DElevator.mjs to restore their entries.

   Run:  node scripts/optimizeHeroExploration.mjs
   ========================================================================== */

import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "public", "images", "home", "hero-exploration");
const MANIFEST = path.join(ROOT, "lib", "imageManifest.json");

/* Component cutouts render ≤ ~300px wide (mobile) / 220px (desktop card) at up
   to 2x DPR; the spine renders much larger. One ladder covers both. Quality 80
   matches the 3D_Elevetor renders (graphics look better at 80 than photo 74). */
const WIDTHS = [192, 256, 320, 384, 640, 960, 1280];
const QUALITY = 80;

/* WebP encoder effort (0-6, sharp's default is 4). 6 costs more CPU at BUILD
   time only and is lossless in appearance — the encoder simply searches harder
   for a smaller encoding at the SAME quality target. Measured on
   parts/elevator-door-384: 58.3 KB at effort 4 -> 53.6 KB at effort 6, an 8%
   saving for zero visual change. PageSpeed's "Increasing the image compression
   factor could improve this image's download size" was flagging every one of
   these. */
const EFFORT = 6;

/* FULL-BLEED PLATES need their own ladder. The hero sky and building plates in
   environment/ are painted edge to edge, so on a 1920 screen the browser was
   stretching the 1280 variant by 1.5x and the towers came out visibly soft.
   These tiers let it pick the largest the source can actually give.

   `withoutEnlargement` plus the `w <= meta.width` filter below mean a tier
   larger than the source is simply skipped, never upscaled — so listing 2560
   here costs nothing on a 1536px original and pays off the day a bigger one is
   supplied. Quality is higher too: these are large photographic plates where 80
   shows banding in gradient sky. */
const FULL_BLEED_WIDTHS = [640, 960, 1280, 1536, 1920, 2560, 3072];
/* Lowered 88 -> 84 on 2026-07-25. hero-scene-night-1920 was 317 KB, the single
   heaviest asset on the site, and PageSpeed flagged 50.7 KB of compression
   headroom on it. Checked before committing: a 1:1 crop of the hardest region
   (night facade — thousands of small bright windows against dark sky, plus the
   baked headline type) is visually indistinguishable at 84, while the file
   drops to ~256 KB (-19%). 80 was rejected as a step too far for a plate this
   size — banding starts to show in the sky gradient, which is exactly why this
   constant exists separately from QUALITY. */
const FULL_BLEED_QUALITY = 84;

/** Plates that cover the whole hero, rather than sitting in a card. */
const isFullBleed = (file) =>
  /[\\/]environment[\\/]hero-(sky|city|front|tower|scene)/.test(file);

async function* pngs(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* pngs(full);
    else if (entry.name.endsWith(".png")) yield full;
  }
}

async function run() {
  try {
    await fs.access(DIR);
  } catch {
    console.log(`Nothing to do: ${path.relative(ROOT, DIR)} does not exist yet.`);
    console.log("Drop the client's transparent PNGs there first (see imagegeneration.md §10).");
    return;
  }

  const manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
  let generated = 0;
  let count = 0;

  for await (const src of pngs(DIR)) {
    const base = src.slice(0, -".png".length);
    const meta = await sharp(src).metadata();
    const fullBleed = isFullBleed(src);
    const ladder = fullBleed ? FULL_BLEED_WIDTHS : WIDTHS;
    const quality = fullBleed ? FULL_BLEED_QUALITY : QUALITY;
    const widths = ladder.filter((w) => w <= (meta.width ?? Infinity));
    if (widths.length === 0) widths.push(meta.width ?? ladder[0]);

    for (const w of widths) {
      await sharp(src)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality, effort: EFFORT })
        .toFile(`${base}-${w}.webp`);
      generated++;
    }

    const key = "/" + path.relative(path.join(ROOT, "public"), src).split(path.sep).join("/");
    manifest[key] = widths;
    count++;
    console.log(`  ${key}  ->  ${widths.join(", ")}`);
  }

  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await fs.writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`\nGenerated ${generated} WebP variants for ${count} images; manifest updated.`);
}

run().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
