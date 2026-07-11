import { ElevatorScene } from "@/sections/experience/ElevatorScene";
import { AboutPreview } from "@/sections/home/AboutPreview";
import { ProductsShowcase } from "@/sections/home/ProductsShowcase";
import { ServiceEcosystem } from "@/sections/home/ServiceEcosystem";
import { IndustriesShowcase } from "@/sections/home/IndustriesShowcase";
import { StatsBand } from "@/sections/shared/StatsBand";
import { CTASection } from "@/sections/shared/CTASection";
import { ReleaseGate } from "@/components/release/ReleaseGate";
import { COMPANY_STATS } from "@/data/stats";

/**
 * Homepage = the flagship storytelling experience.
 * The cinematic Three.js elevator hero hands off into Philbrick's content flow:
 * who we are → what we make → what we offer → applications → numbers → CTA.
 */
export default function HomePage() {
  return (
    <ReleaseGate route="/" label="Home">
      {/* Cinematic elevator hero (Three.js) — night arrival → dolly-zoom through
          the facade → lobby → component-by-component reveal */}
      <ElevatorScene />

      {/* About the company */}
      <AboutPreview />

      {/* Products — the component range */}
      <ProductsShowcase />

      {/* What we offer — manufacturing · custom/OEM · modernisation · support */}
      <ServiceEcosystem />

      {/* Applications */}
      <IndustriesShowcase />

      {/* By the numbers */}
      <StatsBand
        eyebrow="05 By the numbers"
        title="A component maker you can measure"
        description="Three decades of in-house engineering and a complete elevator-component range, from control panels to signalling."
        stats={COMPANY_STATS}
        columns={4}
        variant="bordered"
      />

      {/* Contact / CTA */}
      <CTASection
        eyebrow="Let's build"
        title="Ready to specify your next elevator?"
        description="Tell us about your project and the Philbrick team will help you choose the right control, safety and signalling components."
        primary={{ label: "Request a quote", href: "/contact" }}
        secondary={{ label: "Explore products", href: "/products" }}
      />
    </ReleaseGate>
  );
}
