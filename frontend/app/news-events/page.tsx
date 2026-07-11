import type { Metadata } from "next";
import { PageHero } from "@/sections/shared/PageHero";
import { CTASection } from "@/sections/shared/CTASection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NewsCard } from "@/components/cards/NewsCard";
import { ReleaseGate } from "@/components/release/ReleaseGate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { NEWS_ITEMS } from "@/data/news";
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
        image={HERO.newsEvents}
        imageAlt="Elevator technology exhibition hall with visitors"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "News & Events" }]}
      />

      <section className="section">
        <div className="container--wide">
          <SectionHeader
            eyebrow="Latest"
            title="What's happening at Philbrick"
            description="Product news, exhibition appearances, training and company updates."
            align="center"
          />
          <div className={styles.newsGrid}>
            {NEWS_ITEMS.map((item) => (
              <NewsCard key={item.title} item={item} />
            ))}
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
