import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";
import { assertReleaseConfig, releasedRoutes } from "@/lib/release";

/* Required for `output: "export"` — the sitemap is generated once at build.
   Only routes released in the current environment are listed, so a production
   build never advertises gated "Coming Soon" pages. Building the sitemap is
   also where we assert the page-release config is valid (fails the build if
   a route is missing, duplicated or invalid). */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  assertReleaseConfig();

  const base = SITE.url;
  const now = new Date();

  /* The /variant* review routes were removed 2026-07-23; the guard stays as a
     cheap safety net so a stray variant route could never reach the sitemap. */
  const publicRoutes = releasedRoutes().filter(
    (route) => !route.startsWith("/variant")
  );

  return publicRoutes.map((route) => {
    const depth = route === "/" ? 0 : route.split("/").filter(Boolean).length;
    const priority = route === "/" ? 1 : depth === 1 ? 0.8 : depth === 2 ? 0.7 : 0.6;
    return {
      url: `${base}${route === "/" ? "" : route}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority,
    };
  });
}
