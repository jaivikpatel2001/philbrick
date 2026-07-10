import Link from "next/link";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { FOOTER_NAV } from "@/constants/navigation";
import { SITE, SOCIALS } from "@/constants/site";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { getIcon } from "@/lib/icons";
import styles from "./Footer.module.css";

const CERTS = ["ISO 9001", "ISO 14001", "EN 81-20/50", "LEED Platinum"];

export function Footer() {
  const year = 2026;
  return (
    <footer className={styles.footer}>
      <div className="container--wide">
        {/* Oversized closing wordmark — the site signs its name */}
        <p className={styles.wordmark} aria-hidden>
          VERTIQ<span className={styles.wordmarkDot}>.</span>
        </p>

        <div className={styles.top}>
          <div className={styles.brand}>
            <Logo />
            <p className={styles.tagline}>
              Designing the vertical mobility of the world&apos;s most ambitious
              buildings since {SITE.founded}.
            </p>

            <div className={styles.newsletter}>
              <p className={styles.newsTitle}>Get the VERTIQ briefing</p>
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
                    <li key={link.href}>
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
          {CERTS.map((c) => (
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

          <p className={styles.legalNote}>
            {SITE.tagline} · ISO 9001 &amp; EN 81-20 certified
          </p>
        </div>
      </div>
    </footer>
  );
}
