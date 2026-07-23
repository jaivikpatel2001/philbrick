import type { Metadata } from "next";
import { PageHeader } from "@/sections/shared/PageHeader";
import { CTASection } from "@/sections/shared/CTASection";
import { ReleaseGate } from "@/components/release/ReleaseGate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { QUALITY_POLICY } from "@/data/company";
import { SITE } from "@/constants/site";
import styles from "@/app/prose.module.css";

export const metadata: Metadata = {
  title: "Quality Policy",
  description:
    "Philbrick Technologies products and services constantly meet or exceed customer expectation. Each part undergoes stage wise and final inspection as per the Q.A. plan and Indian standard specification.",
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
          {QUALITY_POLICY.map((p, i) => (
            <div key={i} className={styles.clause} data-reveal="up">
              <span className={styles.clauseIndex}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className={styles.clauseBody}>
                <p className={styles.para}>{p}</p>
              </div>
            </div>
          ))}
          <p className={styles.updated}>
            Philbrick Technologies (India) Pvt. Ltd. · GST&nbsp;{SITE.gst} ·
            CIN&nbsp;{SITE.cin}
          </p>
        </div>
      </section>

      <CTASection
        title="Ask us for the quality plan"
        description="We prepare and submit the quality plan for order execution, and keep the records and test certificates for every dispatch."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Our infrastructure", href: "/infrastructure" }}
      />
    </ReleaseGate>
  );
}
