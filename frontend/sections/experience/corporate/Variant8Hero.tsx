import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { TrustBadges } from "./TrustBadges";
import { CTA, HERO_IMG, SPEC_CARDS } from "./corporateData";
import styles from "./corporate.module.css";

/* VARIANT 8 — Building Showcase (full-bleed background layout).
   Distinct from the split: the tower dominates the hero as a large background
   that bleeds off the right edge and slowly zooms; the content sits over a
   left-to-right gradient scrim, and specification cards float across the
   building. Real estate / premium infrastructure feel. Pure CSS motion. */
/* the tower stands in the right ~46% panel; cards flank it left/right */
const CARD_POS = [
  { top: "17%", right: "37%" },
  { top: "31%", right: "5%" },
  { top: "60%", right: "39%" },
  { top: "79%", right: "6%" },
];

export function Variant8Hero() {
  return (
    <section className={styles.heroBleed} aria-label="Philbrick elevators for premium commercial buildings">
      <div className={styles.bleedMedia} aria-hidden={false}>
        <Image
          src={HERO_IMG.tower}
          alt="A premium glass and concrete commercial tower served by Philbrick elevators"
          fill
          sizes="(max-width: 900px) 100vw, 60vw"
          priority
        />
      </div>
      <div className={styles.bleedScrim} aria-hidden />

      {SPEC_CARDS.map((c, i) => (
        <div
          key={c.label}
          className={styles.specCard}
          style={{ ...CARD_POS[i], zIndex: 2, animationDelay: `${1.1 + i * 0.35}s` }}
        >
          <span className={styles.specValue}>{c.value}</span>
          <span className={styles.specLabel}>{c.label}</span>
        </div>
      ))}

      <div className={styles.bleedContent}>
        <span className={`${styles.eyebrow} ${styles.animUp} ${styles.d1}`}>
          For landmark buildings
        </span>
        <h1 className={`${styles.title} ${styles.animUp} ${styles.d2}`}>
          Vertical transport that <em>defines the address.</em>
        </h1>
        <p className={`${styles.lead} ${styles.animUp} ${styles.d3}`}>
          From commercial towers to premium residences, Philbrick engineers the
          machines, controllers and cabins that move people quietly, safely and
          on time, floor after floor.
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
