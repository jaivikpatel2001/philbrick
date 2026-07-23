import type { Metadata } from "next";
import { FiShield } from "react-icons/fi";
import { PageHeader } from "@/sections/shared/PageHeader";
import { ReleaseGate } from "@/components/release/ReleaseGate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import {
  PRIVACY_POLICY,
  PRIVACY_CONTACT_HEADING,
  PRIVACY_CONTACT_INTRO,
} from "@/data/legal";
import { SITE, gmailHref } from "@/constants/site";
import styles from "@/app/prose.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Philbrick Technologies India Pvt Limited collects, uses, retains and protects the personal data you submit through this website.",
  alternates: { canonical: "/privacy-policy" },
};

/* The opening paragraphs carry no heading on the client's page, so only the
   headed sections are numbered, and the Contact Us block continues the count. */
const INTRO = PRIVACY_POLICY.filter((s) => !s.heading);
const CLAUSES = PRIVACY_POLICY.filter((s) => s.heading).map((s, i) => ({
  ...s,
  index: String(i + 1).padStart(2, "0"),
}));
const CONTACT_INDEX = String(CLAUSES.length + 1).padStart(2, "0");

export default function PrivacyPolicyPage() {
  return (
    <ReleaseGate route="/privacy-policy" label="Privacy Policy">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy" },
        ])}
      />

      <PageHeader
        eyebrow="Privacy Policy"
        title="How we handle your personal data"
        description="We act as the data controller for the personal data you submit or disclose, and for personal data obtained through third parties."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />

      <section className="section">
        <div className={`container--prose ${styles.prose}`}>
          {INTRO.flatMap((section, i) =>
            section.paragraphs.map((p, j) => (
              <p
                key={`${i}-${j}`}
                className={i === 0 && j === 0 ? styles.lede : styles.para}
                data-reveal="up"
              >
                {p}
              </p>
            ))
          )}

          {CLAUSES.map((section) => (
            <div key={section.index} className={styles.clause} data-reveal="up">
              <span className={styles.clauseIndex}>{section.index}</span>
              <div className={styles.clauseBody}>
                <h2 className={styles.clauseHeading}>{section.heading}</h2>
                {section.paragraphs.map((p, j) => (
                  <p key={j} className={styles.para}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}

          {/* Final section: the client's contact details, from constants/site. */}
          <div className={styles.clause} data-reveal="up">
            <span className={styles.clauseIndex}>{CONTACT_INDEX}</span>
            <div className={styles.clauseBody}>
              <h2 className={styles.clauseHeading}>{PRIVACY_CONTACT_HEADING}</h2>
              <p className={styles.para}>{PRIVACY_CONTACT_INTRO}</p>
              <div className={styles.callout}>
                <span className={styles.calloutIcon}>
                  <FiShield />
                </span>
                <div>
                  <p className={styles.calloutLabel}>Email and helpline</p>
                  <div className={styles.calloutList}>
                    <a
                      className={styles.calloutValue}
                      href={gmailHref(SITE.email)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {SITE.email}
                    </a>
                    <a className={styles.calloutValue} href={SITE.phoneHref}>
                      {SITE.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className={styles.updated}>
            {SITE.legalName} · {SITE.address.line1}, {SITE.address.line2}
          </p>
        </div>
      </section>
    </ReleaseGate>
  );
}
