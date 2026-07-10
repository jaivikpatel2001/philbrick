/* =============================================================================
   CUSTOM next/image LOADER (static export)
   A static host has no server-side optimizer, but every image on this site is
   served by Unsplash's image CDN — so we map Next's responsive width requests
   onto Unsplash's own `w`/`q`/`auto=format` parameters. next/image gets full
   srcset/sizes behavior (right-sized files per device, AVIF/WebP) with zero
   server. Non-Unsplash (local /public) sources pass through untouched.
   ========================================================================== */

export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    // Preserve the original crop ratio when a fixed height was requested.
    const w0 = Number(url.searchParams.get("w"));
    const h0 = Number(url.searchParams.get("h"));
    if (w0 > 0 && h0 > 0) {
      url.searchParams.set("h", String(Math.round((h0 / w0) * width)));
    }
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 75));
    url.searchParams.set("auto", "format");
    return url.toString();
  }
  return src;
}
