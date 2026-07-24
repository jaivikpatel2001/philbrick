"use client";
/* =============================================================================
   VARIANT 18 — single-scene hero.

   Sky, buildings AND the headline are baked into one photograph per theme
   (hero-scene-{day,night}), so the hero is just a background plus the copy that
   sits in front of it:

     z 2   lead paragraph + trust badges, over the photograph
     z 1   scrim (dark theme only)
     z 0   the scene

   The three-layer build this replaces — open sky, live <h1>, transparent
   building plate stacked on top — is gone, along with the CSS that anchored the
   towers to the headline.

   THE HEADING IS STILL IN THE DOM, visually hidden. A page with no <h1> loses
   its heading outline for screen readers and gives search engines nothing to
   read, and the words are now pixels inside a photograph. `sr-only` keeps the
   semantics at zero visual cost. If the headline in the picture changes, change
   it here too — see §11.10 of imagegeneration.md, which holds the prompts.
   ========================================================================== */
import Image from "next/image";
import { TrustBadges } from "./TrustBadges";
import styles from "./corporate.module.css";

const ENV = "/images/home/hero-exploration/environment";

/** The whole hero, one photograph per theme. 2752x1536, headline included. */
export const HERO_SCENE = {
  day: `${ENV}/hero-scene-day.png`,
  night: `${ENV}/hero-scene-night.png`,
} as const;

const TRUST_ONLY = ["Since 1992", "In-house"] as const;

export function Variant18Hero() {
  /* The floating glass navbar is now the site-wide default (data-nav="float" on
     <html> in app/layout.tsx), so this hero no longer opts in per-page. */
  return (
    <section
      className={styles.hero18}
      aria-label="Philbrick elevator components, engineered in India since 1992"
    >
      {/* z 0 — the scene, cross-faded between day and night by [data-theme] in
          CSS, with no JS. */}
      <div className={styles.bg16} aria-hidden>
        <Image
          src={HERO_SCENE.day}
          alt=""
          fill
          sizes="100vw"
          priority
          quality={82}
          className={`${styles.bg16Img} ${styles.bg16Day}`}
        />
        <Image
          src={HERO_SCENE.night}
          alt=""
          fill
          sizes="100vw"
          priority
          quality={82}
          className={`${styles.bg16Img} ${styles.bg16Night}`}
        />
      </div>

      {/* z 1 — a bottom-up wash over the lowest 30% only, to seat the lead and
          the badges. Nothing above that: the headline is part of the picture,
          and the navbar clears AA against the scene unaided. */}
      <div className={styles.scrim18} aria-hidden />

      {/* The words that are painted into the photograph, kept as real markup for
          screen readers and search engines. Not shown. */}
      <div className="sr-only">
        <p>Elevator components, made in India</p>
        <h1>The machine behind every smooth ride.</h1>
      </div>

      {/* z 2 — the copy that stays live, in front of the scene */}
      <div className={styles.stack18}>
        <div className={`${styles.flank17} ${styles.flank18}`}>
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
    </section>
  );
}
