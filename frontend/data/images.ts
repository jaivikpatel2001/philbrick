/* =============================================================================
   PHILBRICK — IMAGE CATALOG (single source of truth)

   Every image the site renders is now custom, India-focused brand photography
   stored locally under public/images/<page>/… (see imagegeneration.md for the
   full brief + asset mapping). There are NO external/Unsplash images.

   Delivery: paths point at the .png source of record; lib/imageLoader.ts rewrites
   each request to the right pre-generated responsive WebP variant
   (scripts/optimizeImages.mjs), so next/image keeps full srcset behaviour with no
   server (static export).

   Two images from imagegeneration.md have not been supplied yet and are tracked
   as MISSING (see notes below): §3.4 Hospitality and §4.6 Synergy Auto Door cover.
   ========================================================================== */

/* ----- Page heroes (16:9, full-bleed) — one per page ------------------- */
export const HERO = {
  products: "/images/products/products-hero.png",
  about: "/images/about/about-hero.png",
  visionMission: "/images/vision-mission/vision-mission-hero.png",
  milestone: "/images/milestone/milestone-hero.png",
  infrastructure: "/images/infrastructure/infrastructure-hero.png",
  network: "/images/network/network-hero.png",
  newsEvents: "/images/news-events/news-events-hero.png",
  contact: "/images/contact/contact-hero.png",
} as const;

/* ----- Editorial section media (4:5 portrait) ------------------------- */
export const SECTION = {
  whoWeAre: "/images/home/who-we-are.png", // home "01 Who we are"
  aboutStory: "/images/about/about-story.png", // About "Who we are"
  infrastructureIntro: "/images/infrastructure/infrastructure-intro.png", // Infrastructure "Under one roof"
} as const;

/* ----- Applications / industries (3:4 portrait cards) ----------------- */
export const INDUSTRY_IMG = {
  residential: "/images/home/application-residential.png",
  commercial: "/images/home/application-commercial.png",
  healthcare: "/images/home/application-healthcare.png",
  hospitality: "/images/home/application-hospitality.png",
  industrial: "/images/home/application-industrial.png",
  institutional: "/images/home/application-institutional.png",
  transit: "/images/home/application-transit.png",
} as const;

/* ----- News & Events (16:9, mock newsroom) ---------------------------- */
export const NEWS_IMG = {
  serialCanBus: "/images/news-events/news-serial-can-bus.png",
  expo: "/images/news-events/news-expo.png",
  training: "/images/news-events/news-training.png",
  facilityUpgrade: "/images/news-events/news-facility-upgrade.png",
  ardSafety: "/images/news-events/news-ard-safety.png",
  network: "/images/news-events/news-network.png",
} as const;

/* ----- Product category covers (keyed by category slug) ---------------
   /images/products/<slug>/<slug>.png. Used by the mega menu (constants/
   navigation.ts) and mirrored by each node's `image` in data/products.ts. */
export const CATEGORY_IMG: Record<string, string> = {
  "elevator-control-panel": "/images/products/elevator-control-panel/elevator-control-panel.png",
  "integrated-control-panel": "/images/products/integrated-control-panel/integrated-control-panel.png",
  "elevator-iot": "/images/products/elevator-iot/elevator-iot.png",
  "ard": "/images/products/ard/ard.png",
  "lift-master": "/images/products/lift-master/lift-master.png",
  "synergy-auto-door": "/images/products/synergy-auto-door/synergy-auto-door.png",
  "elevator-doors": "/images/products/elevator-doors/elevator-doors.png",
  "elevator-cabin": "/images/products/elevator-cabin/elevator-cabin.png",
  "elevator-display": "/images/products/elevator-display/elevator-display.png",
  "cop-lop": "/images/products/cop-lop/cop-lop.png",
  "touch-cop-lop": "/images/products/touch-cop-lop/touch-cop-lop.png",
  "voice-announcing-systems": "/images/products/voice-announcing-systems/voice-announcing-systems.png",
  "elevator-kit-accessories": "/images/products/elevator-kit-accessories/elevator-kit-accessories.png",
  "step-products": "/images/products/step-products/step-products.png",
};

/* ----- CTA band (21:9, shared across pages) --------------------------- */
export const CTA_BAND = "/images/shared/cta-band.png";

/* ----- Services heroImage (data/services.ts type field, not rendered) --
   Kept only so the Service type's `heroImage` resolves to a local asset; these
   are not shown in the UI. Mapped to topically-adjacent local photography. */
export const SERVICE_IMG = {
  installation: "/images/infrastructure/infrastructure-hero.png",
  maintenance: "/images/news-events/news-training.png",
  modernization: "/images/about/about-story.png",
  amc: "/images/products/ard/ard.png",
} as const;

/* Branded Open Graph / social share image (Philbrick logo on navy). */
export const OG_IMAGE = "/brand/philbrick-og.png";
