import type { Metadata } from "next";
import { Variant5Hero } from "@/sections/experience/variants/Variant5Hero";
import { HomeSections } from "@/sections/home/HomeSections";
import { ReleaseGate } from "@/components/release/ReleaseGate";

/* Client-review variant: "Night Arrival" Three.js hero — the imagegeneration.md
   §10.1 night-city world, ending on the real machine and all 8 components.
   noindex: temporary A/B alternative, not a canonical page. */
export const metadata: Metadata = {
  title: "Homepage variant · night arrival",
  robots: { index: false, follow: false },
};

export default function Variant5Page() {
  return (
    <ReleaseGate route="/variant5" label="Home">
      <Variant5Hero />
      <HomeSections />
    </ReleaseGate>
  );
}
