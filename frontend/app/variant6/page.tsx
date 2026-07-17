import type { Metadata } from "next";
import { Variant6Hero } from "@/sections/experience/variants/Variant6Hero";
import { HomeSections } from "@/sections/home/HomeSections";
import { ReleaseGate } from "@/components/release/ReleaseGate";

/* Client-review variant: the original homepage journey remade with photoreal
   imagery (matte slots for the tower/lobby/doors per imagegeneration.md §11.4,
   real renders for the machine and all 8 components). noindex: temporary A/B
   alternative, not a canonical page. */
export const metadata: Metadata = {
  title: "Homepage variant · the original, photoreal",
  robots: { index: false, follow: false },
};

export default function Variant6Page() {
  return (
    <ReleaseGate route="/variant6" label="Home">
      <Variant6Hero />
      <HomeSections />
    </ReleaseGate>
  );
}
