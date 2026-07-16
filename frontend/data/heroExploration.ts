/* =============================================================================
   HERO EXPLORATION — config for the scroll-driven exploded component tour
   (sections/experience/ExplorationHero.tsx).

   The hero pins a 100svh stage while the user scrolls through a tall section.
   One scrubbed GSAP timeline reveals each part in sequence: the part flies out
   from its anchor on the central elevator spine to its resting slot, a leader
   line draws, and its label fades in. Scrolling backwards reverses everything.

   ALL layout is data driven from this file:
   - `anchor`  where the part departs FROM on the spine (% of the stage)
   - `slot`    where it rests in the exploded overview on desktop (% of stage)
   - `slotM`   its mobile resting slot (parts take turns in one focal slot)
   - `treatment`
       "card"    the interim state: real photos (with backgrounds) framed as
                 premium component cards (public/images/3D_Elevetor).
       "cutout"  the final state: client supplied transparent PNG cutouts in
                 public/images/home/hero-exploration/components/ rendered bare,
                 which completes the true exploded 3D illusion.

   WHEN THE CLIENT ASSETS LAND (see imagegeneration.md §10 for the full spec):
   1. Drop transparent PNGs into public/images/home/hero-exploration/.
   2. Run `node scripts/optimizeHeroExploration.mjs` (WebP + manifest merge).
   3. Point `image` at the new path, flip `treatment` to "cutout", add the new
      parts (overload device, fan and blower, floor announcing, accessories),
      and adjust slots/anchors. Nothing else changes.
   ========================================================================== */

import { ELEVATOR_COMPONENTS, type ElevatorComponent } from "./elevatorComponents";

export interface StagePoint {
  /** % of stage width, 0 left … 100 right */
  x: number;
  /** % of stage height, 0 top … 100 bottom */
  y: number;
}

/* ---- the central assembled machine --------------------------------------
   "svg"   the built-in blueprint line drawing (interim).
   "image" a photoreal cutaway render on a TRANSPARENT background — drop the
           PNG at public/images/home/hero-exploration/spine/elevator-cutaway.png,
           run `node scripts/optimizeHeroExploration.mjs`, then switch the
           config below. `aspect` = image width / height (keeps the footprint
           correct); anchors/slots need no change unless the render's internal
           layout differs from the blueprint. */
export type SpineConfig =
  | { type: "svg" }
  | { type: "image"; src: string; alt: string; aspect: number };

/* Client cutaway render (2026-07-16): supplied at 1024x1536 with a painted
   grey studio backdrop; edges feathered to alpha in-pipeline so it melts into
   the stage (original archived in image-sources/home/hero-exploration/). */
export const SPINE: SpineConfig = {
  type: "image",
  src: "/images/home/hero-exploration/spine/elevator-cutaway.png",
  alt: "",
  aspect: 1024 / 1536,
};

export interface ExplorationPart {
  key: string;
  component: ElevatorComponent;
  treatment: "card" | "cutout";
  /** image shown in the tour (cutouts override the component's card photo) */
  image: string;
  /** natural width/height of the cutout (drives its box; cards are 4:3) */
  aspect?: number;
  /** cutout sizing caps: max width in px, max height in vh */
  size?: { wCap: number; hCapVh: number };
  /** departure point on the spine (% of stage) */
  anchor: StagePoint;
  /** desktop resting slot (% of stage, part is centred on it) */
  slot: StagePoint;
  /** which side of the spine the part rests on (label + line alignment) */
  side: "left" | "right";
}

interface PartSpec {
  key: string;
  treatment: "card" | "cutout";
  image?: string;
  aspect?: number;
  size?: { wCap: number; hCapVh: number };
  anchor: StagePoint;
  slot: StagePoint;
  side: "left" | "right";
}

const COMP = "/images/home/hero-exploration/components";

/* Reveal order tells the machine's story top to bottom: the drive up in the
   machine room, the controls riders touch, the doors, then safety, signal and
   cabin systems. Left/right alternation keeps the composition balanced, and
   each column ZIGZAGS: near the elevator, far from it, near, far. The
   alternating x offsets guarantee vertically adjacent cards never overlap. */
/* Client cutouts (2026-07-16): true-alpha renders, trimmed + 16px margin,
   aspect = trimmed width/height. `interior` stays a framed card by design (a
   room reads better framed; its render also carried a painted checkerboard —
   original archived, cropped in-pipeline). */
const PART_SPECS: PartSpec[] = [
  { key: "motor", treatment: "cutout", image: `${COMP}/01-traction-machine.png`, aspect: 1.024, anchor: { x: 50, y: 17 }, slot: { x: 30, y: 16 }, side: "left" },
  { key: "key-switch", treatment: "cutout", image: `${COMP}/02-security-key-switch.png`, aspect: 0.7, anchor: { x: 53, y: 49 }, slot: { x: 86, y: 17 }, side: "right" },
  { key: "doors", treatment: "cutout", image: `${COMP}/03-door-mechanism.png`, aspect: 1.491, anchor: { x: 50, y: 58 }, slot: { x: 13, y: 42 }, side: "left" },
  { key: "control-panel", treatment: "cutout", image: `${COMP}/04-car-operating-panel.png`, aspect: 0.248, size: { wCap: 110, hCapVh: 38 }, anchor: { x: 54, y: 51 }, slot: { x: 69, y: 43 }, side: "right" },
  { key: "safety", treatment: "cutout", image: `${COMP}/05-safety-system.png`, aspect: 0.608, anchor: { x: 49, y: 74 }, slot: { x: 30, y: 68 }, side: "left" },
  { key: "display", treatment: "cutout", image: `${COMP}/06-display-screen.png`, aspect: 1.414, anchor: { x: 50, y: 36 }, slot: { x: 86, y: 69 }, side: "right" },
  { key: "interior", treatment: "card", image: `${COMP}/07-interior-design.png`, anchor: { x: 50, y: 52 }, slot: { x: 13, y: 90 }, side: "left" },
  { key: "emergency", treatment: "cutout", image: `${COMP}/08-emergency-call.png`, aspect: 0.881, anchor: { x: 53, y: 55 }, slot: { x: 69, y: 91 }, side: "right" },
];

/** Mobile: every part takes its turn in one focal slot under the spine. */
export const MOBILE_SLOT: StagePoint = { x: 50, y: 66 };
/** Mobile departure point (the spine sits higher and smaller on phones). */
export const MOBILE_ANCHOR: StagePoint = { x: 50, y: 30 };

export const EXPLORATION_PARTS: ExplorationPart[] = PART_SPECS.map((spec) => {
  const component = ELEVATOR_COMPONENTS.find((c) => c.key === spec.key);
  if (!component) throw new Error(`heroExploration: unknown component key "${spec.key}"`);
  return { ...spec, component, image: spec.image ?? component.image };
});

/* ---- scroll pacing (timeline units; 1 unit = one component beat) ---------- */
export const INTRO_UNITS = 0.9; // assembled machine + headline hold
export const SETTLE_UNITS = 1.1; // exploded overview + CTA hold at the end
export const TOTAL_UNITS = INTRO_UNITS + EXPLORATION_PARTS.length + SETTLE_UNITS;

/** ~85vh of scroll per beat reads unhurried without feeling like scroll jail. */
const VH_PER_UNIT = 85;
export const SCROLL_VH = Math.round(TOTAL_UNITS * VH_PER_UNIT);
