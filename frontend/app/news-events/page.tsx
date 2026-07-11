import type { Metadata } from "next";
import { FiCalendar } from "react-icons/fi";
import { PageHero } from "@/sections/shared/PageHero";
import { CTASection } from "@/sections/shared/CTASection";
import { Button } from "@/components/ui/Button";
import { ReleaseGate } from "@/components/release/ReleaseGate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { HERO } from "@/data/images";
import styles from "@/app/company.module.css";

export const metadata: Metadata = {
  title: "News & Events",
  description:
    "News, product updates and events from Philbrick Technologies. Check back for the latest from our Ahmedabad facility.",
  alternates: { canonical: "/news-events" },
};

export default function NewsEventsPage() {
  return (
    <ReleaseGate route="/news-events" label="News & Events">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "News & Events", path: "/news-events" },
        ])}
      />

      <PageHero
        eyebrow="Newsroom"
        title="News & Events"
        description="Product launches, exhibitions and company updates from Philbrick Technologies."
        image={HERO.blog}
        imageAlt="Philbrick news"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "News & Events" }]}
      />

      <section className="section">
        <div className="container--wide">
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <FiCalendar />
            </span>
            <h2 className={styles.emptyTitle}>Nothing to report just yet</h2>
            <p className={styles.emptyText}>
              We&apos;re preparing our first updates. Product news, exhibition
              appearances and company announcements will appear here — we&apos;ll
              only publish real events, never filler.
            </p>
            <Button href="/contact" withArrow>
              Get updates from our team
            </Button>
          </div>
        </div>
      </section>

      <CTASection
        title="Have a question in the meantime?"
        description="Our team is happy to help with product, specification or supply enquiries."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Browse products", href: "/products" }}
      />
    </ReleaseGate>
  );
}
