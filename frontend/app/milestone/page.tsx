import type { Metadata } from "next";
import { PageHero } from "@/sections/shared/PageHero";
import { CTASection } from "@/sections/shared/CTASection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Timeline } from "@/components/ui/Timeline";
import { ReleaseGate } from "@/components/release/ReleaseGate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { TIMELINE } from "@/data/company";
import { HERO } from "@/data/images";
import styles from "@/app/company.module.css";

export const metadata: Metadata = {
  title: "Milestone & Awards",
  description:
    "Key milestones in Philbrick Technologies' journey since 1992: from founding in Ahmedabad to a complete elevator-component range.",
  alternates: { canonical: "/milestone" },
};

export default function MilestonePage() {
  return (
    <ReleaseGate route="/milestone" label="Milestone & Awards">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: "Milestone & Awards", path: "/milestone" },
        ])}
      />

      <PageHero
        eyebrow="About"
        title="Milestone & Awards"
        description="The moments that shaped Philbrick Technologies, from a founding conviction in 1992 to a full elevator-component range."
        image={HERO.milestone}
        imageAlt="Elevator control panel under test on a calibration rig"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Milestone & Awards" },
        ]}
      />

      <section className="section">
        <div className="container--narrow">
          <SectionHeader
            eyebrow="Our journey"
            title="Milestones since 1992"
            align="center"
          />
          <Timeline items={TIMELINE} />
          <p className={styles.note}>
            Recognitions and certifications will be published here as they are
            formally documented. We prefer to show verified achievements rather
            than placeholders.
          </p>
        </div>
      </section>

      <CTASection
        title="Grow with Philbrick"
        description="Partner with an elevator-component manufacturer that builds to a consistent standard."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Our products", href: "/products" }}
      />
    </ReleaseGate>
  );
}
