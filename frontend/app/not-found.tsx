import { Button } from "@/components/ui/Button";
import styles from "./not-found.module.css";

/* =============================================================================
   404 — PAGE NOT FOUND

   Built from the same vocabulary as the rest of the site rather than as a
   standalone screen: the drifting aurora + blueprint grid and the elevator
   floor-indicator motif are the ones ComingSoon already uses, so a visitor who
   lands here recognises it as philbrick. The idea is a lift display that has
   been sent to a floor the building does not have: the direction arrow is stuck
   in the fault colour (--accent-2, the brand's signal red), the readout shows
   404, and a scan line sweeps the panel looking for a floor it will not find.

   WHY THIS IS `not-found.tsx` AND NOT `global-not-found.tsx`
   Next 16 offers both. `global-not-found` catches unmatched URLs at the routing
   level, but it BYPASSES the root layout — no navbar, no footer, no theme or
   smooth-scroll providers — and would have to re-import global styles and fonts
   itself. That directly contradicts the goal of the page feeling like part of
   the site, and it is unnecessary here: the static export already emits
   out/404.html, Render serves it with a real 404 status for any unknown path,
   and public/.htaccess maps it with `ErrorDocument 404 /404.html` for cPanel.
   Client-side navigation to a missing route renders this same component.

   Entirely CSS-animated, so this stays a Server Component and ships no extra
   JavaScript. Every animation is switched off under prefers-reduced-motion.
   ========================================================================== */

export default function NotFound() {
  return (
    <section className={styles.wrap} aria-labelledby="not-found-title">
      {/* Ambient background, shared language with the Coming Soon screen */}
      <div className={styles.aurora} aria-hidden />
      <div className={styles.grid} aria-hidden />

      <div className={`container--narrow ${styles.panel}`}>
        {/* Elevator floor indicator, stuck on a floor that does not exist */}
        <div className={styles.indicator} aria-hidden>
          <span className={styles.arrow} />
          <span className={styles.readout}>
            <span className={styles.digit}>4</span>
            <span className={`${styles.digit} ${styles.digitMid}`}>0</span>
            <span className={styles.digit}>4</span>
            <span className={styles.scan} />
          </span>
        </div>

        <span className={`eyebrow ${styles.eyebrow}`}>
          Error 404 · Page not found
        </span>

        <h1 id="not-found-title" className={styles.title}>
          This floor doesn&apos;t exist.
        </h1>

        <p className={styles.text}>
          The page you were looking for may have been moved, renamed, or never
          existed. Let&apos;s get you back to a floor that does.
        </p>

        <div className={styles.actions}>
          <Button href="/" withArrow>
            Back to home
          </Button>
          <Button href="/contact" variant="secondary">
            Contact us
          </Button>
        </div>
      </div>
    </section>
  );
}
