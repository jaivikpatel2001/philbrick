import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { TrustBadges } from "./TrustBadges";
import { CTA, HERO_IMG } from "./corporateData";
import styles from "./corporate.module.css";

/* VARIANT 9 — Premium Interior (rebuilt on real site photography).
   The luxury elevator cabin render (the same premium photography used across
   the site) fills the hero as a full-bleed cinematic image with a slow zoom; a
   gradient scrim anchors the editorial content to the lower-left in white.
   No overlays, no WebGL — clean, premium, on-brand. */
export function Variant9Hero() {
  return (
    <section className={`${styles.heroFull} ${styles.onImage}`} aria-label="Philbrick premium elevator interiors">
      <div className={styles.fullMedia}>
        <Image
          src={HERO_IMG.cabin}
          alt="A premium Philbrick elevator cabin with brushed stainless steel, warm cove lighting and stone floor"
          fill
          sizes="100vw"
          priority
          className="lobbyFill"
        />
      </div>
      <div className={styles.fullScrim} aria-hidden />

      <div className={styles.fullContent}>
        <span className={`${styles.eyebrow} ${styles.animUp} ${styles.d1}`}>
          Premium interiors
        </span>
        <h1 className={`${styles.title} ${styles.animUp} ${styles.d2}`}>
          A first impression that <em>rises with you.</em>
        </h1>
        <p className={`${styles.lead} ${styles.animUp} ${styles.d3}`}>
          Brushed stainless steel, warm cove lighting and a whisper-quiet ride.
          Philbrick cabins, doors and fixtures bring hotel-grade craftsmanship to
          every landing.
        </p>
        <div className={`${styles.ctaRow} ${styles.animUp} ${styles.d4}`}>
          <Button href={CTA.primary.href} size="lg" withArrow>
            {CTA.primary.label}
          </Button>
          <Button href={CTA.secondary.href} size="lg" variant="secondary">
            {CTA.secondary.label}
          </Button>
        </div>
        <TrustBadges className={`${styles.animUp} ${styles.d5}`} />
      </div>
    </section>
  );
}
