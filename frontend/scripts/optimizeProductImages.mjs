/* =============================================================================
   PRODUCT CATALOGUE IMAGE OPTIMISER

   The client's original product photography is JPG, not PNG, so it cannot go
   through scripts/optimizeImages.mjs (PNG-only). This generates the responsive
   WebP ladder for public/images/products/catalog/*.jpg and MERGES the entries
   into lib/imageManifest.json — it never rewrites the whole manifest, so it is
   safe to run alongside the other two optimisers.

   ORDER MATTERS when running more than one:
     1. node scripts/optimizeImages.mjs          (rewrites the manifest)
     2. node scripts/optimizeHeroExploration.mjs (merges)
     3. node scripts/optimizeProductImages.mjs   (merges)

   The catalogue photos are square-ish studio shots shown at card size and in
   the detail gallery / lightbox, so the ladder tops out at 1280.
   ========================================================================== */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "public", "images", "products", "catalog");
const MANIFEST = path.join(ROOT, "lib", "imageManifest.json");

const WIDTHS = [320, 640, 960, 1280];
const QUALITY = 78;

const exists = (p) => fs.access(p).then(() => true).catch(() => false);

async function main() {
  if (!(await exists(DIR))) {
    console.log(`Nothing to do: ${path.relative(ROOT, DIR)} does not exist yet.`);
    return;
  }

  const manifest = (await exists(MANIFEST))
    ? JSON.parse(await fs.readFile(MANIFEST, "utf8"))
    : {};

  const files = (await fs.readdir(DIR)).filter((f) => /\.jpe?g$/i.test(f));
  let variants = 0;
  let bytes = 0;

  for (const file of files.sort()) {
    const src = path.join(DIR, file);
    const base = file.replace(/\.jpe?g$/i, "");
    const meta = await sharp(src).metadata();

    /* never upscale: keep only ladder steps the original can actually serve */
    let widths = WIDTHS.filter((w) => w <= (meta.width ?? Infinity));
    if (widths.length === 0) widths = [meta.width ?? WIDTHS[0]];

    for (const w of widths) {
      const out = path.join(DIR, `${base}-${w}.webp`);
      await sharp(src).resize({ width: w }).webp({ quality: QUALITY }).toFile(out);
      bytes += (await fs.stat(out)).size;
      variants++;
    }

    manifest[`/images/products/catalog/${file}`] = widths;
  }

  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await fs.writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");

  console.log(`catalogue photos: ${files.length}`);
  console.log(`webp variants:    ${variants}  (${Math.round(bytes / 1024)} KB total)`);
  console.log(`manifest entries: ${Object.keys(sorted).length} -> lib/imageManifest.json`);
}

main();
