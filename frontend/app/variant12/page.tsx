import type { Metadata } from "next";
import { Variant12Hero } from "@/sections/experience/variants/Variant12Hero";
import { HomeSections } from "@/sections/home/HomeSections";
import { ReleaseGate } from "@/components/release/ReleaseGate";

/* Client-review variant: the variant6 3D arrival with the catalogue drawing +
   the 9 catalogue part cutouts in the exploded overlay. noindex. */
export const metadata: Metadata = {
  title: "Homepage variant · catalogue journey",
  robots: { index: false, follow: false },
};

export default function Variant12Page() {
  return (
    <ReleaseGate route="/variant12" label="Home">
      <Variant12Hero />
      <HomeSections />
    </ReleaseGate>
  );
}
