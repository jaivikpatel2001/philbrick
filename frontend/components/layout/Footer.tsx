import Link from "next/link";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import { FOOTER_NAV } from "@/constants/navigation";
import { SITE, SOCIALS, gmailHref, telHref } from "@/constants/site";
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
              Providing elevator solutions since {SITE.founded}: control
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
              {/* Every number the client publishes, each labelled with what it
                  is for: the helpline to call, the WhatsApp line to chat on,
                  then the office lines, plus the office hours. */}
              <li>
                <FiPhone />
                <span className={styles.contactList}>
                  {SITE.phones.map((p) => (
                    <span key={p.number} className={styles.contactRow}>
                      <span className={styles.contactTag}>{p.label}</span>
                      <a href={telHref(p.number)}>{p.number}</a>
                      {p.whatsapp && (
                        <a
                          className={styles.chatLink}
                          href={SITE.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaWhatsapp aria-hidden /> Or chat on WhatsApp
                        </a>
                      )}
                    </span>
                  ))}
                  <span className={styles.hours}>{SITE.hours}</span>
                </span>
              </li>
              {/* Categorised inboxes: sales, general, careers and the client's
                  alternate address, so mail reaches the right desk. */}
              <li>
                <FiMail />
                <span className={styles.contactList}>
                  {SITE.emails.map((e) => (
                    <span key={e.address} className={styles.contactRow}>
                      <span className={styles.contactTag}>{e.label}</span>
                      <a
                        href={gmailHref(e.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {e.address}
                      </a>
                    </span>
                  ))}
                </span>
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
            © {year} {SITE.legalName} All rights reserved.
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

        {/* Agency credit, as on the client's WordPress footer. A single slow
            shimmer travels across the studio name, so the line reads as a
            considered detail rather than an advert. */}
        <p className={styles.credit}>
          <span className={styles.creditLabel}>Designed &amp; Developed by</span>{" "}
          <a
            className={styles.creditLink}
            href="https://mediaradical.in/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.creditName}>Media Radical</span>
          </a>
        </p>
      </div>
    </footer>
  );
}
