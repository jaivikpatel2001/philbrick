import type { Metadata } from "next";
import { Variant4Hero } from "@/sections/experience/variants/Variant4Hero";
import { HomeSections } from "@/sections/home/HomeSections";
import { ReleaseGate } from "@/components/release/ReleaseGate";

/* Client-review variant: "Immersive Storytelling" Three.js hero — a five scene
   product film (lobby, shaft, machine room, components, system). noindex:
   temporary A/B alternative, not a canonical page. */
export const metadata: Metadata = {
  title: "Homepage variant · a short film",
  robots: { index: false, follow: false },
};

export default function Variant4Page() {
  return (
    <ReleaseGate route="/variant4" label="Home">
      <Variant4Hero />
      <HomeSections />
    </ReleaseGate>
  );
}
