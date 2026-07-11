import Link from "next/link";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { FOOTER_NAV } from "@/constants/navigation";
import { SITE, SOCIALS } from "@/constants/site";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { getIcon } from "@/lib/icons";
import styles from "./Footer.module.css";

/* Statutory identifiers (publicly displayed) — replaces unverifiable cert claims. */
const REGISTRY = [
  `GST ${SITE.gst}`,
  `CIN ${SITE.cin}`,
  `IEC ${SITE.iec}`,
];

export function Footer() {
  const year = 2026;
  return (
    <footer className={styles.footer}>
      <div className="container--wide">
        {/* Oversized closing wordmark — the site signs its name */}
        <p className={styles.wordmark} aria-hidden>
          PHILBRICK<span className={styles.wordmarkDot}>.</span>
        </p>

        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo />
            <p className={styles.tagline}>
              Providing elevator solutions since {SITE.founded} — control
              panels, safety devices, doors, cabins and signalling, engineered
              in-house in Ahmedabad, India.
            </p>

            <div className={styles.newsletter}>
              <p className={styles.newsTitle}>Stay updated</p>
              <NewsletterForm />
            </div>

            <ul className={styles.contact}>
              <li>
                <FiMapPin />
                <span>
                  {SITE.address.line1}, {SITE.address.line2}
                </span>
              </li>
              <li>
                <FiPhone />
                <a href={SITE.phoneHref}>{SITE.phone}</a>
              </li>
              <li>
                <FiMail />
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </li>
            </ul>
          </div>

          <nav className={styles.columns} aria-label="Footer">
            {FOOTER_NAV.map((col) => (
              <div key={col.title} className={styles.column}>
                <p className={styles.colTitle}>{col.title}</p>
                <ul>
                  {col.links.map((link) => (
                    <li key={`${col.title}-${link.label}`}>
                      <Link href={link.href} className={styles.link}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className={styles.certs}>
          {REGISTRY.map((c) => (
            <span key={c} className={styles.cert}>
              {c}
            </span>
          ))}
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {year} {SITE.legalName}. All rights reserved.
          </p>

          {SOCIALS.length > 0 && (
            <div className={styles.social}>
              {SOCIALS.map((s) => {
                const Icon = getIcon(s.icon);
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    className={styles.socialLink}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
          )}

          <p className={styles.legalNote}>{SITE.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
