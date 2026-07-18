import type { Metadata } from "next";
import { Variant15Hero } from "@/sections/experience/corporate/Variant15Hero";
import { CategoryBrowse15 } from "@/sections/experience/corporate/CategoryBrowse15";
import { HomeSections } from "@/sections/home/HomeSections";
import { ReleaseGate } from "@/components/release/ReleaseGate";

/* Client-review variant: product-first industrial hero with a rotating
   category spotlight, plus a "Browse by product category" section with all 14
   real categories, then the shared homepage body. noindex. */
export const metadata: Metadata = {
  title: "Homepage variant · product spotlight and categories",
  robots: { index: false, follow: false },
};

export default function Variant15Page() {
  return (
    <ReleaseGate route="/variant15" label="Home">
      <Variant15Hero />
      <CategoryBrowse15 />
      <HomeSections />
    </ReleaseGate>
  );
}
