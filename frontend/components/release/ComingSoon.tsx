import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { getCategory, getProduct } from "@/data/products";
import { releasedRoutes } from "@/lib/release";
import styles from "./ComingSoon.module.css";

/* Friendly labels for the known static routes. Product routes resolve their
   name from the product tree; anything else falls back to a title-cased slug. */
const STATIC_LABELS: Record<string, string> = {
  "/": "Home",
  "/about": "About",
  "/contact": "Contact",
  "/products": "Products",
  "/vision-mission": "Vision & Mission",
  "/milestone": "Milestone & Awards",
  "/infrastructure": "Infrastructure",
  "/network": "Network",
  "/news-events": "News & Events",
};

/** English list join: ["Home"] → "Home"; ["Home","About","Contact"] →
   "Home, About and Contact". */
function joinLabels(labels: string[]): string {
  if (labels.length <= 1) return labels[0] ?? "";
  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function labelForRoute(route: string): string {
  if (STATIC_LABELS[route]) return STATIC_LABELS[route];
  const parts = route.split("/").filter(Boolean); // ["products","cat","prod"]
  if (parts[0] === "products" && parts[1]) {
    if (parts[2]) return getProduct(parts[1], parts[2])?.name ?? titleCase(parts[2]);
    return getCategory(parts[1])?.name ?? titleCase(parts[1]);
  }
  return parts.length ? titleCase(parts[parts.length - 1]) : "This page";
}

/** Digits shown on the animated floor-indicator reel. */
const FLOORS = ["G", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

interface ComingSoonProps {
  route: string;
  /** Optional explicit section name (overrides the derived label). */
  label?: string;
}

/**
 * Full-page "Coming Soon" experience shown for routes not yet released in
 * production. Premium, themed (light/dark via tokens), responsive and
 * reduced-motion aware. Purely CSS-animated — safe as a server component.
 */
export function ComingSoon({ route, label }: ComingSoonProps) {
  const name = label ?? labelForRoute(route);

  // Only ever point visitors at pages that are genuinely live right now: the
  // released top-level pages (excludes the current gated route + deep product
  // routes). In production this is just Home until more pages are released; it
  // expands automatically as routes are flagged live in config/pageReleases.ts.
  const live = releasedRoutes()
    .filter((r) => r !== route && !r.includes("["))
    .filter((r) => r === "/" || r.split("/").filter(Boolean).length === 1)
    .sort((a, b) => (a === "/" ? -1 : b === "/" ? 1 : a.localeCompare(b)))
    .slice(0, 4)
    .map((r) => ({ href: r, label: STATIC_LABELS[r] ?? labelForRoute(r) }));

  const liveLabels = live.map((l) => l.label);
  const liveSentence = liveLabels.length
    ? `In the meantime, explore our ${joinLabels(liveLabels)} ${
        liveLabels.length > 1 ? "pages" : "page"
      }.`
    : "In the meantime, please check back soon.";

  return (
    <section className={styles.wrap} aria-labelledby="coming-soon-title">
      {/* Ambient background */}
      <div className={styles.aurora} aria-hidden />
      <div className={styles.grid} aria-hidden />

      <div className={`container--narrow ${styles.panel}`}>
        <Logo className={styles.logo} />

        {/* Elevator floor-indicator motif */}
        <div className={styles.indicator} aria-hidden>
          <span className={styles.arrow} />
          <span className={styles.reelMask}>
            <span className={styles.reel}>
              {FLOORS.map((f) => (
                <span key={f} className={styles.digit}>
                  {f}
                </span>
              ))}
            </span>
          </span>
        </div>

        <span className={`eyebrow ${styles.eyebrow}`}>Coming soon</span>
        <h1 id="coming-soon-title" className={styles.title}>
          {name} is on its way
        </h1>
        <p className={styles.text}>
          We&apos;re putting the finishing touches on this section. It will be
          available here shortly. {liveSentence}
        </p>

        <div className={styles.actions}>
          {(live.length ? live : [{ href: "/", label: "Home" }]).map((l, i) => (
            <Button
              key={l.href}
              href={l.href}
              withArrow={i === 0}
              variant={i === 0 ? undefined : "secondary"}
            >
              {l.href === "/" ? "Back to home" : l.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
