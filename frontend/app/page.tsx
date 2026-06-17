import { ElevatorScene } from "@/sections/experience/ElevatorScene";
import { AboutPreview } from "@/sections/home/AboutPreview";
import { ProductsShowcase } from "@/sections/home/ProductsShowcase";
import { ServiceEcosystem } from "@/sections/home/ServiceEcosystem";
import { TechnologyPreview } from "@/sections/home/TechnologyPreview";
import { IndustriesShowcase } from "@/sections/home/IndustriesShowcase";
import { Projects } from "@/sections/experience/Projects";
import { StatsBand } from "@/sections/shared/StatsBand";
import { ClientMarquee } from "@/sections/shared/ClientMarquee";
import { TestimonialsSection } from "@/sections/shared/TestimonialsSection";
import { CTASection } from "@/sections/shared/CTASection";
import { COMPANY_STATS } from "@/data/stats";
import { TESTIMONIALS } from "@/data/testimonials";
import { TRUST_LOGOS } from "@/constants/site";

/**
 * Homepage = the flagship storytelling experience.
 * Cinematic Three.js elevator hero hands off (via a light-wipe) into the
 * brand's content flow, then the global footer.
 */
export default function HomePage() {
  return (
    <>
      {/* Cinematic elevator hero (Three.js) — arrives → opens → ascends →
          engineering reveal → light-wipe into the site */}
      <ElevatorScene />

      {/* About the company */}
      <AboutPreview />

      {/* Trusted by */}
      <ClientMarquee items={TRUST_LOGOS} />

      {/* Products */}
      <ProductsShowcase />

      {/* Services */}
      <ServiceEcosystem />

      {/* Technology & Innovation */}
      <TechnologyPreview />

      {/* Projects */}
      <Projects />

      {/* Industries */}
      <IndustriesShowcase />

      {/* By the numbers */}
      <StatsBand
        eyebrow="By the numbers"
        title="Performance you can measure"
        description="The intelligence inside every VERTIQ system shows up where it counts — in energy, in uptime and in time saved."
        stats={COMPANY_STATS}
        columns={4}
        variant="bordered"
      />

      {/* Testimonials */}
      <TestimonialsSection testimonials={TESTIMONIALS} />

      {/* Contact / CTA */}
      <CTASection
        eyebrow="Let's build upward"
        title="Ready to move your building into the future?"
        description="Tell us about your project and a VERTIQ specialist will design the right vertical-mobility solution with you."
        primary={{ label: "Request a consultation", href: "/contact" }}
        secondary={{ label: "Explore products", href: "/products" }}
      />
    </>
  );
}
