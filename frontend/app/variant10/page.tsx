import type { Metadata } from "next";
import { Variant10Hero } from "@/sections/experience/corporate/Variant10Hero";
import { HomeSections } from "@/sections/home/HomeSections";
import { ReleaseGate } from "@/components/release/ReleaseGate";

/* Client-review variant: clean corporate "Product Feature Showcase" hero
   (no WebGL). noindex: temporary A/B alternative, not a canonical page. */
export const metadata: Metadata = {
  title: "Homepage variant · product feature showcase",
  robots: { index: false, follow: false },
};

export default function Variant10Page() {
  return (
    <ReleaseGate route="/variant10" label="Home">
      <Variant10Hero />
      <HomeSections />
    </ReleaseGate>
  );
}
