"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { stopLenis, startLenis } from "@/components/providers/SmoothScroll";
import styles from "./Preloader.module.css";

/* =============================================================================
   ELEVATOR PRELOADER
   Full-viewport elevator doors with a floor indicator: the indicator steps
   G → 1 → 2 → 3 while the site prepares, then the doors slide open and reveal
   the page behind. Theme-aware (design tokens), CSS-animated, and removed from
   the DOM entirely once the exit finishes.

   Timing contract:
   - Phase sequence: boot (countdown) → arrive (countdown done — the blue seam
     line draws in) → open (doors part) → done. The seam line is hidden for the
     whole countdown and is revealed by the SAME state that ends it, so the
     sequence can never desynchronise on slow or fast devices.
   - "arrive" begins at max(minimum sequence, window load) — fast connections
     still see one complete, short sequence; slow ones aren't blocked past the
     hard cap.
   - Reduced motion: static logo, no door/indicator/line travel, quick fade.
   ========================================================================== */

const FLOORS = ["G", "1", "2", "3"] as const;
const STEP_MS = 420; // one indicator step
const MIN_MS = STEP_MS * FLOORS.length + 260; // one full ride minimum
const HARD_CAP_MS = 4200; // never block longer than this
const LINE_MS = 460; // seam-line reveal before the doors move (matches CSS)
const DOORS_MS = 980; // door travel (matches CSS)

type Phase = "boot" | "arrive" | "open" | "done";

export function Preloader() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [floor, setFloor] = useState(0);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Lock scrolling behind the overlay (Lenis + native fallback).
    stopLenis();
    document.documentElement.style.overflow = "hidden";

    const timers: number[] = [];
    let opened = false;

    const open = () => {
      if (opened) return;
      opened = true;
      if (reduced.current) {
        // Reduced motion: no line travel, straight to the quick fade.
        setPhase("open");
        timers.push(window.setTimeout(() => setPhase("done"), 320));
        return;
      }
      // Countdown is complete — reveal the seam line, then part the doors.
      setPhase("arrive");
      timers.push(window.setTimeout(() => setPhase("open"), LINE_MS));
      timers.push(
        window.setTimeout(() => setPhase("done"), LINE_MS + DOORS_MS + 120)
      );
    };

    if (reduced.current) {
      // Simplified: no travel, reveal as soon as we're interactive-ish.
      const t = window.setTimeout(open, 700);
      timers.push(t);
      if (document.readyState === "complete") open();
      else window.addEventListener("load", open, { once: true });
    } else {
      // Floor indicator ride: G → 1 → 2 → 3.
      FLOORS.forEach((_, i) => {
        if (i === 0) return;
        timers.push(window.setTimeout(() => setFloor(i), i * STEP_MS));
      });

      const minDone = new Promise<void>((res) => {
        timers.push(window.setTimeout(res, MIN_MS));
      });
      const loaded = new Promise<void>((res) => {
        if (document.readyState === "complete") res();
        else window.addEventListener("load", () => res(), { once: true });
      });
      const cap = new Promise<void>((res) => {
        timers.push(window.setTimeout(res, HARD_CAP_MS));
      });

      // Open when both the minimum sequence and the page are ready — or at the
      // hard cap, whichever comes first. The site is never held hostage.
      Promise.race([Promise.all([minDone, loaded]).then(() => undefined), cap]).then(open);
    }

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      document.documentElement.style.overflow = "";
      startLenis();
    };
  }, []);

  // Restore scrolling the moment the doors have fully opened.
  useEffect(() => {
    if (phase === "done") {
      document.documentElement.style.overflow = "";
      startLenis();
    }
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={styles.wrap}
      data-phase={phase}
      role="status"
      aria-label="Philbrick is loading"
    >
      {/* Door leaves — full-viewport, sliding apart on open */}
      <div className={`${styles.door} ${styles.doorLeft}`} aria-hidden>
        <span className={styles.doorEdge} />
      </div>
      <div className={`${styles.door} ${styles.doorRight}`} aria-hidden>
        <span className={styles.doorEdge} />
      </div>

      {/* Centre stack: brand + floor indicator */}
      <div className={styles.stack} aria-hidden>
        <Image
          src="/brand/logo.png"
          alt=""
          width={214}
          height={48}
          priority
          className={styles.logo}
        />
        <div className={styles.indicator}>
          <span className={styles.arrow}>▲</span>
          <span className={styles.floor} key={floor}>
            {FLOORS[floor]}
          </span>
        </div>
        <p className={styles.caption}>Arriving at your floor</p>
      </div>
    </div>
  );
}
