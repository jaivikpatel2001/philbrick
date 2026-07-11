import type { Metadata } from "next";
import { PageHero } from "@/sections/shared/PageHero";
import { CTASection } from "@/sections/shared/CTASection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/cards/ProductCard";
import { PRODUCT_GROUPS, getCategory, categoryHref } from "@/data/products";
import { TRUST_METRICS } from "@/data/stats";
import { PRODUCT_FAQS } from "@/data/faqs";
import { FAQSection } from "@/sections/shared/FAQSection";
import { ReleaseGate } from "@/components/release/ReleaseGate";
import { JsonLd } from "@/components/seo/JsonLd";
import { productListSchema, breadcrumbSchema, faqSchema } from "@/lib/schema";
import { HERO } from "@/data/images";
import styles from "./products.module.css";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore Philbrick's elevator component range: control panels, integrated controllers, ARD, door operators, Synergy auto doors, cabins, displays, COP/LOP and voice systems.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <ReleaseGate route="/products" label="Products">
      <JsonLd data={productListSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
        ])}
      />
      <JsonLd data={faqSchema(PRODUCT_FAQS)} />

      <PageHero
        eyebrow="The range"
        title="Complete elevator components, engineered in-house"
        description="From control panels and the Automatic Rescue Device to doors, cabins, displays and signalling: everything needed to build, upgrade and maintain a lift, from one source."
        image={HERO.products}
        imageAlt="Elevator control components"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Products" }]}
        stats={TRUST_METRICS.slice(0, 3)}
      />

      {PRODUCT_GROUPS.map((group, gi) => {
        const items = group.slugs.map((slug) => getCategory(slug)!).filter(Boolean);
        return (
          <section
            key={group.title}
            className={`section ${gi % 2 === 1 ? styles.alt : ""}`}
          >
            <div className="container--wide">
              <SectionHeader
                eyebrow={`0${gi + 1}`}
                title={group.title}
                align="left"
              />
              <div className={styles.grid}>
                {items.map((cat) => (
                  <ProductCard
                    key={cat.slug}
                    node={cat}
                    href={categoryHref(cat.slug)}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* Buyer guidance — visible Q&A mirrored in FAQPage structured data */}
      <FAQSection
        eyebrow="Choosing a system"
        title="Common questions, answered"
        description="What installers, builders and OEMs ask most when specifying elevator control, safety and signalling."
        faqs={PRODUCT_FAQS}
      />

      <CTASection
        title="Not sure which product fits?"
        description="Tell us about your elevator and our engineers will recommend the right control, safety and signalling components."
        primary={{ label: "Get expert advice", href: "/contact" }}
        secondary={{ label: "About Philbrick", href: "/about" }}
      />
    </ReleaseGate>
  );
}
