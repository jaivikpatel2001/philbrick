import type { Metadata } from "next";
import { Exploration11Hero } from "@/sections/experience/Exploration11Hero";
import { HomeSections } from "@/sections/home/HomeSections";
import { ReleaseGate } from "@/components/release/ReleaseGate";

/* Client-review variant: the /variant1 exploded tour with the catalogue
   drawing + the 9 catalogue part cutouts. noindex: temporary A/B page. */
export const metadata: Metadata = {
  title: "Homepage variant · catalogue exploded tour",
  robots: { index: false, follow: false },
};

export default function Variant11Page() {
  return (
    <ReleaseGate route="/variant11" label="Home">
      <Exploration11Hero />
      <HomeSections />
    </ReleaseGate>
  );
}
