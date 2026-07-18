"use client";
import {
  ExplorationHero,
  type ExplorationHeroConfig,
} from "./ExplorationHero";
import {
  CATALOG_PARTS,
  CATALOG_SPINE,
  CATALOG_TEXT_UNITS,
  CATALOG_ELEVATOR_UNITS,
  CATALOG_PARTS_START,
  CATALOG_SETTLE_UNITS,
  CATALOG_TOTAL_UNITS,
  CATALOG_SCROLL_VH,
} from "@/data/catalogParts";
import { MOBILE_SLOT, MOBILE_ANCHOR } from "@/data/heroExploration";

/* VARIANT 11 — the /variant1 experience, verbatim (same GSAP choreography,
   layout and interactions), re-pointed at the client's catalogue assets: the
   technical drawing of the whole installation as the centre spine and the 9
   catalogue component cutouts flying to their documented positions, each with
   a leader line back to where it lives on the drawing. */
const CONFIG: ExplorationHeroConfig = {
  parts: CATALOG_PARTS,
  spine: CATALOG_SPINE,
  pacing: {
    textUnits: CATALOG_TEXT_UNITS,
    elevatorUnits: CATALOG_ELEVATOR_UNITS,
    partsStart: CATALOG_PARTS_START,
    settleUnits: CATALOG_SETTLE_UNITS,
    totalUnits: CATALOG_TOTAL_UNITS,
    scrollVh: CATALOG_SCROLL_VH,
  },
  mobileSlot: MOBILE_SLOT,
  mobileAnchor: MOBILE_ANCHOR,
  copy: {
    ariaLabel:
      "The complete elevator installation drawn as a technical diagram, with every catalogue component revealed in place as you scroll",
    eyebrow: "The Philbrick installation",
    title: (
      <>
        One installation. <em>Every part,</em> exactly where it works.
      </>
    ),
    lead: "Scroll to walk the drawing: from the machine room to the pit, every catalogue component called out in place.",
    outroLine: "Every part on this drawing is built and supported by Philbrick.",
  },
};

export function Exploration11Hero() {
  return <ExplorationHero config={CONFIG} />;
}
