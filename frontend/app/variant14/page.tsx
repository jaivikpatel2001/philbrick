import type { Metadata } from "next";
import { Variant14Hero } from "@/sections/experience/corporate/Variant14Hero";
import { HomeSections } from "@/sections/home/HomeSections";
import { ReleaseGate } from "@/components/release/ReleaseGate";

/* Client-review variant: variant10's corporate split with an animated floating
   product gallery of the component renders. noindex. */
export const metadata: Metadata = {
  title: "Homepage variant · animated product gallery",
  robots: { index: false, follow: false },
};

export default function Variant14Page() {
  return (
    <ReleaseGate route="/variant14" label="Home">
      <Variant14Hero />
      <HomeSections />
    </ReleaseGate>
  );
}
