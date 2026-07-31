import type { Metadata } from "next";
import { PageHeader } from "@/sections/shared/PageHeader";
import { CTASection } from "@/sections/shared/CTASection";
import { ReleaseGate } from "@/components/release/ReleaseGate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { QUALITY_POLICY, QUALITY_PRINCIPLES } from "@/data/company";
import { SITE } from "@/constants/site";
import styles from "@/app/prose.module.css";

export const metadata: Metadata = {
  title: "Quality Policy",
  description:
    "Philbrick products and services constantly meet or exceed customer expectation. Each part undergoes stage wise and final inspection as per the Q.A. plan and Indian standard specification.",
  alternates: { canonical: "/quality-policy" },
};

export default function QualityPolicyPage() {
  return (
    <ReleaseGate route="/quality-policy" label="Quality Policy">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Quality Policy", path: "/quality-policy" },
        ])}
      />

      <PageHeader
        eyebrow="Quality Policy"
        title="Quality is checked at every stage, not at the end"
        description="Our quality plan governs order execution, procurement, inspection and dispatch, and the record is kept as per ISO certification."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Quality Policy" }]}
      />

      <section className="section">
        <div className={`container--prose ${styles.prose}`}>
          {/* Four principle highlights */}
          <div className={styles.principles} data-reveal="up">
            {QUALITY_PRINCIPLES.map((p) => (
              <div key={p.title} className={styles.principle}>
                <span className={styles.principleTitle}>{p.title}</span>
                <span className={styles.principleText}>{p.text}</span>
              </div>
            ))}
          </div>

          {/* Detailed policy sections (verbatim from the official page) */}
          {QUALITY_POLICY.map((section, i) => (
            <div key={section.heading} className={styles.clause} data-reveal="up">
              <span className={styles.clauseIndex}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={styles.clauseBody}>
                <h2 className={styles.clauseHeading}>{section.heading}</h2>
                <p className={styles.para}>{section.body}</p>
              </div>
            </div>
          ))}

          {/* Closing guarantee */}
          <div className={styles.badge} data-reveal="up">
            <span className={styles.badgeTitle}>100% Quality Guaranteed</span>
            <span className={styles.badgeMeta}>
              ISO Compliant • Stage-Wise Inspected • Certified Material
            </span>
          </div>

          <p className={styles.updated}>
            {SITE.legalName} · GST&nbsp;{SITE.gst} · CIN&nbsp;{SITE.cin}
          </p>
        </div>
      </section>

      <CTASection
        title="Ask us for the quality plan"
        description="We prepare and submit the quality plan for order execution, and keep the records and test certificates for every dispatch."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "About Philbrick", href: "/about" }}
      />
    </ReleaseGate>
  );
}
