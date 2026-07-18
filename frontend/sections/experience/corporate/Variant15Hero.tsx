"use client";
/* =============================================================================
   VARIANT 15 — product-first industrial hero (inspired by the QUALITIES of
   premium machinery sites like xtlaser.com — product-focused composition,
   smooth motion, confident type — designed original for Philbrick).

   Left: bold headline, lead, CTAs, verified trust badges. Right: an
   auto-rotating PRODUCT SPOTLIGHT — the real category photography crossfading
   on a framed showcase panel with a floating motion, each slide naming and
   linking its category; slide dots allow manual selection. Below the hero the
   page adds the "Browse by product category" section (CategoryBrowse15).
   All motion is transform/opacity; the rotation pauses under reduced motion
   and while the user hovers the panel.
   ========================================================================== */
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { TrustBadges } from "./TrustBadges";
import { CTA } from "./corporateData";
import { CATALOG_PARTS } from "@/data/catalogParts";
import { categoryHref } from "@/data/products";
import styles from "./corporate.module.css";

/* the spotlight rotates through ALL catalogue part cutouts (components/parts/),
   in catalogue order, each linking to its closest real product category */
const CATEGORY_FOR_PART: Record<string, string> = {
  "control-panel-ard": "elevator-control-panel",
  "overload-announcing-device": "elevator-kit-accessories",
  "blower-fan": "elevator-kit-accessories",
  cabin: "elevator-cabin",
  "cop-lop-display": "cop-lop",
  "floor-announcing-system": "voice-announcing-systems",
  "safety-light-curtain": "synergy-auto-door",
  "elevator-door": "elevator-doors",
  "lift-display": "elevator-display",
};
const SLIDES = CATALOG_PARTS.map((p) => ({
  slug: p.key,
  name: p.component.name,
  tagline: p.component.tagline,
  image: p.image,
  href: categoryHref(CATEGORY_FOR_PART[p.key] ?? "elevator-kit-accessories"),
}));

const ROTATE_MS = 3800;

export function Variant15Hero() {
  const [slide, setSlide] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!paused.current) setSlide((s) => (s + 1) % SLIDES.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      className={styles.hero}
      aria-label="Philbrick elevator components, browse the product range"
    >
      <div className={styles.content}>
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
        <div
          className={`${styles.spotlight15} ${styles.animInRight}`}
          onPointerEnter={() => (paused.current = true)}
          onPointerLeave={() => (paused.current = false)}
        >
          {SLIDES.map((s, i) => (
            <Link
              key={s.slug}
              href={s.href}
              className={`${styles.slide15} ${i === slide ? styles.slide15Active : ""}`}
              aria-hidden={i !== slide}
              tabIndex={i === slide ? 0 : -1}
            >
              <Image
                src={s.image}
                alt={s.name}
                fill
                sizes="(max-width: 900px) 90vw, 44vw"
                priority={i === 0}
                className={styles.slide15Part}
              />
              <span className={styles.slide15Label}>
                <span className={styles.slide15Name}>{s.name}</span>
                <span className={styles.slide15Tag}>
                  {s.tagline}
                  <FiArrowRight aria-hidden />
                </span>
              </span>
            </Link>
          ))}
          <div className={styles.dots15} role="tablist" aria-label="Spotlight products">
            {SLIDES.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                role="tab"
                aria-selected={i === slide}
                aria-label={s.name}
                className={`${styles.dot15} ${i === slide ? styles.dot15Active : ""}`}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
