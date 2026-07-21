"use client";
/* =============================================================================
   VARIANT 16 — full-bleed CITY HERO with a theme-swapped background.

   Layout (client direction): no right-hand product panel — the hero is one
   CENTRED content block over a full-bleed skyline photograph, with the global
   navbar restyled as a floating glass pill for this page only.

   Two photographs are layered behind the hero and cross-faded purely in CSS by
   the `[data-theme]` attribute the ThemeProvider sets on <html> before paint:
     light theme → HERO_BG.day    (bright daylight skyline)
     dark theme  → HERO_BG.night  (night skyline)
   No JS for the swap, no flash on load.

   The floating navbar is opt-in per page: this component sets
   `data-nav="float"` on <html> while mounted, and globals.css restyles the
   sticky header into a rounded translucent bar. Removing the attribute on
   unmount leaves every other page's navbar untouched.
   ========================================================================== */
import { useEffect } from "react";
import Image from "next/image";
import { TrustBadges } from "./TrustBadges";
import styles from "./corporate.module.css";

const ENV = "/images/home/hero-exploration/environment";
export const HERO_BG = {
  day: `${ENV}/hero-city-day.png`,
  night: `${ENV}/hero-city-night.png`,
} as const;

/* Client direction: only these two trust badges here ("ISO Process" and
   "Exporter" were dropped). The other corporate variants still show all four. */
const TRUST_ONLY = ["Since 1992", "In-house"] as const;

export function Variant16Hero() {
  /* opt this page into the floating glass navbar */
  useEffect(() => {
    const de = document.documentElement;
    de.setAttribute("data-nav", "float");
    return () => de.removeAttribute("data-nav");
  }, []);

  return (
    <section
      className={styles.hero16}
      aria-label="Philbrick elevator components, engineered in India since 1992"
    >
      {/* theme-swapped city background */}
      <div className={styles.bg16} aria-hidden>
        <Image
          src={HERO_BG.day}
          alt=""
          fill
          sizes="100vw"
          priority
          className={`${styles.bg16Img} ${styles.bg16Day}`}
        />
        <Image
          src={HERO_BG.night}
          alt=""
          fill
          sizes="100vw"
          className={`${styles.bg16Img} ${styles.bg16Night}`}
        />
      </div>
      <div className={styles.scrim16} aria-hidden />

      <div className={`${styles.content} ${styles.content16}`}>
        <span className={`${styles.eyebrow} ${styles.animUp} ${styles.d1}`}>
          Elevator components, made in India
        </span>
        <h1 className={`${styles.title} ${styles.animUp} ${styles.d2}`}>
          The machine behind <em>every smooth ride.</em>
        </h1>
        <p className={`${styles.lead} ${styles.animUp} ${styles.d3}`}>
          Since 1992, Philbrick has engineered control panels, cabins, doors,
          displays and safety systems for elevator builders across India and
          beyond. Explore the range or tell us about your project.
        </p>
        <TrustBadges
          className={`${styles.animUp} ${styles.d4}`}
          only={TRUST_ONLY}
        />
      </div>
    </section>
  );
}
