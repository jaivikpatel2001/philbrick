import type { Metadata } from "next";
import { Variant18Hero } from "@/sections/experience/corporate/Variant18Hero";
import { CategoryBrowse15 } from "@/sections/experience/corporate/CategoryBrowse15";
import { HomeSections } from "@/sections/home/HomeSections";
import { ReleaseGate } from "@/components/release/ReleaseGate";

/* Client-review variant: variant17 with the hero recomposed — the headline sits
   high in the open sky and the tower's PEAK reaches it, taking a character or
   two out of the last line, instead of the building crossing the whole
   headline. Everything else on the page is variant17's.
   noindex: temporary A/B alternative, not a canonical page. */
export const metadata: Metadata = {
  title: "Homepage variant · sky headline",
  robots: { index: false, follow: false },
};

export default function Variant18Page() {
  return (
    <ReleaseGate route="/variant18" label="Home">
      <Variant18Hero />
      <CategoryBrowse15 />
      <HomeSections />
    </ReleaseGate>
  );
}
