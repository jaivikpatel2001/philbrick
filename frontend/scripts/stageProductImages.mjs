/* =============================================================================
   STAGE THE CLIENT'S ORIGINAL PRODUCT PHOTOGRAPHY

   The 86 product photos exported from the client's WordPress live in
     public/images/home/hero-exploration/components/original/
   under mixed-case names (`XTFT-043-TFT-Display1.jpg`). Windows is
   case-insensitive but the production host is NOT, so every name is normalised
   to lower kebab-case on the way into the catalogue folder:

     public/images/products/catalog/<normalised>.jpg

   Only files actually referenced by a product are copied — the source folder
   also holds superseded shots. Writes catalog-map.json (original -> web path)
   so the data generator and this script cannot drift apart.

   Run:  node scripts/stageProductImages.mjs
   Then: node scripts/optimizeProductImages.mjs   (generates the WebP ladder)
   ========================================================================== */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "public/images/home/hero-exploration/components/original");
const OUT = path.join(ROOT, "public/images/products/catalog");
const PRODUCTS = path.join(ROOT, "data/generated/wpProducts.json");
const MAP = path.join(ROOT, "data/generated/catalog-map.json");

/** `XTFT-043-TFT-Display1.jpg` -> `xtft-043-tft-display1.jpg` */
export const normalise = (file) => {
  const ext = path.extname(file).toLowerCase();
  return (
    path
      .basename(file, path.extname(file))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") + ext
  );
};

const main = async () => {
  const products = JSON.parse(await fs.readFile(PRODUCTS, "utf8"));
  await fs.mkdir(OUT, { recursive: true });

  const wanted = new Set();
  for (const p of products)
    for (const u of [p.thumb, ...p.gallery].filter(Boolean))
      wanted.add(path.basename(u));

  const map = {};
  const missing = [];
  let copied = 0;

  for (const base of [...wanted].sort()) {
    const from = path.join(SRC, base);
    try {
      await fs.access(from);
    } catch {
      missing.push(base);
      continue;
    }
    const to = normalise(base);
    await fs.copyFile(from, path.join(OUT, to));
    map[base] = `/images/products/catalog/${to}`;
    copied++;
  }

  await fs.writeFile(MAP, JSON.stringify(map, null, 2));
  console.log(`referenced photos: ${wanted.size}`);
  console.log(`copied:            ${copied} -> public/images/products/catalog/`);
  console.log(`map:               ${path.relative(ROOT, MAP)}`);
  if (missing.length) {
    console.log(`\nMISSING ${missing.length} source file(s):`);
    for (const m of missing) console.log("   - " + m);
    process.exitCode = 1;
  }
};

main();
