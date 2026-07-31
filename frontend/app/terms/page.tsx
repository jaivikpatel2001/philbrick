import type { Metadata } from "next";
import { FiFileText } from "react-icons/fi";
import { PageHeader } from "@/sections/shared/PageHeader";
import { ReleaseGate } from "@/components/release/ReleaseGate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import {
  TERMS_OF_SERVICE,
  TERMS_CONTACT_HEADING,
  TERMS_CONTACT_INTRO,
} from "@/data/legal";
import { SITE, gmailHref } from "@/constants/site";
import styles from "@/app/prose.module.css";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms governing your access to and use of the philbrick website, product documentation, technical specifications and online services.",
  alternates: { canonical: "/terms" },
};

/* The opening paragraphs carry no heading, so only the headed sections are
   numbered, and the contact block continues the count. */
const INTRO = TERMS_OF_SERVICE.filter((s) => !s.heading);
const CLAUSES = TERMS_OF_SERVICE.filter((s) => s.heading).map((s, i) => ({
  ...s,
  index: String(i + 1).padStart(2, "0"),
}));
const CONTACT_INDEX = String(CLAUSES.length + 1).padStart(2, "0");

export default function TermsPage() {
  return (
    <ReleaseGate route="/terms" label="Terms & Conditions">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Terms & Conditions", path: "/terms" },
        ])}
      />

      <PageHeader
        eyebrow="Terms & Conditions"
        title="The terms for using our digital services"
        description="These Terms govern your access to and use of our website, product documentation, technical specifications and online services."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]}
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
                {section.list && (
                  <ul className={styles.list}>
                    {section.list.map((item) => (
                      <li key={item} className={styles.listItem}>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}

          {/* Final section: legal contact, from constants/site. */}
          <div className={styles.clause} data-reveal="up">
            <span className={styles.clauseIndex}>{CONTACT_INDEX}</span>
            <div className={styles.clauseBody}>
              <h2 className={styles.clauseHeading}>{TERMS_CONTACT_HEADING}</h2>
              <p className={styles.para}>{TERMS_CONTACT_INTRO}</p>
              <div className={styles.callout}>
                <span className={styles.calloutIcon}>
                  <FiFileText />
                </span>
                <div>
                  <p className={styles.calloutLabel}>Email and phone</p>
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
