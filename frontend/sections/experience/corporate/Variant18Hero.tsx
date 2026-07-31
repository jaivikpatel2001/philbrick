"use client";
/* =============================================================================
   VARIANT 18 — single-scene hero.

   Sky, buildings AND the headline are baked into the photograph, so the hero is
   just a background plus the copy that sits in front of it:

     z 2   lead paragraph + trust badges, over the photograph
     z 1   scrim (dark theme only)
     z 0   the scene

   ART-DIRECTED, TWO PLATES PER THEME (2026-07-25). Each theme has a LANDSCAPE
   plate (1672x941) for wide screens and a PORTRAIT plate (~864x1821) for narrow
   ones, chosen by a <picture> `<source media="(orientation: portrait)">`. This
   is why the hero uses a plain <picture> and not next/image: next/image has a
   single src and can't art-direct by orientation. The portrait plate replaces
   the old letterbox-on-mobile hack (a landscape-only plate shown with
   `object-fit: contain` below 1.41:1 so its baked headline wasn't cropped).

   THE HEADING IS STILL IN THE DOM, visually hidden. A page with no <h1> loses
   its heading outline for screen readers and gives search engines nothing to
   read, and the words are now pixels inside a photograph. `sr-only` keeps the
   semantics at zero visual cost. If the headline in the picture changes, change
   it here too — see §11.10 of imagegeneration.md, which holds the prompts.
   ========================================================================== */
import { TrustBadges } from "./TrustBadges";
import styles from "./corporate.module.css";

const ENV = "/images/home/hero-exploration/environment";

/** Build a WebP `srcset` for one plate base name + its generated widths. */
const srcset = (base: string, widths: readonly number[]) =>
  widths.map((w) => `${ENV}/${base}-${w}.webp ${w}w`).join(", ");

/** Generated ladders (scripts/optimizeHeroScene.mjs). */
const LANDSCAPE_W = [640, 960, 1280, 1536, 1672] as const;
const PORTRAIT_W = [384, 640, 820] as const;

const TRUST_ONLY = ["Since 1992", "In-house"] as const;

export function Variant18Hero() {
  /* The floating glass navbar is now the site-wide default (data-nav="float" on
     <html> in app/layout.tsx), so this hero no longer opts in per-page. */
  return (
    <section
      className={styles.hero18}
      aria-label="philbrick elevator components, engineered in India since 1992"
    >
      {/* z 0 — the scene, cross-faded between day and night by [data-theme] in
          CSS with no JS. Each <picture> serves the landscape plate by default
          and the portrait plate under `(orientation: portrait)`; only the
          matching <source> is ever downloaded, so a phone fetches the portrait
          crop and a desktop the landscape one — never both.

          The DAY image carries `fetchpriority="high"` (it is the LCP element
          for the brand-default light theme); the night image loads lazily. */}
      <div className={styles.bg16} aria-hidden>
        <picture>
          <source
            media="(orientation: portrait)"
            type="image/webp"
            srcSet={srcset("hero-scene-day-portrait", PORTRAIT_W)}
            sizes="100vw"
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- <picture> art-direction, not a next/image use */}
          <img
            className={`${styles.bg16Img} ${styles.bg16Day}`}
            alt=""
            src={`${ENV}/hero-scene-day-landscape-1280.webp`}
            srcSet={srcset("hero-scene-day-landscape", LANDSCAPE_W)}
            sizes="100vw"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <picture>
          <source
            media="(orientation: portrait)"
            type="image/webp"
            srcSet={srcset("hero-scene-night-portrait", PORTRAIT_W)}
            sizes="100vw"
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- <picture> art-direction, not a next/image use */}
          <img
            className={`${styles.bg16Img} ${styles.bg16Night}`}
            alt=""
            src={`${ENV}/hero-scene-night-landscape-1280.webp`}
            srcSet={srcset("hero-scene-night-landscape", LANDSCAPE_W)}
            sizes="100vw"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>

      {/* The bottom scrim band was removed 2026-07-25 (client request) so the
          hero photo runs clean into the next section. The lead + badges keep
          their legibility via white copy + a soft text-shadow (see CSS) — the
          lower third of both plates is dark enough for that to clear AA. */}

      {/* The words that are painted into the photograph, kept as real markup for
          screen readers and search engines. Not shown. */}
      <div className="sr-only">
        <p>Elevator components, made in India</p>
        <h1>Your One Stop Elevator Solutions Partner.</h1>
      </div>

      {/* z 2 — the copy that stays live, in front of the scene */}
      <div className={styles.stack18}>
        <div className={`${styles.flank17} ${styles.flank18}`}>
          <p className={`${styles.lead} ${styles.animUp} ${styles.d3}`}>
            Since 1992, philbrick has engineered control panels, cabins, doors,
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
