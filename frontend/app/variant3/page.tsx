import type { Metadata } from "next";
import { Variant3Hero } from "@/sections/experience/variants/Variant3Hero";
import { HomeSections } from "@/sections/home/HomeSections";
import { ReleaseGate } from "@/components/release/ReleaseGate";

/* Client-review variant: "Engineering Blueprint" Three.js hero — the system
   scans from wireframe to metal to finished product. noindex: temporary A/B
   alternative, not a canonical page. */
export const metadata: Metadata = {
  title: "Homepage variant · engineering blueprint",
  robots: { index: false, follow: false },
};

export default function Variant3Page() {
  return (
    <ReleaseGate route="/variant3" label="Home">
      <Variant3Hero />
      <HomeSections />
    </ReleaseGate>
  );
}
