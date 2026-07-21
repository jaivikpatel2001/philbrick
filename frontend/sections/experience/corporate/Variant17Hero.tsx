"use client";
/* =============================================================================
   VARIANT 17 — variant16 with a DEPTH hero: the headline sits BEHIND the tower.

   The occlusion cannot come from one picture. If the words were baked into the
   artwork the <h1> would stop being text — no scaling on mobile, nothing for
   search engines to read, and blur on large screens. So the hero is a three
   layer sandwich and the heading stays real, selectable markup:

     z 3   foreground tower   transparent PNG, drawn OVER the text
     z 2   content            <h1>, eyebrow, lead, trust badges
     z 1   scrim              legibility veil
     z 0   sky                full-bleed background photograph

   Each layer has a day and a night plate, cross-faded purely in CSS by the
   `[data-theme]` attribute the ThemeProvider sets on <html> before paint, so
   the swap needs no JS and never flashes.

   Until the four photographs are supplied the page still builds and renders:
   lib/imageLoader.ts passes unknown paths through untouched, so the hero simply
   shows its gradient fallback rather than breaking.
   ========================================================================== */
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { TrustBadges } from "./TrustBadges";
import styles from "./corporate.module.css";

/** How far the tower may be dragged from centre, as a share of the viewport. */
const DRAG_LIMIT = 0.34;
/** Arrow-key step, in pixels. */
const KEY_STEP = 24;

const ENV = "/images/home/hero-exploration/environment";

/** Background plates. Shares variant16's city photographs (client direction)
    rather than the open-centre sky pair, so the two variants differ only in the
    foreground tower and the layered headline. */
export const HERO_SKY = {
  day: `${ENV}/hero-city-day.png`,
  night: `${ENV}/hero-city-night.png`,
} as const;

/** Foreground cutouts — transparent PNGs that overlap the headline. */
export const HERO_TOWER = {
  day: `${ENV}/hero-tower-day.png`,
  night: `${ENV}/hero-tower-night.png`,
} as const;

const TRUST_ONLY = ["Since 1992", "In-house"] as const;

export function Variant17Hero() {
  /* opt this page into the floating glass navbar (same as variant16) */
  useEffect(() => {
    const de = document.documentElement;
    de.setAttribute("data-nav", "float");
    return () => de.removeAttribute("data-nav");
  }, []);

  /* Horizontal drag for the tower. Held in component state only, so a browser
     refresh puts it back in the centre — deliberately NOT persisted. */
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ pointerX: number; startOffset: number } | null>(null);

  const clamp = (px: number) => {
    const limit = window.innerWidth * DRAG_LIMIT;
    return Math.max(-limit, Math.min(limit, px));
  };

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      /* capture keeps the drag alive if the pointer leaves the grip; it throws
         for a pointer id the browser no longer considers active */
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
      drag.current = { pointerX: e.clientX, startOffset: offset };
      setDragging(true);
    },
    [offset]
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    setOffset(clamp(drag.current.startOffset + (e.clientX - drag.current.pointerX)));
  }, []);

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId))
        e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    drag.current = null;
    setDragging(false);
  }, []);

  /* Keyboard equivalent, so the control is not pointer-only. */
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") setOffset((o) => clamp(o - KEY_STEP));
    else if (e.key === "ArrowRight") setOffset((o) => clamp(o + KEY_STEP));
    else if (e.key === "Home" || e.key === "Escape") setOffset(0);
    else return;
    e.preventDefault();
  }, []);

  return (
    <section
      className={styles.hero17}
      aria-label="Philbrick elevator components, engineered in India since 1992"
    >
      {/* z 0 — sky */}
      <div className={styles.bg16} aria-hidden>
        <Image
          src={HERO_SKY.day}
          alt=""
          fill
          sizes="100vw"
          priority
          className={`${styles.bg16Img} ${styles.bg16Day}`}
        />
        <Image
          src={HERO_SKY.night}
          alt=""
          fill
          sizes="100vw"
          className={`${styles.bg16Img} ${styles.bg16Night}`}
        />
      </div>

      {/* z 1 — legibility veil. Dark theme only: in light the client wants the
          photograph completely unveiled, so this paints nothing there. */}
      <div className={styles.scrim17} aria-hidden />

      {/* z 2 — the headline the tower will cut across */}
      <div className={styles.stack17}>
        <div className={`${styles.content} ${styles.content17}`}>
          <span className={`${styles.eyebrow} ${styles.animUp} ${styles.d1}`}>
            Elevator components, made in India
          </span>
          <h1
            className={`${styles.title} ${styles.title17} ${styles.animUp} ${styles.d2}`}
          >
            The machine behind <em>every smooth ride.</em>
          </h1>
        </div>

        {/* Everything below the headline FLANKS the tower rather than sitting
            behind it — the shaft is opaque, so centred copy here would simply
            be hidden. The middle grid column is the clear channel it rises
            through. */}
        <div className={styles.flank17}>
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

      {/* z 3 — tower, drawn over the headline. The plate stays click-through so
          it never swallows a click meant for the copy; only the narrow grip
          over the building itself is interactive. */}
      <div
        className={styles.fg17}
        style={{ transform: `translate3d(${offset}px, 0, 0)` }}
        data-dragging={dragging || undefined}
      >
        <Image
          src={HERO_TOWER.day}
          alt=""
          fill
          sizes="100vw"
          priority
          className={`${styles.fg17Img} ${styles.bg16Day}`}
        />
        <Image
          src={HERO_TOWER.night}
          alt=""
          fill
          sizes="100vw"
          className={`${styles.fg17Img} ${styles.bg16Night}`}
        />

        <div
          className={styles.grip17}
          role="slider"
          tabIndex={0}
          aria-label="Move the tower horizontally"
          aria-orientation="horizontal"
          aria-valuemin={-100}
          aria-valuemax={100}
          aria-valuenow={Math.round(
            (offset / (typeof window === "undefined" ? 1 : window.innerWidth * DRAG_LIMIT)) * 100
          )}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={onKeyDown}
        />
      </div>
    </section>
  );
}
