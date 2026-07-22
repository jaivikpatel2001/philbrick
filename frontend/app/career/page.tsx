import type { Metadata } from "next";
import { FiMail } from "react-icons/fi";
import { PageHeader } from "@/sections/shared/PageHeader";
import { FeatureGrid } from "@/sections/shared/FeatureGrid";
import { CTASection } from "@/sections/shared/CTASection";
import { ReleaseGate } from "@/components/release/ReleaseGate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { CAREER_CONTENT, CAREER_CTA, VALUES } from "@/data/company";
import { SITE, gmailHref } from "@/constants/site";
import styles from "@/app/prose.module.css";

export const metadata: Metadata = {
  title: "Career",
  description:
    "Work at Philbrick Technologies (India) Pvt. Ltd. in Ahmedabad. A family where every person and their ideas are treated equally, with training programmes at various levels.",
  alternates: { canonical: "/career" },
};

export default function CareerPage() {
  return (
    <ReleaseGate route="/career" label="Career">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Career", path: "/career" },
        ])}
      />

      <PageHeader
        eyebrow="Career"
        title="Build a career where ideas count"
        description="There is always something happening at Philbrick that keeps the passion flowing. If that sounds like you, we would like to read your resume."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Career" }]}
      />

      <section className="section">
        <div className={`container--prose ${styles.prose}`}>
          {CAREER_CONTENT.map((p, i) => (
            <p key={i} className={i === 0 ? styles.lede : styles.para} data-reveal="up">
              {p}
            </p>
          ))}

          {/* The client's own call to action, with the real HR inbox. */}
          <div className={styles.callout} data-reveal="up">
            <span className={styles.calloutIcon}>
              <FiMail />
            </span>
            <div>
              <p className={styles.calloutLabel}>{CAREER_CTA}</p>
              <a
                className={styles.calloutValue}
                href={gmailHref(SITE.careersEmail)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {SITE.careersEmail}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container--wide">
          <FeatureGrid
            eyebrow="What we believe"
            title="The values behind the work"
            description="The principles that guide how we design, build and support elevator components, and how we work with each other."
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
        title="Questions before you apply?"
        description="Talk to the Philbrick team about roles, training programmes and life at our Ahmedabad facility."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "About us", href: "/about" }}
      />
    </ReleaseGate>
  );
}
