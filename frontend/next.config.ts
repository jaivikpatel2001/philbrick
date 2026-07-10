import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Static export — every route is prerendered (SSG), so the site deploys to
     any static host (Render Static Site, etc.). `next build` emits `out/`.
     Note: `next start` doesn't apply in this mode; `next dev` is unchanged. */
  output: "export",

  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    /* A static export has no server-side optimizer, so responsive sizing is
       delegated to Unsplash's image CDN via a custom loader: next/image keeps
       full srcset/sizes behavior (right-sized files per device, AVIF/WebP via
       auto=format) with zero server. See lib/imageLoader.ts. */
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
  },
};

export default nextConfig;
