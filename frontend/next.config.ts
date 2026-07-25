import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Static export — every route is prerendered (SSG), so the site deploys to
     any static host (Render Static Site, cPanel/Apache). `next build` emits
     `out/`. Note: `next start` doesn't apply in this mode; `next dev` is
     unchanged.

     ── WHY THERE IS NO `compress` OR `headers()` HERE ─────────────────────────
     Both are server features and neither exists in a static export:

       * `compress` (next.config) only applies to `next start` or a custom Node
         server — "Next.js uses gzip to compress rendered content and static
         files when using `next start` or a custom server"
         (node_modules/next/dist/docs/.../05-config/01-next-config-js/compress.md).
         There is no Next.js process in production here, so gzip/Brotli is
         entirely the web server's job: Apache mod_deflate/mod_brotli on cPanel
         (public/.htaccess) or Render's edge (automatic).

       * `headers()` is listed under "Unsupported Features" for `output:
         "export"` (node_modules/next/dist/docs/.../02-guides/static-exports.md),
         because response headers require a server to emit them. Cache-Control /
         Expires therefore live in public/.htaccess (cPanel) and render.yaml or
         the Render dashboard (Render). See both files for the exact rules.

     `experimental.inlineCss` was evaluated and deliberately NOT enabled: the
     site's CSS is ~130 KB raw across three shared chunks and every route reuses
     it, which is exactly the "large CSS bundle / many pages sharing styles"
     case the Next docs say to skip (inlined CSS cannot be cached across pages).
     `experimental.cssChunking` is left at its `true` default, which already
     merges CSS files to reduce request count. */
  output: "export",

  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    /* A static export has no server-side optimizer, so the responsive ladder is
       pre-generated at build time (scripts/optimizeImages.mjs,
       optimizeHeroExploration.mjs, optimizeProductImages.mjs) and mapped by a
       custom loader: next/image keeps full srcset/sizes behaviour — a
       right-sized WebP per device — with zero server. See lib/imageLoader.ts
       and lib/imageManifest.json. */
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
    /* next/image only ever asks the loader for widths in this ladder (plus
       `deviceSizes`, [640, 750, 828, 1080, …], for large/100vw images). The
       default is [16, 32, 48, 64, 96, 128, 256, 384]. Two gaps in it were
       costing real bytes on the homepage:

       320 — the component cards (CategoryBrowse15) resolve `sizes` to 280px,
         which with nothing between 256 and 384 forced every one of the nine
         cards up to the 384 variant. elevator-door: 53.6 KB -> 38.1 KB.

       560 — the applications carousel (IndustriesShowcase) was the big one.
         Its `.card` is `flex: 0 0 340px` above 640px and `78vw` below, so
         `sizes="(max-width: 640px) 78vw, 340px"` is exactly right. But when
         `sizes` contains any vw unit, next/image discards every candidate below
         `min(vw) * deviceSizes[0]` = 0.78 * 640 = 499px. With the default
         ladder that left 640w as the smallest candidate, which the loader then
         mapped UP to the 900px file — for a slot 340px wide. Adding 560 (a step
         the manifest ALREADY had on disk) lets a 340px slot pick the 560 file:
         application-residential 158 KB -> 72 KB, across seven cards.

         Mobile is unaffected: at a 640px viewport and 2x DPR the slot is still
         ~998 device px, so it picks 1080w -> the 1200 file exactly as before. */
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 320, 384, 560],
    /* Default deviceSizes jump 1200 -> 1920, so the full-bleed hero on any
       laptop between those widths (a 1350px Lighthouse desktop run, a 1440px
       MacBook) had to take the 1920 plate. The hero ladder already generates
       1536 (scripts/optimizeHeroExploration.mjs FULL_BLEED_WIDTHS), so adding
       the matching step lets those screens take it instead:
       hero-scene-day 182.1 KB -> 123.4 KB and night 256.4 KB -> 179.7 KB.
       1920+ screens are unaffected — they still resolve to the 1920 plate. */
    deviceSizes: [640, 750, 828, 1080, 1200, 1536, 1920, 2048, 3840],
  },
  experimental: {
    /* Barrel-file packages: import only the modules actually used so a single
       icon does not pull the whole set into the client bundle.
       (`gsap` was removed from this list with the dependency itself — the
       ScrollTrigger wiring in SmoothScroll drove no animations.) */
    optimizePackageImports: ["react-icons", "framer-motion", "swiper"],
  },
};

export default nextConfig;
