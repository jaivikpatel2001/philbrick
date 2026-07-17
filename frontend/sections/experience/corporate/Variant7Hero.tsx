import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { TrustBadges } from "./TrustBadges";
import { CTA, HERO_IMG } from "./corporateData";
import styles from "./corporate.module.css";

/* VARIANT 7 — Classic Split Layout (recommended).
   Left: headline, supporting copy, CTAs, trust badges. Right: the elevator
   machine on a soft light stage. Content fades up on load; the product slides
   in from the right and gently floats. Pure CSS motion (no JS), theme-aware. */
export function Variant7Hero() {
  return (
    <section className={styles.hero} aria-label="Philbrick elevator systems, engineered in India since 1992">
      <div className={styles.content}>
        <span className={`${styles.eyebrow} ${styles.animUp} ${styles.d1}`}>
          Philbrick Elevator Systems
        </span>
        <h1 className={`${styles.title} ${styles.animUp} ${styles.d2}`}>
          Elevators engineered for a <em>lifetime of trust.</em>
        </h1>
        <p className={`${styles.lead} ${styles.animUp} ${styles.d3}`}>
          For over three decades, Philbrick has manufactured premium elevator
          control systems, cabins and components in Ahmedabad, delivering safe,
          reliable vertical transport for buildings across India and beyond.
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

      <div className={styles.media}>
        <div className={`${styles.productWrap} ${styles.animInRight}`}>
          <div className={styles.productStage} aria-hidden />
          <Image
            src={HERO_IMG.product}
            alt="Philbrick gearless elevator machine and cabin system"
            fill
            sizes="(max-width: 900px) 80vw, 40vw"
            priority
            className={`${styles.productImg} ${styles.onStage} ${styles.float}`}
          />
        </div>
      </div>
    </section>
  );
}
