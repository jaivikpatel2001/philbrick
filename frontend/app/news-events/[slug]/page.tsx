import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FiCalendar, FiMapPin, FiUser } from "react-icons/fi";
import { PageHero } from "@/sections/shared/PageHero";
import { CTASection } from "@/sections/shared/CTASection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { NewsCard } from "@/components/cards/NewsCard";
import { ReleaseGate } from "@/components/release/ReleaseGate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { NEWS_ITEMS, getNewsItem, newsParams } from "@/data/news";
import { formatDate } from "@/utils/format";
import styles from "./article.module.css";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return newsParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsItem(slug);
  if (!item) return { title: "Not found" };
  return {
    title: item.title,
    description: item.excerpt,
    alternates: { canonical: `/news-events/${item.slug}` },
    openGraph: {
      title: `${item.title} · Philbrick`,
      description: item.excerpt,
      images: [item.image],
    },
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  const item = getNewsItem(slug);
  if (!item) notFound();

  const related = NEWS_ITEMS.filter((n) => n.slug !== slug).slice(0, 3);

  return (
    <ReleaseGate route={`/news-events/${slug}`} label="News & Events">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "News & Events", path: "/news-events" },
          { name: item.title, path: `/news-events/${item.slug}` },
        ])}
      />

      <PageHero
        eyebrow={`${item.type} · ${item.category}`}
        title={item.title}
        description={item.excerpt}
        image={item.image}
        imageAlt={item.imageAlt}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "News & Events", href: "/news-events" },
          { label: item.title },
        ]}
      />

      {/* Article */}
      <section className="section">
        <div className="container--prose">
          <div className={styles.meta}>
            <span>
              <FiCalendar aria-hidden /> {formatDate(item.date)}
            </span>
            {item.eventDate && (
              <span>
                <FiCalendar aria-hidden /> Event: {formatDate(item.eventDate)}
              </span>
            )}
            {item.location && (
              <span>
                <FiMapPin aria-hidden /> {item.location}
              </span>
            )}
            {item.author && (
              <span>
                <FiUser aria-hidden /> {item.author}
              </span>
            )}
          </div>

          <article className={styles.article}>
            {item.content.map((block, i) => {
              if (block.type === "h2") {
                return (
                  <h2 key={i} className={styles.h2}>
                    {block.content as string}
                  </h2>
                );
              }
              if (block.type === "list") {
                return (
                  <ul key={i} className={styles.list}>
                    {(block.content as string[]).map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className={styles.p}>
                  {block.content as string}
                </p>
              );
            })}
          </article>

          <div className={styles.back}>
            <Button href="/news-events" variant="secondary" withArrow>
              Back to News & Events
            </Button>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="section">
          <div className="container--wide">
            <SectionHeader eyebrow="More" title="Related news & events" align="center" />
            <div className={styles.relatedGrid}>
              {related.map((n) => (
                <NewsCard key={n.slug} item={n} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection
        title="Talk to the Philbrick team"
        description="Questions about our products, supply or an upcoming event? We're happy to help."
        primary={{ label: "Contact us", href: "/contact" }}
        secondary={{ label: "Browse products", href: "/products" }}
      />
    </ReleaseGate>
  );
}
