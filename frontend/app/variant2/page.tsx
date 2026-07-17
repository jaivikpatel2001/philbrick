import type { Metadata } from "next";
import { Variant2Hero } from "@/sections/experience/variants/Variant2Hero";
import { HomeSections } from "@/sections/home/HomeSections";
import { ReleaseGate } from "@/components/release/ReleaseGate";

/* Client-review variant: "Architectural Journey" Three.js hero — fly through
   the tower, ride the shaft, end on the assembled system. noindex: temporary
   A/B alternative, not a canonical page. */
export const metadata: Metadata = {
  title: "Homepage variant · architectural journey",
  robots: { index: false, follow: false },
};

export default function Variant2Page() {
  return (
    <ReleaseGate route="/variant2" label="Home">
      <Variant2Hero />
      <HomeSections />
    </ReleaseGate>
  );
}
