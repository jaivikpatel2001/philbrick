import { HomeHero } from "@/sections/home/HomeHero";
import { AboutPreview } from "@/sections/home/AboutPreview";
import { ProductsShowcase } from "@/sections/home/ProductsShowcase";
import { TechnologyPreview } from "@/sections/home/TechnologyPreview";
import { ServiceEcosystem } from "@/sections/home/ServiceEcosystem";
import { StatsBand } from "@/sections/shared/StatsBand";
import { ClientMarquee } from "@/sections/shared/ClientMarquee";
import { TestimonialsSection } from "@/sections/shared/TestimonialsSection";
import { CTASection } from "@/sections/shared/CTASection";
import { TRUST_METRICS, COMPANY_STATS } from "@/data/stats";
import { TESTIMONIALS } from "@/data/testimonials";
import { TRUST_LOGOS } from "@/constants/site";

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <StatsBand
        id="trust"
        stats={TRUST_METRICS}
        columns={4}
        variant="default"
        surface
      />

      <ClientMarquee items={TRUST_LOGOS} />

      <AboutPreview />
      <ProductsShowcase />
      <TechnologyPreview />
      <ServiceEcosystem />

      <StatsBand
        eyebrow="By the numbers"
        title="Performance you can measure"
        description="The intelligence inside every VERTIQ system shows up where it counts — in energy, in uptime and in time saved."
        stats={COMPANY_STATS}
        columns={4}
        variant="bordered"
      />

      <TestimonialsSection testimonials={TESTIMONIALS} />

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
