import type { Metadata } from "next";
import { Variant7Hero } from "@/sections/experience/corporate/Variant7Hero";
import { HomeSections } from "@/sections/home/HomeSections";
import { ReleaseGate } from "@/components/release/ReleaseGate";

/* Client-review variant: clean corporate "Classic Split" hero (no WebGL).
   noindex: temporary A/B alternative, not a canonical page. */
export const metadata: Metadata = {
  title: "Homepage variant · classic split",
  robots: { index: false, follow: false },
};

export default function Variant7Page() {
  return (
    <ReleaseGate route="/variant7" label="Home">
      <Variant7Hero />
      <HomeSections />
    </ReleaseGate>
  );
}
