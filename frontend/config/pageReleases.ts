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

   RELEASE STATE (2026-07-25): THE WHOLE SITE IS LIVE. Every static route is
   flagged `true` and every product route (14 categories + 24 nested products)
   is listed in RELEASED_PRODUCT_ROUTES. Nothing renders Coming Soon any more.

   The gate itself is intentionally left in place rather than removed: it costs
   nothing when everything is released, and it is how any FUTURE page (or a page
   pulled back for a content fix) gets held without a code revert. A new route
   still defaults to DENIED until it is listed here — see the strategy note
   above, which is what stops an unfinished page from leaking to production.

   ─────────────────────────────────────────────────────────────────────────
   ⚠  SYNC RULE (also in CLAUDE.md):
   Whenever a route is ADDED / REMOVED / RENAMED / MOVED, update this file in
   the SAME change. Run `validateReleaseConfig()` (lib/release.ts) before
   finishing any route task — it fails on missing, duplicate or invalid routes.
   ========================================================================== */
import { productRoutes } from "@/data/products";

/** Static (non-product) routes. Keep in sync with the app/ route folders. */
export const STATIC_ROUTE_RELEASES: Record<string, boolean> = {
  "/": true,
  /* The /variant1…18 A/B review pages were removed 2026-07-23 once the client
     chose a hero direction; variant18's hero is now the homepage (app/page.tsx). */
  "/about": true,
  "/vision-mission": true,
  "/network": true,
  "/products": true,
  "/contact": true,
  /* Pages migrated from the client's WordPress footer menu (2026-07-22). */
  "/career": true,
  "/quality-policy": true,
  "/privacy-policy": true,
  "/downloads": true,
};

/**
 * Explicit allow-list of product routes that are LIVE in production.
 *
 * RELEASED 2026-07-25: the full catalogue — all 14 categories and all 24 nested
 * products — is live, together with `/products` itself above.
 *
 * The paths are listed LITERALLY rather than derived from `productRoutes()` on
 * purpose. Deriving them would re-open the exact hole this file was rebuilt to
 * close (see the note below the map): any product added to the tree later would
 * publish itself to production the moment it was written. Keeping the list
 * explicit means a NEW product stays gated until someone deliberately adds its
 * path here — which is the point of a default-deny allow-list.
 *
 * Adding a product to `data/products.ts`? Add its path here in the same change,
 * or it ships as Coming Soon. `assertReleaseConfig()` runs at build via
 * sitemap.ts and will not let an invalid path through.
 */
export const RELEASED_PRODUCT_ROUTES: string[] = [
  /* --- Categories (14) --------------------------------------------------- */
  "/products/ard",
  "/products/cop-lop",
  "/products/elevator-cabin",
  "/products/elevator-control-panel",
  "/products/elevator-display",
  "/products/elevator-doors",
  "/products/elevator-iot",
  "/products/elevator-kit-accessories",
  "/products/integrated-control-panel",
  "/products/lift-master",
  "/products/step-products",
  "/products/synergy-auto-door",
  "/products/touch-cop-lop",
  "/products/voice-announcing-systems",

  /* --- Nested products (24) ---------------------------------------------- */
  "/products/elevator-control-panel/automatic-door-controller",
  "/products/elevator-control-panel/hydraulic-controller",
  "/products/elevator-control-panel/manual-door-controller",
  "/products/elevator-display/xlcd-01-monochrome-lcd-display",
  "/products/elevator-display/xlcd-02-monochrome-lcd-display",
  "/products/elevator-display/xn-1000-led-segment-display",
  "/products/elevator-display/xn-2000-dot-matrix-display",
  "/products/elevator-display/xn-2100-dot-matrix-display",
  "/products/elevator-display/xn-3000-dot-matrix-display",
  "/products/elevator-display/xn-4000-date-time-temperature-display",
  "/products/elevator-display/xtab-smart-display-with-audio",
  "/products/elevator-display/xtft-043-tft-display",
  "/products/elevator-display/xtft-056-tft-display",
  "/products/elevator-display/xtft-070-tft-display",
  "/products/integrated-control-panel/mrl-control-panel",
  "/products/integrated-control-panel/parallel-type-controller",
  "/products/integrated-control-panel/serial-can-bus-type-controller",
  "/products/synergy-auto-door/2-panel-centre-opening",
  "/products/synergy-auto-door/2-panel-telescopic-side-opening",
  "/products/synergy-auto-door/4-panel-centre-opening",
  "/products/voice-announcing-systems/close-door-announcer",
  "/products/voice-announcing-systems/elevator-gong",
  "/products/voice-announcing-systems/fa-250-mp3-voice-ann-system",
  "/products/voice-announcing-systems/fa-50-chip-based-voice-ann-system",
];

/* Every product route (/products/<category> and /products/<category>/<product>)
   is enumerated from the product tree so the config is exhaustive; each is only
   released if it appears in RELEASED_PRODUCT_ROUTES (default-deny).

   NOTE: production gating deliberately does NOT consult the node's `released`
   flag. That flag is a content-readiness hint on the product tree (23 nodes are
   marked ready) and using it here silently published every "ready" product to
   production, which is why /products/* was live. Gating is governed ONLY by the
   explicit RELEASED_PRODUCT_ROUTES allow-list (currently empty → all gated). */
const PRODUCT_ROUTE_RELEASES: Record<string, boolean> = Object.fromEntries(
  productRoutes().map((r) => [r.path, RELEASED_PRODUCT_ROUTES.includes(r.path)])
);

/** The complete route → release map. */
export const ROUTE_RELEASES: Record<string, boolean> = {
  ...STATIC_ROUTE_RELEASES,
  ...PRODUCT_ROUTE_RELEASES,
};

/** Every known route path. */
export const ALL_ROUTES: string[] = Object.keys(ROUTE_RELEASES);
