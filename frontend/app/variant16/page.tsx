import type { Metadata } from "next";
import { Variant16Hero } from "@/sections/experience/corporate/Variant16Hero";
import { CategoryBrowse15 } from "@/sections/experience/corporate/CategoryBrowse15";
import { HomeSections } from "@/sections/home/HomeSections";
import { ReleaseGate } from "@/components/release/ReleaseGate";

/* Client-review variant: a single centred content block over a full-bleed city
   photograph that swaps with the theme (day photo in light, night photo in
   dark), under a floating glass navigation pill.
   noindex: temporary A/B alternative, not a canonical page. */
export const metadata: Metadata = {
  title: "Homepage variant · centred city hero",
  robots: { index: false, follow: false },
};

export default function Variant16Page() {
  return (
    <ReleaseGate route="/variant16" label="Home">
      <Variant16Hero />
      <CategoryBrowse15 />
      <HomeSections />
    </ReleaseGate>
  );
}
