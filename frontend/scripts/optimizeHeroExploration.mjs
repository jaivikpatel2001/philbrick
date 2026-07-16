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
const WIDTHS = [384, 640, 960, 1280];
const QUALITY = 80;

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
    const widths = WIDTHS.filter((w) => w <= (meta.width ?? Infinity));
    if (widths.length === 0) widths.push(meta.width ?? WIDTHS[0]);

    for (const w of widths) {
      await sharp(src)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: QUALITY })
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
