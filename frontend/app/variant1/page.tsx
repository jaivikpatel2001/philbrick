import type { Metadata } from "next";
import { ExplorationHero } from "@/sections/experience/ExplorationHero";
import { HomeSections } from "@/sections/home/HomeSections";
import { ReleaseGate } from "@/components/release/ReleaseGate";

/* Client-review variant of the homepage: the scroll-driven exploded component
   tour hero instead of the Three.js scene. Kept out of search (noindex) — it is
   a temporary A/B alternative, not a canonical page; remove once the client
   picks a hero direction. Body below the hero is shared via <HomeSections />. */
export const metadata: Metadata = {
  title: "Homepage variant · component tour",
  robots: { index: false, follow: false },
};

export default function Variant1Page() {
  return (
    <ReleaseGate route="/variant1" label="Home">
      <ExplorationHero />
      <HomeSections />
    </ReleaseGate>
  );
}
