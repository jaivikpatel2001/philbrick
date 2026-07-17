import type { Metadata } from "next";
import { Variant8Hero } from "@/sections/experience/corporate/Variant8Hero";
import { HomeSections } from "@/sections/home/HomeSections";
import { ReleaseGate } from "@/components/release/ReleaseGate";

/* Client-review variant: clean corporate "Building Showcase" hero (no WebGL).
   noindex: temporary A/B alternative, not a canonical page. */
export const metadata: Metadata = {
  title: "Homepage variant · building showcase",
  robots: { index: false, follow: false },
};

export default function Variant8Page() {
  return (
    <ReleaseGate route="/variant8" label="Home">
      <Variant8Hero />
      <HomeSections />
    </ReleaseGate>
  );
}
