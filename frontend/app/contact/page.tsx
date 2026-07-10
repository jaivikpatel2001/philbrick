import type { Metadata } from "next";
import { FiPhone, FiMail, FiMapPin, FiClock, FiAlertCircle } from "react-icons/fi";
import { PageHero } from "@/sections/shared/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { SITE } from "@/constants/site";
import { HERO } from "@/data/images";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to a VERTIQ specialist about new installations, maintenance, modernization or partnership. 24/7 service worldwide.",
  alternates: { canonical: "/contact" },
};

const METHODS = [
  {
    icon: FiPhone,
    label: "Call sales",
    value: SITE.phone,
    href: SITE.phoneHref,
  },
  {
    icon: FiMail,
    label: "Email us",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  },
  {
    icon: FiMapPin,
    label: "Visit HQ",
    value: `${SITE.address.line1}, ${SITE.address.line2}`,
  },
  { icon: FiClock, label: "Hours", value: SITE.hours },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's build upward, together"
        description="Tell us about your building and a VERTIQ specialist will respond within one business day."
        image={HERO.contact}
        imageAlt="A building façade at night"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="section">
        <div className={`container--wide ${styles.layout}`}>
          {/* Left: info */}
          <div className={styles.info}>
            <div className={styles.methods}>
              {METHODS.map((m) => {
                const Inner = (
                  <>
                    <span className={styles.methodIcon}>
                      <m.icon />
                    </span>
                    <span>
                      <span className={styles.methodLabel}>{m.label}</span>
                      <span className={styles.methodValue}>{m.value}</span>
                    </span>
                  </>
                );
                return m.href ? (
                  <a key={m.label} href={m.href} className={styles.method}>
                    {Inner}
                  </a>
                ) : (
                  <div key={m.label} className={styles.method}>
                    {Inner}
                  </div>
                );
              })}
            </div>

            <div className={styles.emergency}>
              <FiAlertCircle />
              <div>
                <p className={styles.emTitle}>24/7 emergency service</p>
                <a href={`tel:${SITE.emergency.replace(/\s/g, "")}`}>
                  {SITE.emergency}
                </a>
              </div>
            </div>

            <p className={styles.note}>
              Prefer to talk to a local team? VERTIQ operates in 40+ countries
              with over 320 service branches. Your enquiry is routed to the
              nearest office.
            </p>
          </div>

          {/* Right: form */}
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Request a consultation</h2>
            <p className={styles.formSub}>
              Fields marked <span className={styles.req}>*</span> are required.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
