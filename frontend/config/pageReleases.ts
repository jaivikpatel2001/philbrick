/* =============================================================================
   PHILBRICK — PAGE RELEASE CONFIGURATION  (single source of truth)

   Every route in the application must appear here with a `true | false`
   production release flag:
     • true  -> the real page is shown in production.
     • false -> the animated "Coming Soon" screen is shown in production.
   In DEVELOPMENT the flags are ignored and every route is accessible.

   ─────────────────────────────────────────────────────────────────────────
   ⚠  SYNC RULE (also in CLAUDE.md):
   Whenever a route is ADDED / REMOVED / RENAMED / MOVED, update this file in
   the SAME change. Static routes live in STATIC_ROUTE_RELEASES below; product
   routes are derived from the product tree (data/products.ts) and each node's
   `released` flag. Run `validateReleaseConfig()` (lib/release.ts) before
   finishing any route task — it fails on missing, duplicate or invalid routes.
   ========================================================================== */
import { productRoutes } from "@/data/products";

/** Static (non-product) routes. Keep in sync with the app/ route folders. */
export const STATIC_ROUTE_RELEASES: Record<string, boolean> = {
  "/": true,
  "/about": false,
  "/vision-mission": false,
  "/milestone": false,
  "/infrastructure": false,
  "/network": false,
  "/news-events": false,
  "/products": true,
  "/contact": true,
};

/* Product routes (/products/<category> and /products/<category>/<product>)
   with their per-node release flags, composed from the product tree. */
const PRODUCT_ROUTE_RELEASES: Record<string, boolean> = Object.fromEntries(
  productRoutes().map((r) => [r.path, r.released])
);

/** The complete route → release map. */
export const ROUTE_RELEASES: Record<string, boolean> = {
  ...STATIC_ROUTE_RELEASES,
  ...PRODUCT_ROUTE_RELEASES,
};

/** Every known route path. */
export const ALL_ROUTES: string[] = Object.keys(ROUTE_RELEASES);
