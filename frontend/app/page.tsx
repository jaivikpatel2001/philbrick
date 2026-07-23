import { Variant18Hero } from "@/sections/experience/corporate/Variant18Hero";
import { CategoryBrowse15 } from "@/sections/experience/corporate/CategoryBrowse15";
import { HomeSections } from "@/sections/home/HomeSections";
import { ReleaseGate } from "@/components/release/ReleaseGate";

/**
 * Homepage `/` — the single-scene hero (Variant18Hero): sky, buildings and the
 * headline baked into one photograph per theme, with the live copy in front.
 * The page body below is shared across the site via <HomeSections />.
 *
 * (Was the Three.js elevator hero plus the /variant1…18 A/B review pages; the
 * client chose this direction and the legacy variants were removed 2026-07-23.)
 */
export default function HomePage() {
  return (
    <ReleaseGate route="/" label="Home">
      <Variant18Hero />
      <CategoryBrowse15 />
      <HomeSections />
    </ReleaseGate>
  );
}
