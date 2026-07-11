import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/sections/shared/PageHero";
import { FeatureGrid } from "@/sections/shared/FeatureGrid";
import { CTASection } from "@/sections/shared/CTASection";
import { StatsBand } from "@/sections/shared/StatsBand";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stats } from "@/components/ui/Stats";
import { TeamCard } from "@/components/cards/TeamCard";
import { ReleaseGate } from "@/components/release/ReleaseGate";
import { ABOUT_STORY, VALUES, INFRASTRUCTURE, LEADERSHIP } from "@/data/company";
import { TRUST_METRICS, GLOBAL_STATS } from "@/data/stats";
import { MISC } from "@/data/images";
import { JsonLd } from "@/components/seo/JsonLd";
import { aboutPageSchema, leadershipSchema, breadcrumbSchema } from "@/lib/schema";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Founded in 1992 in Ahmedabad, Philbrick Technologies manufactures elevator control panels, safety devices, doors, cabins and signalling, engineered in-house.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <ReleaseGate route="/about" label="About Us">
      <JsonLd data={aboutPageSchema()} />
      <JsonLd data={leadershipSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />

      <PageHero
        eyebrow="Our story"
        title="Elevator solutions, engineered in Ahmedabad since 1992"
        description="From control panels to the Automatic Rescue Device, Philbrick has spent three decades building the systems that make elevators run, all under one roof."
        image={MISC.factory}
        imageAlt="Philbrick engineering facility"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About" }]}
        stats={TRUST_METRICS.slice(0, 3)}
      />

      {/* Story */}
      <section className="section">
        <div className={`container--wide ${styles.story}`}>
          <div className={styles.storyText}>
            <span className="eyebrow" data-reveal="up">
              Who we are
            </span>
            {ABOUT_STORY.map((p, i) => (
              <p
                key={i}
                className={i === 0 ? styles.lede : styles.para}
                data-reveal="up"
              >
                {p}
              </p>
            ))}
          </div>
          <div className={styles.storyMedia} data-reveal="right">
            <Image
              src={MISC.lobby}
              alt="Philbrick elevator interior"
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              className={styles.storyImg}
            />
          </div>
        </div>
      </section>

      {/* Infrastructure preview */}
      <section className="section">
        <div className="container--wide">
          <FeatureGrid
            eyebrow="Infrastructure"
            title="Manufacturing & engineering, built in-house"
            description="Dedicated units for procurement, design, quality control, warehousing and packaging keep quality and lead time in our own hands."
            align="center"
            columns={3}
            features={INFRASTRUCTURE}
          />
          <div className={styles.infraStats}>
            <Stats stats={GLOBAL_STATS} columns={4} variant="bordered" />
          </div>
          <p className={styles.infraLink}>
            <Link href="/infrastructure">Explore our infrastructure →</Link>
          </p>
        </div>
      </section>

      {/* Values */}
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

      {/* Leadership */}
      <section className="section">
        <div className="container--wide">
          <SectionHeader
            eyebrow="Leadership"
            title="The people behind Philbrick"
            description="Guided by our founder and led by a team focused on quality, safety and service."
            align="center"
          />
          <div className={styles.team}>
            {LEADERSHIP.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>

      <StatsBand stats={TRUST_METRICS} columns={4} variant="default" surface />

      <CTASection
        title="Build with Philbrick"
        description="Whether you're specifying components or exploring a partnership, we'd like to talk."
        primary={{ label: "Get in touch", href: "/contact" }}
        secondary={{ label: "Our products", href: "/products" }}
      />
    </ReleaseGate>
  );
}
