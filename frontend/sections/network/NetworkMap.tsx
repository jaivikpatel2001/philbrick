"use client";
import { useEffect, useRef, useState } from "react";
import { FiMapPin } from "react-icons/fi";
import { INDIA_PATH, INDIA_VIEW, projectIndia } from "@/data/indiaMap";
import { NETWORK_CITIES, HQ_CITY, ARC_TARGETS, type NetworkCity } from "@/data/network";
import { SITE } from "@/constants/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import styles from "./NetworkMap.module.css";

/* =============================================================================
   CINEMATIC INDIA NETWORK MAP
   Custom SVG India (outline generated from the Survey-of-India-convention
   boundary, data/indiaMap.ts) with a dot-matrix interior, a drawn-on-reveal
   outline, decorative supply arcs from the Ahmedabad HQ, and one tappable node
   per verified network city (data/network.ts — the client's "Our Domestic
   Business" artwork). Selecting a node updates the info panel.

   Performance: every animation is CSS (dashoffset draws, node pulses); the dot
   matrix is ONE pattern-masked rect, not thousands of elements; React state is
   just `selected` + a one-time reveal flag. Entrance runs once via
   IntersectionObserver and is skipped entirely under prefers-reduced-motion.
   ========================================================================== */

/* ---- static geometry, computed once at module scope ------------------- */

/* The outline is simplified (450 points), so a coastal city's true lat/lng can
   land a few px outside the simplified coastline (Kochi, Goa, Amritsar…).
   Parse the outline polygon and nudge any such marker toward the polygon
   centroid until it sits safely INSIDE the landmass. */
const POLY: [number, number][] = (INDIA_PATH.match(/[ML]([\d.]+) ([\d.]+)/g) ?? []).map(
  (s) => {
    const [x, y] = s.slice(1).split(" ");
    return [parseFloat(x), parseFloat(y)];
  }
);
function insidePoly(x: number, y: number): boolean {
  let inside = false;
  for (let i = 0, j = POLY.length - 1; i < POLY.length; j = i++) {
    const [xi, yi] = POLY[i];
    const [xj, yj] = POLY[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}
/** Inside with margin: the point and a ring of offsets must all be inside. */
function safelyInside(x: number, y: number, m = 6): boolean {
  return (
    insidePoly(x, y) &&
    insidePoly(x - m, y) &&
    insidePoly(x + m, y) &&
    insidePoly(x, y - m) &&
    insidePoly(x, y + m)
  );
}
/** Radial search: the smallest displacement, in any direction, that puts the
 *  point safely inside — works on every coast orientation (a centroid-directed
 *  nudge fails on the tapered east coast, e.g. Chennai). */
function nudgeInside(x: number, y: number): { x: number; y: number } {
  if (safelyInside(x, y)) return { x, y };
  for (let r = 2.5; r <= 60; r += 2.5) {
    for (let a = 0; a < 12; a++) {
      const t = (a / 12) * Math.PI * 2;
      const px = x + Math.cos(t) * r;
      const py = y + Math.sin(t) * r;
      if (safelyInside(px, py)) return { x: px, y: py };
    }
  }
  return { x, y };
}

/* Padding around the landmass inside the SVG viewBox (room for edge labels).
   The HTML marker buttons are positioned in the SAME padded space — using the
   raw map size here previously biased every marker ~2% left/up, which is what
   pushed coastal dots onto (or off) the coastline. */
const PAD = { l: 24, r: 24, t: 22, b: 32 } as const;
const VIEW_W = INDIA_VIEW.width + PAD.l + PAD.r;
const VIEW_H = INDIA_VIEW.height + PAD.t + PAD.b;

const POS = NETWORK_CITIES.map((c) => {
  const raw = projectIndia(c.lon, c.lat);
  const p = nudgeInside(raw.x, raw.y);
  return {
    ...c,
    x: p.x,
    y: p.y,
    leftPct: ((p.x + PAD.l) / VIEW_W) * 100,
    topPct: ((p.y + PAD.t) / VIEW_H) * 100,
  };
});

const HQ_POS = POS.find((c) => c.hq)!;
/** Decorative quadratic arcs HQ → spread of network cities (see data/network.ts). */
const ARCS = ARC_TARGETS.map((name) => {
  const p = POS.find((x) => x.name === name)!;
  const mx = (HQ_POS.x + p.x) / 2;
  const my = (HQ_POS.y + p.y) / 2;
  // lift the control point perpendicular to the chord for a gentle bow
  const dx = p.x - HQ_POS.x;
  const dy = p.y - HQ_POS.y;
  const len = Math.hypot(dx, dy) || 1;
  const lift = Math.min(46, len * 0.22);
  const cx = mx - (dy / len) * lift;
  const cy = my + (dx / len) * lift;
  return `M${HQ_POS.x.toFixed(1)} ${HQ_POS.y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
});

export function NetworkMap() {
  const root = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [selected, setSelected] = useState<NetworkCity>(HQ_CITY);

  /* Reveal once when the section enters the viewport. Armed only after mount,
     so no-JS visitors (and reduced motion) always see the finished map. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    el.dataset.armed = "1";
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.22 }
    );
    io.observe(el);
    // Safety net: if IO never fires (throttled/odd environments), reveal anyway
    // so the map can never stay hidden.
    const fallback = window.setTimeout(() => setInView(true), 4000);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={root}
      className={styles.wrap}
      data-phase={inView ? "in" : "idle"}
    >
      {/* ---- Map stage ---- */}
      <figure className={styles.stage}>
        <div className={styles.halo} aria-hidden />
        <svg
          className={styles.svg}
          viewBox={`${-PAD.l} ${-PAD.t} ${VIEW_W} ${VIEW_H}`}
          role="img"
          aria-label="Map of India showing the 31 cities on Philbrick's domestic business network"
        >
          <defs>
            <pattern id="nm-dots" width="11" height="11" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.25" fill="currentColor" />
            </pattern>
            <mask id="nm-land">
              <path d={INDIA_PATH} fill="#fff" />
            </mask>
            <linearGradient id="nm-arc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--accent)" stopOpacity="0.85" />
              <stop offset="1" stopColor="var(--accent)" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* dot-matrix interior: one pattern-masked rect */}
          <rect
            className={styles.dotFill}
            x="0"
            y="0"
            width={INDIA_VIEW.width}
            height={INDIA_VIEW.height}
            fill="url(#nm-dots)"
            mask="url(#nm-land)"
          />

          {/* national outline, drawn on reveal */}
          <path className={styles.outline} d={INDIA_PATH} pathLength={1} />

          {/* decorative supply arcs from the Ahmedabad factory */}
          <g className={styles.arcs} aria-hidden>
            {ARCS.map((d, i) => (
              <path
                key={d}
                className={styles.arc}
                d={d}
                pathLength={1}
                style={{ "--arc-i": i } as React.CSSProperties}
              />
            ))}
          </g>

          {/* permanent city labels — every network city is named, with
              per-city placement tuned in data/network.ts (as on the client's
              reference artwork). Scales with the map like a print graphic. */}
          <g className={styles.labels} aria-hidden>
            {POS.map((c) => (
              <text
                key={c.name}
                className={cn(styles.cityLabel, c.hq && styles.cityLabelHq)}
                x={c.x + c.labelDx}
                y={c.y + c.labelDy}
                textAnchor={c.labelAnchor}
              >
                {c.name}
              </text>
            ))}
          </g>
        </svg>

        {/* ---- City nodes (real buttons, touch-friendly) ---- */}
        {POS.map((c, i) => (
          <button
            key={c.name}
            type="button"
            className={cn(
              styles.node,
              c.hq && styles.nodeHq,
              selected.name === c.name && styles.nodeActive
            )}
            style={
              {
                left: `${c.leftPct}%`,
                top: `${c.topPct}%`,
                "--node-i": i,
              } as React.CSSProperties
            }
            onClick={() => setSelected(c)}
            aria-pressed={selected.name === c.name}
            aria-label={`${c.name}, ${c.state}${c.hq ? ", headquarters and factory" : ""}`}
          >
            <span className={styles.dot} aria-hidden />
            {c.hq && <span className={styles.ring} aria-hidden />}
            {/* hover/selection tooltip adds the state (names are permanent) */}
            <span
              className={styles.tip}
              data-pos={c.topPct < 13 ? "below" : "above"}
              aria-hidden
            >
              {c.state}
            </span>
          </button>
        ))}

        <figcaption className="sr-only">
          Cities from Philbrick&apos;s domestic business network, supplied from
          the Ahmedabad factory.
        </figcaption>
      </figure>

      {/* ---- Info panel ---- */}
      <aside className={styles.panel} aria-live="polite">
        <span className={styles.panelKicker}>
          <FiMapPin aria-hidden />
          {selected.hq ? "Headquarters & factory" : "Network city"}
        </span>
        <h3 className={styles.panelCity}>{selected.name}</h3>
        <p className={styles.panelState}>{selected.state} · India</p>

        {selected.hq ? (
          <>
            <p className={styles.panelBody}>
              Design, R&amp;D, manufacturing, quality control and dispatch under
              one roof. Every component on this map ships from here.
            </p>
            <p className={styles.panelAddress}>
              {SITE.address.line1}, {SITE.address.line2}
            </p>
          </>
        ) : (
          <p className={styles.panelBody}>
            Part of Philbrick&apos;s domestic business network. Components from
            our Ahmedabad factory reach installers, OEMs and modernisers here.
          </p>
        )}

        <Button href="/contact" size="sm" withArrow>
          {selected.hq ? "Visit or contact us" : `Enquire about supply in ${selected.name}`}
        </Button>

        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Network cities</dt>
            <dd className={styles.statValue}>31</dd>
          </div>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Factory &amp; HQ</dt>
            <dd className={styles.statValue}>Ahmedabad</dd>
          </div>
          <div className={styles.stat}>
            <dt className={styles.statLabel}>Export markets</dt>
            <dd className={styles.statValue}>China &amp; Taiwan</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
