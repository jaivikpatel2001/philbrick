import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";

/* Required for `output: "export"` — robots.txt is generated once at build. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
