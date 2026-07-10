import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/sections/shared/PageHero";
import { FeatureGrid } from "@/sections/shared/FeatureGrid";
import { CTASection } from "@/sections/shared/CTASection";
import { StatsBand } from "@/sections/shared/StatsBand";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Stats } from "@/components/ui/Stats";
import { Timeline } from "@/components/ui/Timeline";
import { TeamCard } from "@/components/cards/TeamCard";
import {
  MISSION,
  VISION,
  ABOUT_STORY,
  VALUES,
  INFRASTRUCTURE,
  TIMELINE,
  LEADERSHIP,
} from "@/data/company";
import { TRUST_METRICS, GLOBAL_STATS } from "@/data/stats";
import { HERO, MISC } from "@/data/images";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "Fifty-seven years of engineering vertical mobility. Meet the people, values and milestones behind VERTIQ.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        title="Moving the world upward since 1968"
        description="From a single workshop to 1.4 million units across six continents, built on one engineering obsession that never changed."
        image={HERO.about}
        imageAlt="VERTIQ building atrium"
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
              src={MISC.factory}
              alt="VERTIQ engineering facility"
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              className={styles.storyImg}
            />
          </div>
        </div>
      </section>

      {/* Infrastructure & Manufacturing capabilities */}
      <section className="section">
        <div className="container--wide">
          <FeatureGrid
            eyebrow="Infrastructure"
            title="Manufacturing & engineering, built in-house"
            description="From raw steel to a commissioned car, VERTIQ controls every stage of the build, so quality, safety and lead time never leave our hands."
            align="center"
            columns={3}
            features={INFRASTRUCTURE}
          />
          <div className={styles.infraStats}>
            <Stats stats={GLOBAL_STATS} columns={4} variant="bordered" />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={`section ${styles.mvSection}`}>
        <div className="container--wide">
          <div className={styles.mv}>
            <div className={styles.mvCard} data-reveal="up">
              <span className="eyebrow">Mission</span>
              <p>{MISSION}</p>
            </div>
            <div className={styles.mvCard} data-reveal="up">
              <span className="eyebrow">Vision</span>
              <p>{VISION}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section">
        <div className="container--wide">
          <FeatureGrid
            eyebrow="What we believe"
            title="Six values, one standard"
            description="The principles that guide every decision, in every country, on every project."
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

      {/* Timeline */}
      <section className={`section ${styles.mvSection}`}>
        <div className="container--narrow">
          <SectionHeader
            eyebrow="The journey"
            title="Five decades of firsts"
            align="center"
          />
          <Timeline items={TIMELINE} />
        </div>
      </section>

      {/* Leadership */}
      <section className="section">
        <div className="container--wide">
          <SectionHeader
            eyebrow="Leadership"
            title="The people moving us forward"
            description="An engineering-led team accountable for safety, technology and service across 40 countries."
          />
          <div className={styles.team}>
            {LEADERSHIP.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>

      <StatsBand
        stats={TRUST_METRICS}
        columns={4}
        variant="default"
        surface
      />

      <CTASection
        title="Build the future of mobility with us"
        description="Whether you're specifying a project or exploring a partnership, we'd love to talk."
        primary={{ label: "Get in touch", href: "/contact" }}
        secondary={{ label: "Our products", href: "/products" }}
      />
    </>
  );
}
