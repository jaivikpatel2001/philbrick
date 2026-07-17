import { ElevatorHero } from "@/sections/experience/ElevatorHero";
import { HomeSections } from "@/sections/home/HomeSections";
import { ReleaseGate } from "@/components/release/ReleaseGate";

/**
 * Homepage `/` — the cinematic Three.js elevator hero version.
 *
 * Client-review A/B: `/variant1` is the same page with the scroll-driven
 * exploded component tour hero (sections/experience/ExplorationHero.tsx). The
 * page body below the hero is shared via <HomeSections />.
 */
export default function HomePage() {
  return (
    <ReleaseGate route="/" label="Home">
      <ElevatorHero />
      <HomeSections />
    </ReleaseGate>
  );
}
