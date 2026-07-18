import type { Metadata } from "next";
import { Variant13Hero } from "@/sections/experience/corporate/Variant13Hero";
import { HomeSections } from "@/sections/home/HomeSections";
import { ReleaseGate } from "@/components/release/ReleaseGate";

/* Client-review variant: corporate scroll component reveal — the installation
   drawing with every catalogue part introduced one at a time. noindex. */
export const metadata: Metadata = {
  title: "Homepage variant · component reveal",
  robots: { index: false, follow: false },
};

export default function Variant13Page() {
  return (
    <ReleaseGate route="/variant13" label="Home">
      <Variant13Hero />
      <HomeSections />
    </ReleaseGate>
  );
}
