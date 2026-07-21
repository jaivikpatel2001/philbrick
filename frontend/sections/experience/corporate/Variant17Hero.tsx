"use client";
/* =============================================================================
   VARIANT 17 — variant16 with a DEPTH hero: the headline sits BEHIND the tower.

   The occlusion cannot come from one picture. If the words were baked into the
   artwork the <h1> would stop being text — no scaling on mobile, nothing for
   search engines to read, and blur on large screens. So the hero is a three
   layer sandwich and the heading stays real, selectable markup:

     z 3   foreground tower   transparent PNG, drawn OVER the text
     z 2   content            <h1>, eyebrow, lead, trust badges
     z 1   scrim              legibility veil
     z 0   sky                full-bleed background photograph

   Each layer has a day and a night plate, cross-faded purely in CSS by the
   `[data-theme]` attribute the ThemeProvider sets on <html> before paint, so
   the swap needs no JS and never flashes.

   Until the four photographs are supplied the page still builds and renders:
   lib/imageLoader.ts passes unknown paths through untouched, so the hero simply
   shows its gradient fallback rather than breaking.
   ========================================================================== */
import { useEffect } from "react";
import Image from "next/image";
import { TrustBadges } from "./TrustBadges";
import styles from "./corporate.module.css";

const ENV = "/images/home/hero-exploration/environment";

/** Background plates — open, uncluttered centre so the tower reads against sky. */
export const HERO_SKY = {
  day: `${ENV}/hero-sky-day.png`,
  night: `${ENV}/hero-sky-night.png`,
} as const;

/** Foreground cutouts — transparent PNGs that overlap the headline. */
export const HERO_TOWER = {
  day: `${ENV}/hero-tower-day.png`,
  night: `${ENV}/hero-tower-night.png`,
} as const;

const TRUST_ONLY = ["Since 1992", "In-house"] as const;

export function Variant17Hero() {
  /* opt this page into the floating glass navbar (same as variant16) */
  useEffect(() => {
    const de = document.documentElement;
    de.setAttribute("data-nav", "float");
    return () => de.removeAttribute("data-nav");
  }, []);

  return (
    <section
      className={styles.hero17}
      aria-label="Philbrick elevator components, engineered in India since 1992"
    >
      {/* z 0 — sky */}
      <div className={styles.bg16} aria-hidden>
        <Image
          src={HERO_SKY.day}
          alt=""
          fill
          sizes="100vw"
          priority
          className={`${styles.bg16Img} ${styles.bg16Day}`}
        />
        <Image
          src={HERO_SKY.night}
          alt=""
          fill
          sizes="100vw"
          className={`${styles.bg16Img} ${styles.bg16Night}`}
        />
      </div>

      {/* z 1 — legibility veil */}
      <div className={styles.scrim16} aria-hidden />

      {/* z 2 — the headline the tower will cut across */}
      <div className={styles.stack17}>
        <div className={`${styles.content} ${styles.content17}`}>
          <span className={`${styles.eyebrow} ${styles.animUp} ${styles.d1}`}>
            Elevator components, made in India
          </span>
          <h1
            className={`${styles.title} ${styles.title17} ${styles.animUp} ${styles.d2}`}
          >
            The machine behind <em>every smooth ride.</em>
          </h1>
        </div>

        {/* Everything below the headline FLANKS the tower rather than sitting
            behind it — the shaft is opaque, so centred copy here would simply
            be hidden. The middle grid column is the clear channel it rises
            through. */}
        <div className={styles.flank17}>
          <p className={`${styles.lead} ${styles.animUp} ${styles.d3}`}>
            Since 1992, Philbrick has engineered control panels, cabins, doors,
            displays and safety systems for elevator builders across India and
            beyond.
          </p>
          <TrustBadges
            className={`${styles.trust17} ${styles.animUp} ${styles.d4}`}
            only={TRUST_ONLY}
          />
        </div>
      </div>

      {/* z 3 — tower, drawn over the headline. Click-through so it never
          intercepts a link underneath it. */}
      <div className={styles.fg17} aria-hidden>
        <Image
          src={HERO_TOWER.day}
          alt=""
          fill
          sizes="100vw"
          priority
          className={`${styles.fg17Img} ${styles.bg16Day}`}
        />
        <Image
          src={HERO_TOWER.night}
          alt=""
          fill
          sizes="100vw"
          className={`${styles.fg17Img} ${styles.bg16Night}`}
        />
      </div>
    </section>
  );
}
