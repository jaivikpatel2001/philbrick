/* =============================================================================
   CUSTOM next/image LOADER (static export)

   A static export (`output: "export"`) has no server-side optimizer, so the
   responsive pipeline is pre-generated at build time by scripts/optimizeImages.mjs:
   every local brand photo (`/images/<page>/<name>.png`) has a ladder of WebP
   width variants (`<name>-<w>.webp`) recorded in lib/imageManifest.json.

   This loader maps next/image's per-device width requests onto the nearest
   available WebP variant, so next/image keeps full srcset/sizes behaviour (a
   right-sized, modern-format file per device) with zero server. Anything not in
   the manifest (logo, OG card, icons, inline SVG) passes through untouched.
   ========================================================================== */

import manifest from "./imageManifest.json";

const VARIANT_WIDTHS = manifest as Record<string, number[]>;

/* Brand photography is PNG; the client's original product catalogue photos are
   JPG (scripts/optimizeProductImages.mjs). Both ladder into WebP the same way. */
const SOURCE_EXT = /\.(png|jpe?g)$/i;

export default function imageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const clean = src.split("?")[0];
  const widths = VARIANT_WIDTHS[clean];
  const ext = clean.match(SOURCE_EXT);
  if (widths && widths.length > 0 && ext) {
    // Smallest generated width that still covers the request (cap at the largest).
    const chosen = widths.find((w) => w >= width) ?? widths[widths.length - 1];
    return `${clean.slice(0, -ext[0].length)}-${chosen}.webp`;
  }
  return src;
}
