import type { Metadata } from "next";
import { PageHero } from "@/sections/shared/PageHero";
import { FeatureGrid } from "@/sections/shared/FeatureGrid";
import { CTASection } from "@/sections/shared/CTASection";
import { ReleaseGate } from "@/components/release/ReleaseGate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { MISSION, VISION, VALUES } from "@/data/company";
import { HERO } from "@/data/images";
import styles from "@/app/company.module.css";

export const metadata: Metadata = {
  title: "Vision & Mission",
  description:
    "The mission and vision behind Philbrick Technologies: dependable elevator control, safety and signalling systems, engineered in-house.",
  alternates: { canonical: "/vision-mission" },
};

export default function VisionMissionPage() {
  return (
    <ReleaseGate route="/vision-mission" label="Vision & Mission">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: "Vision & Mission", path: "/vision-mission" },
        ])}
      />

      <PageHero
        eyebrow="About"
        title="Vision & Mission"
        description="What we set out to do, and where we're heading: the thinking behind every panel, door and safety device we build."
        image={HERO.about}
        imageAlt="Philbrick engineering"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Vision & Mission" },
        ]}
      />

      <section className="section">
        <div className="container--wide">
          <div className={styles.mvGrid}>
            <article className={styles.mvCard} data-reveal="up">
              <span className="eyebrow">Our mission</span>
              <p>{MISSION}</p>
            </article>
            <article className={styles.mvCard} data-reveal="up">
              <span className="eyebrow">Our vision</span>
              <p>{VISION}</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container--wide">
          <FeatureGrid
            eyebrow="What we believe"
            title="The values behind the work"
            description="The principles that guide how we design, build and support elevator components."
            align="center"
            columns={3}
            features={VALUES.map((v) => ({
              iconName: v.iconName,
              title: v.title,
              description: v.description,
            }))}
          />
        </div>
      </section>

      <CTASection
        title="Build with Philbrick"
        description="Talk to us about elevator control, safety and signalling for your project."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "About us", href: "/about" }}
      />
    </ReleaseGate>
  );
}
