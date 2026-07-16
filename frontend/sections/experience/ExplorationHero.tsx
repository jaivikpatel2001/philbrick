"use client";
/* =============================================================================
   EXPLORATION HERO — scroll-driven exploded component tour.

   Concept: the assembled Philbrick elevator stands centred as a technical
   blueprint spine. As the user scrolls, the machine takes itself apart: each
   major component flies out from its position on the spine to a resting slot,
   a leader line draws, and its label lands, until the final frame holds the
   complete exploded overview (the product catalogue composition) with CTAs.

   Architecture (see DONE.md 2026-07-16 + imagegeneration.md §10):
   - Tall section (SCROLL_VH) + CSS sticky 100svh stage (house rule: no GSAP
     pin — same pattern as ElevatorScene/ScrollStory).
   - ONE master GSAP timeline scrubbed by ScrollTrigger (scrub 1.1, the house
     standard). Lenis already drives ScrollTrigger via the gsap ticker in
     SmoothScroll.tsx — no extra wiring here.
   - Transform/opacity only (compositor-friendly); leader lines animate
     strokeDashoffset with pathLength=1.
   - Desktop: bilateral catalogue layout. Mobile (≤820px): parts take turns in
     one focal slot with a caption, spine sits higher.
   - prefers-reduced-motion: no pin, no scrub — the static exploded overview.
   - Everything data-driven from data/heroExploration.ts; the client's final
     transparent cutout assets drop in via that config alone.
   ========================================================================== */
import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import {
  EXPLORATION_PARTS,
  INTRO_UNITS,
  TOTAL_UNITS,
  SCROLL_VH,
  MOBILE_SLOT,
  MOBILE_ANCHOR,
  SPINE,
} from "@/data/heroExploration";
import styles from "./ExplorationHero.module.css";

/* Blueprint spine: a hairline technical drawing of the assembled system —
   shaft, machine room (motor + sheave), ropes, car, counterweight, guide
   rails, pit buffers and ladder. Replaced by the client's cutaway render via
   data/heroExploration.ts when final assets land. */
function SpineArt() {
  return (
    <svg
      className={styles.spineArt}
      viewBox="0 0 300 640"
      fill="none"
      aria-hidden
      focusable="false"
    >
      {/* shaft */}
      <rect x="60" y="22" width="180" height="558" className={styles.spineLine} />
      {/* machine room */}
      <rect x="82" y="30" width="136" height="72" className={styles.spineLine} />
      <rect x="98" y="48" width="54" height="34" className={styles.spineLine} />
      <circle cx="182" cy="66" r="17" className={styles.spineAccent} />
      <circle cx="182" cy="66" r="6" className={styles.spineLine} />
      <line x1="152" y1="66" x2="165" y2="66" className={styles.spineLine} />
      {/* ropes */}
      <line x1="146" y1="102" x2="146" y2="238" className={styles.spineFaint} />
      <line x1="154" y1="102" x2="154" y2="238" className={styles.spineFaint} />
      {/* guide rails */}
      <line x1="88" y1="102" x2="88" y2="574" className={styles.spineFaint} />
      <line x1="212" y1="102" x2="212" y2="574" className={styles.spineFaint} />
      {/* car */}
      <rect x="94" y="238" width="112" height="148" className={styles.spineLine} />
      <line x1="150" y1="238" x2="150" y2="386" className={styles.spineAccent} />
      <line x1="94" y1="252" x2="206" y2="252" className={styles.spineLine} />
      <circle cx="196" cy="308" r="3" className={styles.spineAccent} />
      {/* counterweight */}
      <rect x="219" y="176" width="14" height="58" className={styles.spineLine} />
      <line x1="226" y1="102" x2="226" y2="560" className={styles.spineFaint} />
      {/* pit */}
      <line x1="60" y1="580" x2="240" y2="580" className={styles.spineLine} />
      <rect x="116" y="544" width="18" height="36" className={styles.spineLine} />
      <rect x="166" y="544" width="18" height="36" className={styles.spineLine} />
      <line x1="116" y1="556" x2="134" y2="556" className={styles.spineFaint} />
      <line x1="166" y1="556" x2="184" y2="556" className={styles.spineFaint} />
      <line x1="116" y1="568" x2="134" y2="568" className={styles.spineFaint} />
      <line x1="166" y1="568" x2="184" y2="568" className={styles.spineFaint} />
      {/* ladder */}
      <line x1="68" y1="400" x2="68" y2="578" className={styles.spineFaint} />
      <line x1="80" y1="400" x2="80" y2="578" className={styles.spineFaint} />
      {[420, 450, 480, 510, 540, 566].map((y) => (
        <line key={y} x1="68" y1={y} x2="80" y2={y} className={styles.spineFaint} />
      ))}
    </svg>
  );
}

export function ExplorationHero() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(-1);
  const activeRef = useRef(-1);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      gsap.registerPlugin(ScrollTrigger);

      /* Reduced motion: no pin, no scrub — show the finished exploded
         overview as a calm, complete, static hero. */
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.classList.add(styles.isStatic);
        setActive(EXPLORATION_PARTS.length - 1);
        return;
      }

      const q = gsap.utils.selector(el);
      const mm = gsap.matchMedia();

      mm.add(
        { desk: "(min-width: 821px)", mob: "(max-width: 820px)" },
        (ctx) => {
          const desk = !!(ctx.conditions as { desk: boolean }).desk;
          const cards = q<HTMLElement>(`.${styles.part}`);
          const labels = q<HTMLElement>(`.${styles.label}`);
          const lines = q<SVGLineElement>(`.${styles.line}`);
          const intro = q<HTMLElement>(`.${styles.intro}`);
          const outro = q<HTMLElement>(`.${styles.outro}`);
          const spine = q<HTMLElement>(`.${styles.spineWrap}`);
          const glow = q<HTMLElement>(`.${styles.bgGlow}`);

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                // progress bar via CSS var (no React re-render per frame)
                el.style.setProperty("--p", String(self.progress));
                const u = self.progress * TOTAL_UNITS - INTRO_UNITS;
                const idx = Math.min(
                  EXPLORATION_PARTS.length - 1,
                  Math.floor(u + 0.62)
                );
                if (idx !== activeRef.current) {
                  activeRef.current = idx;
                  setActive(idx);
                }
              },
            },
          });

          /* keep parts centred on their slot; gsap owns the transform */
          gsap.set(cards, { xPercent: -50, yPercent: -50 });

          /* the machine arrives: it rests small, then scales up into place as
             the user starts scrolling, and keeps slowly approaching afterwards
             for depth (sequential same-property tweens, scrub-safe) */
          const arrive = INTRO_UNITS + 0.45;
          tl.fromTo(
            spine,
            { scale: desk ? 0.45 : 0.6, y: "7vh", autoAlpha: 0.92, transformOrigin: "50% 62%" },
            { scale: 1, y: 0, autoAlpha: 1, duration: arrive, ease: "power2.out" },
            0
          );
          tl.to(
            spine,
            { scale: desk ? 1.05 : 1.03, y: "-2vh", duration: TOTAL_UNITS - arrive },
            arrive
          );
          tl.to(glow, { y: "-2vh" }, 0);

          /* intro copy leaves as the first part departs */
          tl.to(intro, { autoAlpha: 0, y: -36, duration: 0.5, ease: "power1.in" }, INTRO_UNITS * 0.62);

          EXPLORATION_PARTS.forEach((part, i) => {
            const at = INTRO_UNITS + i;
            const card = cards[i];
            const label = labels[i];
            const line = lines[i];
            const from = desk
              ? { dx: part.anchor.x - part.slot.x, dy: part.anchor.y - part.slot.y }
              : { dx: MOBILE_ANCHOR.x - MOBILE_SLOT.x, dy: MOBILE_ANCHOR.y - MOBILE_SLOT.y };

            tl.addLabel(`part-${i}`, at);

            /* the part flies out of the machine to its resting slot */
            tl.fromTo(
              card,
              {
                x: () => `${from.dx}vw`,
                y: () => `${from.dy}vh`,
                scale: 0.9,
                autoAlpha: 0,
              },
              { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.62, ease: "power2.out" },
              at
            );

            if (desk && line) {
              tl.fromTo(
                line,
                { strokeDashoffset: 1 },
                { strokeDashoffset: 0, duration: 0.3 },
                at + 0.28
              );
            }
            tl.fromTo(
              label,
              { autoAlpha: 0, y: 12 },
              { autoAlpha: 1, y: 0, duration: 0.26, ease: "power1.out" },
              at + 0.42
            );

            if (desk) {
              /* micro-drift: settled parts keep breathing outward */
              tl.to(card, { y: "-=10", duration: TOTAL_UNITS - at - 0.62 }, at + 0.62);
            } else {
              /* mobile: the previous part yields the focal slot */
              const prev = cards[i - 1];
              const prevLabel = labels[i - 1];
              if (prev) {
                tl.to(prev, { autoAlpha: 0, y: "-7vh", scale: 0.94, duration: 0.3, ease: "power1.in" }, at - 0.08);
                tl.to(prevLabel, { autoAlpha: 0, duration: 0.2 }, at - 0.08);
              }
            }
          });

          /* settle: hold the exploded overview, land the outro */
          const settleAt = INTRO_UNITS + EXPLORATION_PARTS.length;
          tl.addLabel("settle", settleAt);
          tl.fromTo(
            outro,
            { autoAlpha: 0, y: 26 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
            settleAt + 0.15
          );
          /* dead-zone so the final composition holds before unpinning */
          tl.to({}, { duration: 0.45 });
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  const n = EXPLORATION_PARTS.length;

  return (
    <section
      ref={root}
      className={styles.section}
      style={{ height: `${SCROLL_VH}vh` }}
      aria-label="The Philbrick elevator system taken apart component by component as you scroll"
    >
      <div className={styles.stage}>
        <div className={styles.bgGlow} aria-hidden />

        {/* central assembled machine: blueprint SVG until the client's
            photoreal cutaway render lands (data/heroExploration.ts SPINE) */}
        <div
          className={styles.spineWrap}
          aria-hidden
          style={
            SPINE.type === "image"
              ? ({ "--spine-aspect": String(SPINE.aspect) } as React.CSSProperties)
              : undefined
          }
        >
          {SPINE.type === "image" ? (
            <Image
              src={SPINE.src}
              alt=""
              fill
              sizes="(max-width: 820px) 60vw, 34vw"
              priority
              className={styles.spineImg}
            />
          ) : (
            <SpineArt />
          )}
        </div>

        {/* leader lines (desktop) — drawn from spine anchor toward each slot */}
        <svg className={styles.lines} aria-hidden focusable="false">
          {EXPLORATION_PARTS.map((p) => (
            <line
              key={p.key}
              className={styles.line}
              x1={`${p.anchor.x}%`}
              y1={`${p.anchor.y}%`}
              x2={`${p.slot.x + (p.side === "left" ? 8 : -8)}%`}
              y2={`${p.slot.y}%`}
              pathLength={1}
            />
          ))}
        </svg>

        {/* the components */}
        <ul className={styles.parts} role="list">
          {EXPLORATION_PARTS.map((p, i) => (
            <li
              key={p.key}
              className={`${styles.part} ${p.treatment === "cutout" ? styles.isCutout : ""} ${
                i === active ? styles.isActive : ""
              }`}
              style={
                {
                  "--sx": `${p.slot.x}%`,
                  "--sy": `${p.slot.y}%`,
                  "--mx": `${MOBILE_SLOT.x}%`,
                  "--my": `${MOBILE_SLOT.y}%`,
                } as React.CSSProperties
              }
            >
              <figure
                className={styles.media}
                style={
                  p.treatment === "cutout" && p.aspect
                    ? {
                        aspectRatio: String(p.aspect),
                        height: `min(${p.size?.hCapVh ?? 23}vh, ${Math.round(
                          (p.size?.wCap ?? 205) / p.aspect
                        )}px)`,
                      }
                    : undefined
                }
              >
                <Image
                  src={p.image}
                  alt={p.component.name}
                  fill
                  sizes="(max-width: 820px) 64vw, 220px"
                  priority={i === 0}
                />
              </figure>
              <div className={`${styles.label} ${p.side === "right" ? styles.labelRight : ""}`}>
                <span className={styles.labelIndex}>{p.component.index}</span>
                <span className={styles.labelBody}>
                  <span className={styles.labelName}>{p.component.name}</span>
                  <span className={styles.labelTag}>{p.component.tagline}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>

        {/* intro copy */}
        <div className={styles.intro}>
          <p className={styles.eyebrow}>The Philbrick system</p>
          <h1 className={styles.title}>
            One elevator. <em>Every component,</em> engineered in-house.
          </h1>
          <p className={styles.lead}>
            Scroll to take the machine apart: control, drive, doors, safety and
            signalling, revealed one by one.
          </p>
        </div>

        {/* outro: the exploded overview holds + CTAs */}
        <div className={styles.outro}>
          <p className={styles.outroLine}>
            Every part above is designed, built and supported by Philbrick.
          </p>
          <div className={styles.outroCtas}>
            <Button href="/products" withArrow>
              Explore all products
            </Button>
            <Button href="/contact" variant="ghost" withArrow>
              Request a quote
            </Button>
          </div>
        </div>

        {/* right rail (desktop): tour index */}
        <ol className={styles.rail} aria-hidden>
          {EXPLORATION_PARTS.map((p, i) => (
            <li
              key={p.key}
              className={`${i <= active ? styles.railDone : ""} ${
                i === active ? styles.railActive : ""
              }`}
            >
              <span className={styles.railDot} />
              <span className={styles.railName}>{p.component.name}</span>
            </li>
          ))}
        </ol>

        {/* mobile beat counter */}
        <p className={styles.counter} aria-hidden>
          {String(Math.max(1, active + 1)).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </p>

        {/* scroll cue + progress */}
        <p className={styles.cue} aria-hidden>
          Scroll to explore
        </p>
        <div className={styles.progress} aria-hidden />
      </div>
    </section>
  );
}
