import type { Metadata } from "next";
import { PageHero } from "@/sections/shared/PageHero";
import { CTASection } from "@/sections/shared/CTASection";
import { ClientMarquee } from "@/sections/shared/ClientMarquee";
import { StatsBand } from "@/sections/shared/StatsBand";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TestimonialCard } from "@/components/cards/TestimonialCard";
import { TESTIMONIALS } from "@/data/testimonials";
import { TRUST_METRICS } from "@/data/stats";
import { TRUST_LOGOS } from "@/constants/site";
import { HERO } from "@/data/images";
import styles from "./testimonials.module.css";

export const metadata: Metadata = {
  title: "Client Testimonials",
  description:
    "From supertall towers to critical-care hospitals, hear why the world's most demanding buildings run on VERTIQ.",
  alternates: { canonical: "/testimonials" },
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Client voices"
        title="Trusted where it matters most"
        description="Developers, operators and architects choose VERTIQ for the engineering — and stay for the service. Here's what they say."
        image={HERO.about}
        imageAlt="A luminous building atrium"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Testimonials" }]}
        stats={[
          { value: 98, suffix: "%", label: "Contract renewal" },
          { value: 4.9, decimals: 1, suffix: "/5", label: "Client satisfaction" },
          { value: 180, suffix: "+", label: "Hotels & operators" },
        ]}
      />

      <section className="section">
        <div className="container--wide">
          <SectionHeader
            eyebrow="In their words"
            title="Real buildings, real results"
            align="center"
          />
          <div className={styles.wall}>
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={i} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      <section className="section--sm">
        <ClientMarquee
          label="Delivered for the world's leading developers, operators and architects"
          items={TRUST_LOGOS}
        />
      </section>

      <StatsBand
        eyebrow="The track record"
        title="Numbers our clients rely on"
        stats={TRUST_METRICS}
        columns={4}
        variant="bordered"
        surface
      />

      <CTASection
        title="Join the buildings that move on VERTIQ"
        description="Tell us about your project and discover why our clients stay with us for decades."
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "Explore products", href: "/products" }}
      />
    </>
  );
}
