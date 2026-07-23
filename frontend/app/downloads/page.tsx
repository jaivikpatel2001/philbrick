import type { Metadata } from "next";
import { FiDownload, FiFileText, FiInbox } from "react-icons/fi";
import { PageHeader } from "@/sections/shared/PageHeader";
import { CTASection } from "@/sections/shared/CTASection";
import { Button } from "@/components/ui/Button";
import { ReleaseGate } from "@/components/release/ReleaseGate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { DOWNLOADS, DOWNLOADS_EMPTY } from "@/data/downloads";
import styles from "./downloads.module.css";

export const metadata: Metadata = {
  title: "Downloads",
  description:
    "Product brochures and catalogues from Philbrick Technologies, including the STEP brochure for the integrated elevator controller range.",
  alternates: { canonical: "/downloads" },
};

export default function DownloadsPage() {
  return (
    <ReleaseGate route="/downloads" label="Downloads">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Downloads", path: "/downloads" },
        ])}
      />

      <PageHeader
        eyebrow="Downloads"
        title="Brochures and catalogues"
        description="Everything Philbrick publishes for download, in one place. Need a datasheet that is not listed? Ask us and we will send it."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Downloads" }]}
      />

      <section className="section">
        <div className="container--wide">
          {DOWNLOADS.length > 0 ? (
            <ul className={styles.list}>
              {DOWNLOADS.map((d, i) => (
                <li key={d.href} className={styles.item} data-reveal="up">
                  <span className={styles.index}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.icon}>
                    <FiFileText />
                  </span>
                  <div className={styles.body}>
                    <h2 className={styles.title}>{d.title}</h2>
                    <p className={styles.desc}>{d.description}</p>
                  </div>
                  <span className={styles.format}>{d.format}</span>
                  <a
                    className={styles.action}
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <FiDownload aria-hidden />
                    <span>Download</span>
                    <span className="sr-only"> {d.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>
                <FiInbox />
              </span>
              {DOWNLOADS_EMPTY.map((line, i) => (
                <p key={i} className={i === 0 ? styles.emptyTitle : styles.desc}>
                  {line}
                </p>
              ))}
              <div className={styles.emptyAction}>
                <Button href="/contact" withArrow>
                  Ask us for a document
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      <CTASection
        title="Need a specific datasheet?"
        description="Tell us which product you are specifying and we will send the documentation you need."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Browse products", href: "/products" }}
      />
    </ReleaseGate>
  );
}
