import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/sections/shared/PageHero";
import { FeatureGrid } from "@/sections/shared/FeatureGrid";
import { StatsBand } from "@/sections/shared/StatsBand";
import { CTASection } from "@/sections/shared/CTASection";
import { ReleaseGate } from "@/components/release/ReleaseGate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { INFRASTRUCTURE } from "@/data/company";
import { GLOBAL_STATS } from "@/data/stats";
import { HERO, MISC } from "@/data/images";
import styles from "@/app/about/about.module.css";

export const metadata: Metadata = {
  title: "Infrastructure",
  description:
    "Philbrick's in-house infrastructure — manufacturing, design & R&D, quality control, procurement and warehousing at our Ahmedabad facility.",
  alternates: { canonical: "/infrastructure" },
};

export default function InfrastructurePage() {
  return (
    <ReleaseGate route="/infrastructure" label="Infrastructure">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Infrastructure", path: "/infrastructure" },
        ])}
      />

      <PageHero
        eyebrow="Capability"
        title="Built in-house, end to end"
        description="From procurement and design to manufacturing, quality control and dispatch — Philbrick controls every stage of the build at its Ahmedabad facility."
        image={HERO.services}
        imageAlt="Philbrick manufacturing facility"
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Infrastructure" },
        ]}
      />

      {/* Intro */}
      <section className="section">
        <div className={`container--wide ${styles.story}`}>
          <div className={styles.storyText}>
            <span className="eyebrow" data-reveal="up">
              Under one roof
            </span>
            <p className={styles.lede} data-reveal="up">
              Doing the work ourselves is how we keep quality consistent.
            </p>
            <p className={styles.para} data-reveal="up">
              Philbrick&apos;s Ahmedabad facility brings together dedicated units
              for procurement, design and R&amp;D, manufacturing, quality control,
              warehousing and packaging. Controlling each stage — rather than
              outsourcing it — is what lets us hold fit, finish and function to a
              consistent standard, support both new installations and
              modernisation, and keep lead times in our own hands.
            </p>
          </div>
          <div className={styles.storyMedia} data-reveal="right">
            <Image
              src={MISC.factory}
              alt="Philbrick engineering facility"
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              className={styles.storyImg}
            />
          </div>
        </div>
      </section>

      {/* Capability grid */}
      <section className="section">
        <div className="container--wide">
          <FeatureGrid
            eyebrow="Infrastructure"
            title="Manufacturing & engineering, in-house"
            description="The dedicated units behind every Philbrick product."
            align="center"
            columns={3}
            features={INFRASTRUCTURE}
          />
        </div>
      </section>

      <StatsBand
        eyebrow="At a glance"
        title="Our capability, in numbers"
        stats={GLOBAL_STATS}
        columns={4}
        variant="bordered"
        align="left"
        surface
      />

      <CTASection
        title="See what we can build for you"
        description="Talk to Philbrick about elevator control, safety, doors, cabins and signalling."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Our products", href: "/products" }}
      />
    </ReleaseGate>
  );
}
