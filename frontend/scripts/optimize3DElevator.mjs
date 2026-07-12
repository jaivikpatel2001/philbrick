/* =============================================================================
   3D ELEVATOR PART IMAGES — responsive WebP for the hotspot modals.

   The 8 renders in public/images/3D_Elevetor are 2400x1792 PNGs (~1.5 MB each).
   Serving those raw into a modal would be slow, especially on mobile. This
   mirrors the main image pipeline (scripts/optimizeImages.mjs): it writes WebP
   width variants next to each PNG and merges "/images/3D_Elevetor/<name>.png"
   -> [widths] into lib/imageManifest.json, so lib/imageLoader.ts rewrites
   next/image requests to the right WebP. The source PNG stays (used as the raw
   fallback + any social/SEO reference). Re-runnable and idempotent.

   Run:  node scripts/optimize3DElevator.mjs
   ========================================================================== */

import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "public", "images", "3D_Elevetor");
const MANIFEST = path.join(ROOT, "lib", "imageManifest.json");

// Modal display tops out ~980px wide; these cover 1x/2x on phone→desktop.
const WIDTHS = [384, 640, 960];
const QUALITY = 80;

async function run() {
  const files = (await fs.readdir(DIR)).filter((f) => f.endsWith(".png"));
  const manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
  let generated = 0;

  for (const file of files) {
    const base = file.slice(0, -".png".length);
    const src = path.join(DIR, file);
    const meta = await sharp(src).metadata();
    const widths = WIDTHS.filter((w) => w <= (meta.width ?? Infinity));
    if (widths.length === 0) widths.push(meta.width ?? WIDTHS[0]);

    for (const w of widths) {
      const out = path.join(DIR, `${base}-${w}.webp`);
      await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: QUALITY }).toFile(out);
      generated++;
    }
    manifest[`/images/3D_Elevetor/${file}`] = widths;
    console.log(`  ${file}  ->  ${widths.join(", ")}`);
  }

  // Keep the manifest sorted for stable diffs.
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await fs.writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`\nGenerated ${generated} WebP variants for ${files.length} images; manifest updated.`);
}

run().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
