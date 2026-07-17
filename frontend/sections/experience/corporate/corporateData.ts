/* =============================================================================
   CORPORATE HERO VARIANTS (7–10) — shared content.

   A clean, premium, corporate direction (no WebGL, real product photography,
   light backgrounds, trust badges) for client A/B review. Copy uses only
   verifiable Philbrick facts (constants/site.ts + data/company.ts): founded
   1992 in Ahmedabad; ISO quality process tested to Indian standards; in-house
   manufacturing; exporter (India, China, Taiwan). The brief's "1000+ Projects"
   and "ISI Certified" are intentionally omitted — not in the verified data.
   ========================================================================== */

export interface TrustBadge {
  stat: string;
  label: string;
}

export const TRUST_BADGES: TrustBadge[] = [
  { stat: "Since 1992", label: "Three decades of engineering" },
  { stat: "ISO Process", label: "Tested to Indian standards" },
  { stat: "In-house", label: "Built in Ahmedabad, India" },
  { stat: "Exporter", label: "India, China and Taiwan" },
];

export const CTA = {
  primary: { label: "Get a free quote", href: "/contact" },
  secondary: { label: "Explore products", href: "/products" },
} as const;

/* Real imagery already shipped for the exploration hero — reused here so no new
   assets are introduced (all delivered as WebP through the next/image loader). */
export const HERO_IMG = {
  /** the assembled machine cutaway (transparent) */
  product: "/images/home/hero-exploration/spine/elevator-cutaway.png",
  productAspect: 1024 / 1536,
  /** a premium substantial glass tower on a clean white studio background */
  tower: "/images/home/hero-exploration/environment/india-tower.png",
  /** a premium elevator lobby interior (open dark doorway) */
  lobby: "/images/home/hero-exploration/environment/lobby-backdrop.png",
  /** a single brushed door leaf (transparent) */
  doorLeaf: "/images/home/hero-exploration/environment/door-leaf.png",
  components: "/images/home/hero-exploration/components",
  /* real site photography (matches the rest of the website) */
  cabin: "/images/products/elevator-cabin/elevator-cabin.png",
  craft: "/images/home/who-we-are.png",
} as const;

/* Variant 10 — the product range, using the site's real product photography +
   real category names (data/images.ts CATEGORY_IMG). */
export const PRODUCT_TILES = [
  { img: "/images/products/elevator-control-panel/elevator-control-panel.png", title: "Control panels", sub: "Automatic, manual and integrated", href: "/products/elevator-control-panel" },
  { img: "/images/products/elevator-cabin/elevator-cabin.png", title: "Cabins and interiors", sub: "Premium finishes and fixtures", href: "/products/elevator-cabin" },
  { img: "/images/products/synergy-auto-door/synergy-auto-door.png", title: "Automatic doors", sub: "Synergy door operators", href: "/products/synergy-auto-door" },
  { img: "/images/products/elevator-display/elevator-display.png", title: "Displays and signalling", sub: "LED, dot-matrix, LCD and TFT", href: "/products/elevator-display" },
] as const;

/* Variant 8 — floating specification cards around the building. */
export const SPEC_CARDS = [
  { value: "Up to 8 m/s", label: "Rated speed" },
  { value: "Machine room-less", label: "Space-saving drive" },
  { value: "Gearless traction", label: "Smooth, efficient ride" },
  { value: "Automatic rescue", label: "Safe landing on power loss" },
] as const;

/* Variant 10 — hotspots on the product image. Positions are % of the image box
   (x from left, y from top). Copy maps each feature to a real Philbrick system. */
export interface Hotspot {
  key: string;
  title: string;
  spec: string;
  x: number;
  y: number;
}

export const HOTSPOTS: Hotspot[] = [
  { key: "machine", title: "Gearless machine", spec: "Compact, efficient traction drive", x: 52, y: 12 },
  { key: "controller", title: "Smart controller", spec: "Integrated CAN-bus control panel", x: 74, y: 34 },
  { key: "cabin", title: "Premium cabin", spec: "Brushed steel, LED cove lighting", x: 50, y: 52 },
  { key: "doors", title: "Automatic doors", spec: "Synergy door operator", x: 30, y: 66 },
  { key: "safety", title: "Safety system", spec: "Governor and progressive brakes", x: 52, y: 86 },
];
