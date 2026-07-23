/* =============================================================================
   PHILBRICK — PAGE RELEASE LOGIC
   Centralised environment + gating logic for the page-release system.
   Consumed by components/release/ReleaseGate.tsx, robots.ts and sitemap.ts.
   ========================================================================== */
import {
  ROUTE_RELEASES,
  STATIC_ROUTE_RELEASES,
  ALL_ROUTES,
} from "@/config/pageReleases";
import { productRoutes } from "@/data/products";

export type AppEnv = "development" | "production";

/**
 * Resolve the active app environment. An explicit NEXT_PUBLIC_APP_ENV wins;
 * otherwise fall back to NODE_ENV (`next dev` = development, `next build` =
 * production). Anything that isn't exactly "production" is treated as
 * development so pages never gate unexpectedly in local/staging work.
 */
export function getAppEnv(): AppEnv {
  const raw = (
    process.env.NEXT_PUBLIC_APP_ENV ??
    process.env.NODE_ENV ??
    "development"
  )
    .trim()
    .toLowerCase();
  /* Fail CLOSED: only an explicit "development" opens every page; ANY other
     value enforces the release flags. This is deliberate:
       • `.trim()` — a hosting dashboard (Render's value textarea) can store the
         value with a trailing newline, and the old `=== "production"` check
         failed on "production\n", silently opening the WHOLE site in prod.
       • production-by-default — an unset/typo'd/empty env now gates rather than
         leaks unreleased pages. Local `next dev` still sets NODE_ENV
         "development" (and .env.local sets NEXT_PUBLIC_APP_ENV=development), so
         local work is unaffected. */
  return raw === "development" ? "development" : "production";
}

/** True only when release flags are enforced (production). */
export const IS_PRODUCTION_RELEASE = getAppEnv() === "production";

/**
 * Whether a route shows its real content.
 *   • development -> always true (every page open)
 *   • production  -> only when flagged `true` in config/pageReleases.ts
 * Unknown routes default to NOT released in production (safe).
 */
export function isReleased(route: string): boolean {
  if (getAppEnv() !== "production") return true;
  return ROUTE_RELEASES[route] === true;
}

/** All routes that resolve to real content in the current environment. */
export function releasedRoutes(): string[] {
  return ALL_ROUTES.filter((route) => isReleased(route));
}

/**
 * Validate the release configuration. Cross-checks the composed map against the
 * product tree and static config for duplicates, collisions and invalid keys.
 * Returns structured results; callers can throw (see assertReleaseConfig).
 */
export function validateReleaseConfig(): { ok: boolean; errors: string[] } {
  const errors: string[] = [];

  // 1. No duplicate product routes coming out of the tree.
  const seen = new Set<string>();
  for (const { path } of productRoutes()) {
    if (seen.has(path)) errors.push(`Duplicate product route: ${path}`);
    seen.add(path);
  }

  // 2. No collision between static and product routes.
  for (const path of seen) {
    if (path in STATIC_ROUTE_RELEASES) {
      errors.push(`Route defined in both static and product config: ${path}`);
    }
  }

  // 3. Every entry is a valid path with a boolean flag.
  for (const [route, flag] of Object.entries(ROUTE_RELEASES)) {
    if (!route.startsWith("/")) errors.push(`Route key must start with "/": ${route}`);
    if (typeof flag !== "boolean") errors.push(`Route ${route} has a non-boolean flag`);
  }

  return { ok: errors.length === 0, errors };
}

/** Throw if the release config is invalid — call at build time to fail fast. */
export function assertReleaseConfig(): void {
  const { ok, errors } = validateReleaseConfig();
  if (!ok) {
    throw new Error(
      `Invalid page-release configuration (config/pageReleases.ts):\n` +
        errors.map((e) => `  • ${e}`).join("\n")
    );
  }
}
