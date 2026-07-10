import { ElevatorScene } from "@/sections/experience/ElevatorScene";
import { AboutPreview } from "@/sections/home/AboutPreview";
import { ProductsShowcase } from "@/sections/home/ProductsShowcase";
import { ServiceEcosystem } from "@/sections/home/ServiceEcosystem";
import { IndustriesShowcase } from "@/sections/home/IndustriesShowcase";
import { Projects } from "@/sections/experience/Projects";
import { StatsBand } from "@/sections/shared/StatsBand";
import { CTASection } from "@/sections/shared/CTASection";
import { COMPANY_STATS } from "@/data/stats";

/**
 * Homepage = the flagship storytelling experience.
 * The cinematic Three.js elevator hero hands off into the brand's content flow:
 * who we are → what we make → how we support it → proof → industries → numbers →
 * a conversion CTA, then the global footer.
 */
export default function HomePage() {
  return (
    <>
      {/* Cinematic elevator hero (Three.js) — night arrival → dolly-zoom through
          the facade → lobby → component-by-component reveal */}
      <ElevatorScene />

      {/* About the company */}
      <AboutPreview />

      {/* Products — the elevator portfolio */}
      <ProductsShowcase />

      {/* Installation · maintenance · modernization · AMC */}
      <ServiceEcosystem />

      {/* Projects */}
      <Projects />

      {/* Industries */}
      <IndustriesShowcase />

      {/* By the numbers */}
      <StatsBand
        eyebrow="06 — By the numbers"
        title="Performance you can measure"
        description="The intelligence inside every VERTIQ system shows up where it counts: in energy, in uptime and in time saved."
        stats={COMPANY_STATS}
        columns={4}
        variant="bordered"
        align="left"
      />

      {/* Contact / CTA */}
      <CTASection
        eyebrow="Let's build upward"
        title="Ready to move your building into the future?"
        description="Tell us about your project and a VERTIQ specialist will design the right vertical mobility solution with you."
        primary={{ label: "Request a consultation", href: "/contact" }}
        secondary={{ label: "Explore products", href: "/products" }}
      />
    </>
  );
}
