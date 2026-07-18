"use client";
/* =============================================================================
   VARIANT 14 — variant10's corporate split with a MODERN ANIMATED GALLERY.

   Left: the same editorial content family as variant10. Right: instead of four
   static tiles, the 8 photoreal component renders float as a layered product
   constellation on a light stage — staggered entrance, gentle per-item float
   and rotation at varied tempos, a slow orbiting accent ring, and layered
   pointer parallax by depth. Transform/opacity only (60fps); everything is
   disabled under prefers-reduced-motion.
   ========================================================================== */
import { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { TrustBadges } from "./TrustBadges";
import { CTA } from "./corporateData";
import { CATALOG_PARTS } from "@/data/catalogParts";
import styles from "./corporate.module.css";

/* cluster layout for the 9 catalogue part cutouts (components/parts/):
   position (% of stage), height (vh cap), parallax depth and float tempo per
   item — hand-tuned so nothing overlaps at any breakpoint */
const LAYOUT: Record<
  string,
  { x: number; y: number; h: number; depth: number; dur: number; rot: number }
> = {
  "control-panel-ard": { x: 24, y: 17, h: 18, depth: 1.0, dur: 6.2, rot: -1.4 },
  "overload-announcing-device": { x: 68, y: 13, h: 13, depth: 0.7, dur: 7.4, rot: 1.2 },
  "cop-lop-display": { x: 89, y: 47, h: 30, depth: 0.9, dur: 6.8, rot: 0 },
  "blower-fan": { x: 13, y: 44, h: 12, depth: 0.6, dur: 7.8, rot: 1.8 },
  cabin: { x: 43, y: 44, h: 22, depth: 1.15, dur: 6.0, rot: 0 },
  "floor-announcing-system": { x: 68, y: 40, h: 12, depth: 0.8, dur: 8.2, rot: -1.2 },
  "elevator-door": { x: 22, y: 76, h: 17, depth: 0.7, dur: 7.0, rot: 0 },
  "safety-light-curtain": { x: 45, y: 88, h: 10, depth: 0.5, dur: 8.4, rot: 1.1 },
  "lift-display": { x: 70, y: 80, h: 12, depth: 0.55, dur: 8.8, rot: 1.4 },
};

export function Variant14Hero() {
  const stage = useRef<HTMLDivElement>(null);

  /* layered pointer parallax: one rAF, items translate by their depth */
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let gx = 0;
    let gy = 0;
    const onMove = (e: PointerEvent) => {
      gx = (e.clientX / window.innerWidth - 0.5) * 2;
      gy = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const apply = () => {
      raf = 0;
      el.style.setProperty("--gx", gx.toFixed(3));
      el.style.setProperty("--gy", gy.toFixed(3));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      className={styles.hero}
      aria-label="The Philbrick component range as a floating product gallery"
    >
      <div className={styles.content}>
        <span className={`${styles.eyebrow} ${styles.animUp} ${styles.d1}`}>
          One supplier, the whole system
        </span>
        <h1 className={`${styles.title} ${styles.animUp} ${styles.d2}`}>
          Every component, <em>in constant motion.</em>
        </h1>
        <p className={`${styles.lead} ${styles.animUp} ${styles.d3}`}>
          Machine, controller, cabin, doors, safety and signalling: the parts
          that move a building, all designed and built by Philbrick in
          Ahmedabad.
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
        <div ref={stage} className={`${styles.galleryStage} ${styles.animInRight}`}>
          <span className={styles.orbitRing} aria-hidden />
          <span className={`${styles.orbitRing} ${styles.orbitRing2}`} aria-hidden />
          {CATALOG_PARTS.map((p, i) => {
            const l = LAYOUT[p.key];
            if (!l) return null;
            return (
              <figure
                key={p.key}
                className={styles.galleryItem}
                style={
                  {
                    left: `${l.x}%`,
                    top: `${l.y}%`,
                    "--gi-h": `${l.h}vh`,
                    "--gi-depth": l.depth,
                    "--gi-dur": `${l.dur}s`,
                    "--gi-rot": `${l.rot}deg`,
                    "--gi-delay": `${0.15 + i * 0.12}s`,
                    aspectRatio: String(p.aspect ?? 1),
                  } as React.CSSProperties
                }
              >
                <Image
                  src={p.image}
                  alt={p.component.name}
                  fill
                  sizes="(max-width: 900px) 40vw, 18vw"
                  priority={i < 3}
                />
                <figcaption className={styles.galleryLabel}>
                  {p.component.name}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
