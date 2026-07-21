/* =============================================================================
   PHILBRICK — PAGE RELEASE CONFIGURATION  (single source of truth)

   Every route in the application must appear here with a `true | false`
   production release flag:
     • true  -> the real page is shown in production.
     • false -> the animated "Coming Soon" screen is shown in production.
   In DEVELOPMENT the flags are ignored and every route is accessible.

   ─────────────────────────────────────────────────────────────────────────
   SECURE DEFAULT-DENY STRATEGY
   Production routes are DISABLED unless explicitly enabled here. A route only
   shows real content in production when its flag is `true` (static) or its path
   is listed in RELEASED_PRODUCT_ROUTES (product). Any route that is not listed
   — including any future/unlisted product route — is treated as DISABLED in
   production (see lib/release.ts `isReleased`). This prevents a new product
   route from accidentally leaking to production.

   INITIAL PRODUCTION RELEASE (2026-07-11): only "/" (Home) is live. Every other
   page shows the branded Coming Soon screen. To release a page, flip its flag
   below (static) or add its path to RELEASED_PRODUCT_ROUTES (product).

   ─────────────────────────────────────────────────────────────────────────
   ⚠  SYNC RULE (also in CLAUDE.md):
   Whenever a route is ADDED / REMOVED / RENAMED / MOVED, update this file in
   the SAME change. Run `validateReleaseConfig()` (lib/release.ts) before
   finishing any route task — it fails on missing, duplicate or invalid routes.
   ========================================================================== */
import { productRoutes } from "@/data/products";
import { newsRoutes } from "@/data/news";

/** Static (non-product) routes. Keep in sync with the app/ route folders. */
export const STATIC_ROUTE_RELEASES: Record<string, boolean> = {
  "/": true,
  /* Client-review A/B alternatives of the homepage. Live so they can be shared
     with the client, but noindex (see each app/variantN/page.tsx) and excluded
     from the sitemap (app/sitemap.ts filters the /variant prefix). Temporary —
     remove once a hero direction is chosen.
       variant1  exploded component tour (photo cutouts + GSAP)
       variant2  architectural journey (Three.js fly-through)
       variant3  engineering blueprint (Three.js scan transformation)
       variant4  immersive storytelling (Three.js single take gallery)
       variant5  night arrival (Three.js §10.1 world + 8 part showcase)
       variant6  the original journey, photoreal edition (matte slots)
       variant7  classic split (clean corporate, no WebGL)
       variant8  building showcase (clean corporate, no WebGL)
       variant9  premium interior (clean corporate, no WebGL)
       variant10 product feature showcase (clean corporate, no WebGL)
       variant11 catalogue exploded tour (variant1 + drawing + catalogue parts)
       variant12 catalogue journey (variant6 3D arrival + catalogue overlay)
       variant13 corporate scroll component reveal (drawing + parts)
       variant14 animated floating product gallery (corporate)
       variant15 product spotlight hero + category browser (corporate)
       variant16 centred hero on a theme-swapped city photo + floating glass nav
       variant17 variant16 + depth hero (headline behind a cutout tower) */
  "/variant1": true,
  "/variant2": true,
  "/variant3": true,
  "/variant4": true,
  "/variant5": true,
  "/variant6": true,
  "/variant7": true,
  "/variant8": true,
  "/variant9": true,
  "/variant10": true,
  "/variant11": true,
  "/variant12": true,
  "/variant13": true,
  "/variant14": true,
  "/variant15": true,
  "/variant16": true,
  "/variant17": true,
  "/about": false,
  "/vision-mission": false,
  "/milestone": false,
  "/infrastructure": false,
  "/network": false,
  "/news-events": false,
  "/products": false,
  "/contact": false,
};

/**
 * Explicit allow-list of product routes that are LIVE in production.
 * Default: empty — ALL product routes (categories + nested products) are
 * disabled. Add a full path (e.g. "/products/ard") to release a single page.
 */
export const RELEASED_PRODUCT_ROUTES: string[] = [];

/**
 * Explicit allow-list of News & Events detail routes live in production.
 * Default: empty — all `/news-events/<slug>` detail pages are disabled (the
 * `/news-events` listing is disabled in STATIC_ROUTE_RELEASES too).
 */
export const RELEASED_NEWS_ROUTES: string[] = [];

/* Every product route (/products/<category> and /products/<category>/<product>)
   is enumerated from the product tree so the config is exhaustive; each is only
   released if it appears in RELEASED_PRODUCT_ROUTES (default-deny). */
const PRODUCT_ROUTE_RELEASES: Record<string, boolean> = Object.fromEntries(
  productRoutes().map((r) => [r.path, RELEASED_PRODUCT_ROUTES.includes(r.path)])
);

/* News & Events detail routes, enumerated from the news data (default-deny). */
const NEWS_ROUTE_RELEASES: Record<string, boolean> = Object.fromEntries(
  newsRoutes().map((path) => [path, RELEASED_NEWS_ROUTES.includes(path)])
);

/** The complete route → release map. */
export const ROUTE_RELEASES: Record<string, boolean> = {
  ...STATIC_ROUTE_RELEASES,
  ...PRODUCT_ROUTE_RELEASES,
  ...NEWS_ROUTE_RELEASES,
};

/** Every known route path. */
export const ALL_ROUTES: string[] = Object.keys(ROUTE_RELEASES);
