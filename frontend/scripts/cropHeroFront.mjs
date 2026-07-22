/* =============================================================================
   CROP THE HERO FOREGROUND SKYLINE PLATES  (variant18)

   `hero-front-{day,night}.png` are 1536x1024 transparent plates. Their towers
   start ~62px down and stop ~45px short of the bottom edge, and that padding is
   what makes them impossible to place: laid flush the towers bury 6 to 8
   characters of the headline, and any fixed offset that looks right at 1440
   is wrong at 1920, because the plate scales with viewport WIDTH while the
   headline's type clamps.

   Trimming the transparent margins removes the problem instead of tuning around
   it: the top edge of the cut plate IS the skyline's highest peak, so the CSS
   can anchor that edge directly to the headline's last line and the occlusion
   holds at every viewport.

   ONE crop box is used for both plates (the union of their alpha bounds) so day
   and night stay pixel-aligned and the theme cross-fade never shifts. Full width
   is kept — the plate is full-bleed, so trimming the sides would pull the
   buildings away from the screen edges.

   Derived assets: nothing is generated or repainted. Re-run after either source
   plate is replaced:

     node scripts/cropHeroFront.mjs
     node scripts/optimizeHeroExploration.mjs
   ========================================================================== */
import path from "node:path";
import sharp from "sharp";

const DIR = "public/images/home/hero-exploration/environment";
const SOURCES = ["hero-front-day.png", "hero-front-night.png"];

/** Alpha above this counts as building rather than a soft edge. */
const ALPHA_FLOOR = 24;

async function verticalBounds(file) {
  const { data, info } = await sharp(file)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  let minY = H, maxY = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * C + 3] > ALPHA_FLOOR) {
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        break; // one opaque pixel in the row is enough
      }
    }
  }
  return { minY, maxY, W, H };
}

const all = [];
for (const name of SOURCES) {
  const b = await verticalBounds(path.join(DIR, name));
  console.log(`${name}: opaque rows ${b.minY}–${b.maxY} of ${b.H}`);
  all.push(b);
}

const W = all[0].W;
const H = all[0].H;
const top = Math.min(...all.map((b) => b.minY));
const bottom = Math.max(...all.map((b) => b.maxY));
const box = { left: 0, top, width: W, height: Math.min(H, bottom + 1) - top };

console.log(
  "shared crop box:",
  box,
  "aspect",
  (box.width / box.height).toFixed(4)
);

for (const name of SOURCES) {
  const out = name.replace("hero-front-", "hero-front-cut-");
  await sharp(path.join(DIR, name)).extract(box).png().toFile(path.join(DIR, out));
  console.log("wrote", out);
}

console.log(
  `\nPut these in Variant18Hero.tsx as FRONT_CUT: { width: ${box.width}, height: ${box.height} }`
);
console.log("Then run: node scripts/optimizeHeroExploration.mjs");
