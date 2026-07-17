import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { TrustBadges } from "./TrustBadges";
import { CTA, PRODUCT_TILES } from "./corporateData";
import styles from "./corporate.module.css";

/* VARIANT 10 — Product Range Showcase (rebuilt on real product photography).
   Left: editorial headline + CTAs + trust. Right: a clean 2x2 grid of the
   site's real product category photos with labels (each links to its product
   page). A premium B2B catalogue hero, on-brand with the rest of the site. */
export function Variant10Hero() {
  return (
    <section className={styles.hero} aria-label="The Philbrick elevator component range">
      <div className={styles.content}>
        <span className={`${styles.eyebrow} ${styles.animUp} ${styles.d1}`}>
          One supplier, the whole system
        </span>
        <h1 className={`${styles.title} ${styles.animUp} ${styles.d2}`}>
          Every elevator component, <em>engineered in-house.</em>
        </h1>
        <p className={`${styles.lead} ${styles.animUp} ${styles.d3}`}>
          Control panels, cabins, doors, displays and safety systems, all
          designed and built by Philbrick and proven in buildings across India
          and beyond.
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

      <div className={`${styles.tileGrid} ${styles.animInRight}`}>
        {PRODUCT_TILES.map((t) => (
          <Link key={t.title} href={t.href} className={styles.tile}>
            <Image
              src={t.img}
              alt={t.title}
              fill
              sizes="(max-width: 900px) 44vw, 22vw"
              priority
              className={styles.tileImg}
            />
            <span className={styles.tileScrim} aria-hidden />
            <span className={styles.tileLabel}>
              <span className={styles.tileTitle}>{t.title}</span>
              <span className={styles.tileSub}>{t.sub}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
