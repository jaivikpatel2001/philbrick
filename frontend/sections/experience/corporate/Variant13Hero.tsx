"use client";
/* =============================================================================
   VARIANT 13 — corporate scroll component reveal.

   The clean corporate stage (variant7 family) becomes an interactive product
   breakdown: the technical drawing of the whole installation stands on the
   right, and as the user scrolls, each catalogue component takes the stage on
   the left — its image animates in, the heading/description update, and an
   azure marker highlights WHERE that part lives on the drawing — until every
   part has been introduced.

   Driver: tall section + sticky stage (house rule, no GSAP pin) with one
   ScrollTrigger; the active step is React state (changes ~10x per page), the
   marker moves via CSS vars with a transition — no per-frame React work.
   Reduced motion: no pin/scrub, the steps render as a static stacked list.
   ========================================================================== */
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/Button";
import { CATALOG_PARTS, CATALOG_SPINE } from "@/data/catalogParts";
import { CTA } from "./corporateData";
import styles from "./corporate.module.css";

/* stage-space anchors (ExplorationHero coordinates) → % of the drawing box
   (the drawing spans stage x 42..58, y 6..90 — see catalogParts.ts) */
const toDrawing = (a: { x: number; y: number }) => ({
  x: Math.min(96, Math.max(4, ((a.x - 42) / 16) * 100)),
  y: Math.min(97, Math.max(3, ((a.y - 6) / 84) * 100)),
});

const STEP_VH = 85;
const SCROLL_VH = Math.round((CATALOG_PARTS.length + 1.6) * STEP_VH);

export function Variant13Hero() {
  const root = useRef<HTMLElement>(null);
  const drawRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1); // -1 = intro
  const [staticMode, setStaticMode] = useState(false);
  const activeRef = useRef(-1);

  useEffect(() => {
    setStaticMode(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || staticMode) return;
      gsap.registerPlugin(ScrollTrigger);
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.1,
        onUpdate: (self) => {
          el.style.setProperty("--p", String(self.progress));
          /* first ~1 step of scroll holds the intro, then one step per part */
          const u = self.progress * (CATALOG_PARTS.length + 1.6) - 1.1;
          const idx =
            u < 0 ? -1 : Math.min(CATALOG_PARTS.length - 1, Math.floor(u));
          if (idx !== activeRef.current) {
            activeRef.current = idx;
            setActive(idx);
          }
        },
      });
      return () => st.kill();
    },
    { scope: root, dependencies: [staticMode] }
  );

  /* marker position follows the active part's anchor (CSS transition eases it) */
  useEffect(() => {
    const d = drawRef.current;
    if (!d) return;
    const part = CATALOG_PARTS[Math.max(0, active)];
    const pos = toDrawing(part.anchor);
    d.style.setProperty("--hx", `${pos.x}%`);
    d.style.setProperty("--hy", `${pos.y}%`);
  }, [active]);

  const n = CATALOG_PARTS.length;

  return (
    <section
      ref={root}
      className={`${styles.hero13} ${staticMode ? styles.hero13Static : ""}`}
      style={{ height: staticMode ? "auto" : `${SCROLL_VH}vh` }}
      aria-label="Every catalogue component of the elevator installation, revealed one at a time as you scroll"
    >
      <div className={styles.stage13}>
        {/* left: the revolving content panel */}
        <div className={styles.panel13}>
          {/* intro (before the first part) */}
          <div
            className={`${styles.step13} ${active === -1 ? styles.step13Active : ""}`}
          >
            <span className={styles.eyebrow}>The complete installation</span>
            <h1 className={styles.title}>
              Every part of the ride, <em>one drawing.</em>
            </h1>
            <p className={styles.lead}>
              Scroll to walk the installation: each catalogue component steps
              forward and lights up exactly where it works, from the machine
              room to the pit.
            </p>
            <div className={styles.ctaRow}>
              <Button href={CTA.primary.href} size="lg" withArrow>
                {CTA.primary.label}
              </Button>
              <Button href={CTA.secondary.href} size="lg" variant="secondary">
                {CTA.secondary.label}
              </Button>
            </div>
          </div>

          {/* one step per catalogue part */}
          {CATALOG_PARTS.map((p, i) => (
            <div
              key={p.key}
              className={`${styles.step13} ${active === i ? styles.step13Active : ""}`}
            >
              <span className={styles.eyebrow}>
                Component {p.component.index} of {String(n).padStart(2, "0")}
              </span>
              <h2 className={styles.title13}>{p.component.name}</h2>
              <p className={styles.lead}>{p.component.description}</p>
              <figure
                className={styles.stepMedia13}
                style={{ aspectRatio: String(p.aspect ?? 1) }}
              >
                <Image
                  src={p.image}
                  alt={p.component.name}
                  fill
                  sizes="(max-width: 900px) 70vw, 30vw"
                  priority={i === 0}
                />
              </figure>
            </div>
          ))}

          {/* step dots */}
          <ol className={styles.dots13} aria-hidden>
            {CATALOG_PARTS.map((p, i) => (
              <li
                key={p.key}
                className={i === active ? styles.dot13Active : i < active ? styles.dot13Done : ""}
              />
            ))}
          </ol>
        </div>

        {/* right: the drawing with the live highlight marker */}
        <div className={styles.drawWrap13}>
          <div
            ref={drawRef}
            className={styles.draw13}
            style={{ aspectRatio: String(CATALOG_SPINE.type === "image" ? CATALOG_SPINE.aspect : 0.36) }}
          >
            {CATALOG_SPINE.type === "image" && (
              <Image
                src={CATALOG_SPINE.src}
                alt="Technical drawing of the complete elevator installation"
                fill
                sizes="(max-width: 900px) 60vw, 30vw"
                priority
              />
            )}
            <span
              className={`${styles.marker13} ${active >= 0 ? styles.marker13On : ""}`}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}
