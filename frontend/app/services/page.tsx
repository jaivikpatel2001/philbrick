import type { Metadata } from "next";
import { PageHero } from "@/sections/shared/PageHero";
import { TechShowcase } from "@/sections/shared/TechShowcase";
import { FeatureGrid } from "@/sections/shared/FeatureGrid";
import { CTASection } from "@/sections/shared/CTASection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { Stats } from "@/components/ui/Stats";
import { SERVICES } from "@/data/services";
import { HERO } from "@/data/images";
import styles from "./services.module.css";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Installation, predictive maintenance, modernization and AMC — VERTIQ covers the entire lifecycle of your vertical transport.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Lifecycle services"
        title="We don't just install. We stay."
        description="An elevator lasts decades — and so should the relationship behind it. From first survey to predictive care, VERTIQ covers the whole lifecycle."
        image={HERO.services}
        imageAlt="VERTIQ field engineers at work"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Services" }]}
        stats={[
          { value: 99.9, decimals: 1, suffix: "%", label: "Fleet uptime" },
          { value: 30, suffix: " min", label: "Entrapment response" },
          { value: 24, suffix: "/7", label: "Command centre" },
        ]}
      />

      <section className="section">
        <div className="container--wide">
          <SectionHeader
            eyebrow="The ecosystem"
            title="Four services, one promise: keep you moving"
            description="Whether you're building new, maintaining, upgrading or contracting cover, there's a VERTIQ service designed for it."
            align="center"
          />
          <div className={styles.cards}>
            {SERVICES.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </div>
      </section>

      {SERVICES.map((service, i) => {
        const first = service.stats?.[0];
        const badge = first
          ? {
              value: `${first.prefix ?? ""}${first.value}${first.suffix ?? ""}`,
              label: first.label,
            }
          : undefined;
        return (
          <section
            key={service.slug}
            id={service.slug}
            className={`section ${i % 2 === 1 ? styles.alt : ""}`}
          >
            <div className="container--wide">
              <TechShowcase
                eyebrow={service.shortName}
                title={service.name}
                description={service.description}
                image={service.heroImage}
                imageAlt={service.name}
                badge={badge}
                features={service.benefits}
                reverse={i % 2 === 1}
              />

              {service.process && (
                <div className={styles.process}>
                  <FeatureGrid
                    columns={4}
                    variant="numbered"
                    features={service.process.map((p) => ({
                      title: p.title,
                      description: p.description,
                    }))}
                  />
                </div>
              )}

              {service.stats && (
                <div className={styles.stats}>
                  <Stats stats={service.stats} columns={3} variant="bordered" />
                </div>
              )}
            </div>
          </section>
        );
      })}

      <CTASection
        title="Let's keep your building moving"
        description="From a single lift to a global portfolio, our service teams are ready. Tell us what you need."
        primary={{ label: "Talk to our service team", href: "/contact" }}
        secondary={{ label: "Explore products", href: "/products" }}
      />
    </>
  );
}
