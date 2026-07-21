import type { Metadata } from "next";
import { Variant17Hero } from "@/sections/experience/corporate/Variant17Hero";
import { CategoryBrowse15 } from "@/sections/experience/corporate/CategoryBrowse15";
import { HomeSections } from "@/sections/home/HomeSections";
import { ReleaseGate } from "@/components/release/ReleaseGate";

/* Client-review variant: variant16 with a depth hero — the headline runs
   BEHIND a transparent-PNG tower, so the middle characters are occluded while
   the <h1> stays real text.
   noindex: temporary A/B alternative, not a canonical page. */
export const metadata: Metadata = {
  title: "Homepage variant · depth hero",
  robots: { index: false, follow: false },
};

export default function Variant17Page() {
  return (
    <ReleaseGate route="/variant17" label="Home">
      <Variant17Hero />
      <CategoryBrowse15 />
      <HomeSections />
    </ReleaseGate>
  );
}
