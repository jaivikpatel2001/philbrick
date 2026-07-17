import type { Metadata } from "next";
import { Variant9Hero } from "@/sections/experience/corporate/Variant9Hero";
import { HomeSections } from "@/sections/home/HomeSections";
import { ReleaseGate } from "@/components/release/ReleaseGate";

/* Client-review variant: clean corporate "Premium Interior" hero (no WebGL).
   noindex: temporary A/B alternative, not a canonical page. */
export const metadata: Metadata = {
  title: "Homepage variant · premium interior",
  robots: { index: false, follow: false },
};

export default function Variant9Page() {
  return (
    <ReleaseGate route="/variant9" label="Home">
      <Variant9Hero />
      <HomeSections />
    </ReleaseGate>
  );
}
