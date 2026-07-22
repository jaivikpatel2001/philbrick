import type { Metadata } from "next";
import { FiPhone, FiMail, FiMapPin, FiClock, FiUser } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import { PageHero } from "@/sections/shared/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { FAQSection } from "@/sections/shared/FAQSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { ReleaseGate } from "@/components/release/ReleaseGate";
import { JsonLd } from "@/components/seo/JsonLd";
import { contactPageSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { CONTACT_FAQS } from "@/data/faqs";
import { SITE, gmailHref, telHref } from "@/constants/site";
import { HERO } from "@/data/images";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to Philbrick Technologies about elevator control panels, ARD, door operators, cabins, displays and components. Based in Ahmedabad, Gujarat.",
  alternates: { canonical: "/contact" },
};

/* Every number and inbox the company publishes, grouped by what it is for, so
   a visitor knows exactly which line to call, which to chat on and which desk
   to write to. Data lives in constants/site.ts. */
type Method = {
  icon: typeof FiPhone;
  label: string;
  value: string;
  note?: string;
  href?: string;
};

const PHONE_METHODS: Method[] = SITE.phones.map((p) => ({
  icon: p.whatsapp ? FaWhatsapp : FiPhone,
  label: p.label,
  value: p.number,
  note: p.purpose,
  href: telHref(p.number),
}));

const EMAIL_METHODS: Method[] = SITE.emails.map((e) => ({
  icon: FiMail,
  label: e.label,
  value: e.address,
  note: e.purpose,
  href: gmailHref(e.address),
}));

const VISIT_METHODS: Method[] = [
  {
    icon: FiMapPin,
    label: "Address",
    value: `${SITE.address.line1}, ${SITE.address.line2}`,
    note: "Manufacturing facility and head office",
    href: SITE.mapUrl,
  },
  {
    icon: FiClock,
    label: "Hours",
    value: SITE.hours,
    note: "Indian Standard Time",
  },
];

function MethodList({ methods }: { methods: Method[] }) {
  return (
    <div className={styles.methods}>
      {methods.map((m) => {
        const Inner = (
          <>
            <span className={styles.methodIcon}>
              <m.icon />
            </span>
            <span>
              <span className={styles.methodLabel}>{m.label}</span>
              <span className={styles.methodValue}>{m.value}</span>
              {m.note && <span className={styles.methodNote}>{m.note}</span>}
            </span>
          </>
        );
        return m.href ? (
          <a
            key={m.label + m.value}
            href={m.href}
            className={styles.method}
            {...(m.href.startsWith("http")
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {Inner}
          </a>
        ) : (
          <div key={m.label + m.value} className={styles.method}>
            {Inner}
          </div>
        );
      })}
    </div>
  );
}

export default function ContactPage() {
  return (
    <ReleaseGate route="/contact" label="Contact">
      <JsonLd data={contactPageSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <JsonLd data={faqSchema(CONTACT_FAQS)} />

      <PageHero
        eyebrow="Contact"
        title="Let's talk elevators"
        description="Tell us about your requirement and the Philbrick team will get back to you. We're based in Ahmedabad and supply across India and export markets."
        image={HERO.contact}
        imageAlt="Philbrick headquarters building facade at dusk"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <section className="section">
        <div className={`container--wide ${styles.layout}`}>
          {/* Left: info */}
          <div className={styles.info}>
            {/* Phone lines — helpline first, then the WhatsApp line and the
                office numbers, each saying what it is for. */}
            <div className={styles.group}>
              <p className={styles.groupTitle}>Call or chat</p>
              <MethodList methods={PHONE_METHODS} />
              <a
                href={SITE.whatsappUrl}
                className={styles.chatCta}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaWhatsapp aria-hidden />
                Chat on WhatsApp · {SITE.whatsappDisplay}
              </a>
            </div>

            {/* Inboxes by department: sales, general, careers, alternate. */}
            <div className={styles.group}>
              <p className={styles.groupTitle}>Email the right desk</p>
              <MethodList methods={EMAIL_METHODS} />
            </div>

            <div className={styles.group}>
              <p className={styles.groupTitle}>Visit us</p>
              <MethodList methods={VISIT_METHODS} />
            </div>

            <div className={styles.group}>
              <p className={styles.groupTitle}>Speak to a person</p>
              <div className={styles.methods}>
                {SITE.contacts.map((c) => (
                  <div key={c.name} className={styles.method}>
                    <span className={styles.methodIcon}>
                      <FiUser />
                    </span>
                    <span>
                      <span className={styles.methodLabel}>{c.name}</span>
                      <span className={styles.methodValue}>{c.role}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <p className={styles.note}>
              Philbrick Technologies (India) Pvt. Ltd. supplies elevator components
              across India and exports to markets including China and Taiwan.
              GST&nbsp;{SITE.gst} · CIN&nbsp;{SITE.cin}
            </p>
          </div>

          {/* Right: form */}
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>Send us an enquiry</h2>
            <p className={styles.formSub}>
              Fields marked <span className={styles.req}>*</span> are required.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Embedded map (verified Ahmedabad location) */}
      <section className={`section ${styles.mapSection}`}>
        <div className="container--wide">
          <SectionHeader
            eyebrow="Find us"
            title="Visit our Ahmedabad facility"
            description={`${SITE.address.line1}, ${SITE.address.line2}`}
            align="center"
          />
          <div className={styles.mapWrap}>
            <iframe
              title="Philbrick Technologies location on Google Maps"
              className={styles.map}
              src={`https://maps.google.com/maps?q=${SITE.geo.lat},${SITE.geo.lng}&z=15&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className={styles.mapActions}>
            <Button
              href={`https://www.google.com/maps/dir/?api=1&destination=${SITE.geo.lat},${SITE.geo.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              withArrow
            >
              Get directions
            </Button>
            <Button
              href={SITE.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
            >
              Open in Google Maps
            </Button>
          </div>
        </div>
      </section>

      {/* Enquiry process — visible Q&A mirrored in FAQPage structured data */}
      <FAQSection
        eyebrow="Before you write"
        title="How working with us starts"
        description="What to expect from first enquiry onward, and how Philbrick supports installers and building owners."
        faqs={CONTACT_FAQS}
      />
    </ReleaseGate>
  );
}
