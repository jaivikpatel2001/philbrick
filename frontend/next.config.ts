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
