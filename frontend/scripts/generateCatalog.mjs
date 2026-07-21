/* =============================================================================
   GENERATE THE PRODUCT CATALOGUE FROM THE CLIENT'S WORDPRESS EXPORT

   Input   data/generated/wpProducts.json   (38 published WooCommerce products,
                                             parsed out of the UpdraftPlus dump)
           data/generated/catalog-map.json  (original filename -> web path)
   Output  data/generated/catalog.json      (typed by data/catalog.ts)

   Two content shapes exist in the client's data and both are preserved:

     post_excerpt  "<h5>Salient Features:</h5><ul><li>…</li></ul>", sometimes
                   repeated for sub-brands (Touch COP/LOP carries C-TOUCH and
                   E-SENSE blocks). Parsed into {heading, items[]} groups so the
                   site can style them properly.

     post_content  Specification tables with rowspan/colspan and nested <ul>
                   option lists, interleaved with <h3> headings. These are
                   SANITISED rather than re-parsed: a bespoke parser would risk
                   dropping merged cells, and the goal is that nothing the
                   client published is lost. Presentational attributes (the old
                   green brand colour, cellpadding, width…) are stripped so the
                   site's own tokens style it; structure is kept verbatim.

   NOTHING IS INVENTED. 20 of the 38 products have no text on the client's site
   and stay image-only here.

   Run: node scripts/generateCatalog.mjs
   ========================================================================== */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const IN = path.join(ROOT, "data/generated/wpProducts.json");
const MAP = path.join(ROOT, "data/generated/catalog-map.json");
const OUT = path.join(ROOT, "data/generated/catalog.json");

/* -----------------------------------------------------------------------------
   Category -> product order, transcribed from the client's live "top" nav menu
   (wp_posts nav_menu_item). This is the hierarchy the reference screenshots
   show; it is NOT the WooCommerce product_cat taxonomy, which holds sub-brand
   names (Xpert, Hydra, Xenon Lift Display…) and does not match the menu.

   Four categories are nav leaves that link straight to a product; two more
   (elevator-cabin, elevator-kit-accessories) are nav leaves whose landing page
   collects several real variants that exist as separate products.
   -------------------------------------------------------------------------- */
const CATEGORY_PRODUCTS = {
  "elevator-control-panel": ["automatic-door-controller", "manual-door-controller", "hydraulic-controller"],
  "integrated-control-panel": ["parallel-type-controller", "serial-can-bus-type-controller", "mrl-control-panel"],
  "elevator-iot": ["elevator-iot"],
  ard: ["automatic-rescue-device"],
  "lift-master": ["lift-master-door-operator-controller"],
  "synergy-auto-door": ["2-panel-centre-opening", "2-panel-telescopic-side-opening", "4-panel-centre-opening"],
  "elevator-doors": ["elevator-doors"],
  "elevator-cabin": [
    "elevator-cabin",
    "elevator-cabin-stainless-steel-with-mirror-finish-car",
    "elevator-cabin-stainless-steel-with-m-s-coated-car",
    "elevator-cabin-full-glass-capsule-car-square",
  ],
  "elevator-display": [
    "xn-1000-led-segment-display",
    "xn-2000-dot-matrix-display",
    "xn-2100-dot-matrix-display",
    "xn-3000-dot-matrix-display",
    "xn-4000-date-time-temperature-display",
    "xlcd-01-monochrome-lcd-display",
    "xlcd-02-monochrome-lcd-display",
    "xtft-043-tft-display",
    "xtft-056-tft-display",
    "xtft-070-tft-display",
    "xtab-smart-display-with-audio",
  ],
  "cop-lop": ["cop-lop"],
  "touch-cop-lop": ["touch-cop-lop"],
  "voice-announcing-systems": [
    "fa-50-chip-based-voice-ann-system",
    "fa-250-mp3-voice-ann-system",
    "close-door-announcer",
    "elevator-gong",
  ],
  "elevator-kit-accessories": ["blower-fan", "round-fan", "led-lights"],
  "step-products": ["step-products"],
};

/* ---------- tiny HTML helpers (build-time, trusted client content) ---------- */

const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', "#039": "'", apos: "'",
  nbsp: " ", ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘",
  ldquo: "“", rdquo: "”", deg: "°", times: "×", hellip: "…",
};
const decode = (s) =>
  s.replace(/&(#?[a-z0-9]+);/gi, (m, e) => {
    if (ENTITIES[e]) return ENTITIES[e];
    if (/^#\d+$/.test(e)) return String.fromCharCode(Number(e.slice(1)));
    return m;
  });

const text = (html) => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

/** post_excerpt -> [{ heading, items[] }] */
function parseFeatureGroups(excerpt) {
  if (!excerpt.trim()) return [];
  const groups = [];
  /* split on each <h5>; anything before the first heading keeps a blank one */
  const parts = excerpt.split(/<h5[^>]*>/i);
  for (let i = 0; i < parts.length; i++) {
    const chunk = parts[i];
    let heading = "";
    let body = chunk;
    if (i > 0) {
      const end = chunk.search(/<\/h5>/i);
      heading = text(chunk.slice(0, end));
      body = chunk.slice(end + 5);
    }
    const items = [...body.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((m) => text(m[1]))
      .filter(Boolean);
    const prose = text(body.replace(/<ul[\s\S]*?<\/ul>/gi, ""));
    if (items.length || (heading && prose)) {
      groups.push({ heading: heading.replace(/:\s*$/, ""), items, note: prose || undefined });
    }
  }
  return groups;
}

/* Presentational attributes the old theme baked in — dropped so the site's own
   tokens style the tables. rowspan/colspan are structural and MUST survive. */
const STRIP_ATTRS = /\s(style|class|id|bgcolor|border|cellspacing|cellpadding|width|height|align|valign|on\w+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const ALLOWED = new Set(["table","thead","tbody","tfoot","tr","th","td","ul","ol","li","p","h3","h4","h5","strong","em","br","sub","sup","span"]);

function sanitise(html) {
  if (!html.trim()) return "";
  let out = html
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1>/gi, "")
    .replace(STRIP_ATTRS, "");
  /* drop any tag not on the allow-list, keeping its inner text */
  out = out.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (m, tag) =>
    ALLOWED.has(tag.toLowerCase()) ? m : ""
  );
  return out.replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
}

async function main() {
  const wp = JSON.parse(await fs.readFile(IN, "utf8"));
  const imgMap = JSON.parse(await fs.readFile(MAP, "utf8"));
  const bySlug = new Map(wp.map((p) => [p.slug, p]));

  const webImages = (p) =>
    [p.thumb, ...p.gallery]
      .filter(Boolean)
      .map((u) => imgMap[path.basename(u)])
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i); // de-dupe: thumb often repeats in the gallery

  const categories = [];
  const seen = new Set();
  const missing = [];

  for (const [catSlug, slugs] of Object.entries(CATEGORY_PRODUCTS)) {
    const products = [];
    for (const slug of slugs) {
      const p = bySlug.get(slug);
      if (!p) { missing.push(`${catSlug}/${slug}`); continue; }
      seen.add(slug);
      const featureGroups = parseFeatureGroups(p.excerpt);
      const specHtml = sanitise(p.content);
      products.push({
        slug,
        name: decode(p.name ?? p.title),
        wpId: p.id,
        images: webImages(p),
        featureGroups,
        specHtml,
        hasContent: Boolean(featureGroups.length || specHtml),
      });
    }
    categories.push({ slug: catSlug, products });
  }

  const orphans = wp.filter((p) => !seen.has(p.slug)).map((p) => p.slug);

  /* Guard against UTF-8 decoded as latin1. The dump is utf8mb4, and reading it
     a byte at a time turns "≤" into "â‰¤", "–" into "â€“" and '"' into "â€".
     That shipped to live product pages once; fail loudly rather than publish
     gibberish to the client's customers. */
  const MOJIBAKE = /Â[-¿]|Ã[-¿]|â[-¿]/;
  const corrupted = categories
    .flatMap((c) => c.products)
    .filter((p) => MOJIBAKE.test(JSON.stringify(p)));

  if (corrupted.length) {
    console.error(
      `\nENCODING ERROR: ${corrupted.length} product(s) contain mojibake — ` +
        `the dump was probably read as latin1 instead of utf8.\n  ` +
        corrupted.map((p) => p.slug).join("\n  ")
    );
    process.exitCode = 1;
    return;
  }

  await fs.writeFile(OUT, JSON.stringify({ categories }, null, 2) + "\n");

  const all = categories.flatMap((c) => c.products);
  console.log(`categories:      ${categories.length}`);
  console.log(`products mapped: ${all.length} / ${wp.length}`);
  console.log(`  with features: ${all.filter((p) => p.featureGroups.length).length}`);
  console.log(`  with specs:    ${all.filter((p) => p.specHtml).length}`);
  console.log(`  image-only:    ${all.filter((p) => !p.hasContent).length}`);
  console.log(`images wired:    ${all.reduce((s, p) => s + p.images.length, 0)}`);
  if (missing.length) console.log(`\nMISSING products: ${missing.join(", ")}`);
  if (orphans.length) console.log(`ORPHAN products (in WP, not in any category): ${orphans.join(", ")}`);
  console.log(`\n-> ${path.relative(ROOT, OUT)}`);
}

main();
