import type { Metadata } from "next";
import { PageHero } from "@/sections/shared/PageHero";
import { CTASection } from "@/sections/shared/CTASection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/cards/ProductCard";
import { PRODUCTS, PRODUCT_GROUPS } from "@/data/products";
import { HERO } from "@/data/images";
import styles from "./products.module.css";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore the full VERTIQ portfolio — passenger, home, high-speed, hospital and freight elevators, escalators, walkways and components.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="The portfolio"
        title="Vertical mobility for every building"
        description="Twelve product families, one intelligent platform. From a single home lift to forty cars in a supertall — engineered, connected and built to last."
        image={HERO.products}
        imageAlt="Modern elevator cabin interior"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Products" }]}
        stats={[
          { value: 12, label: "Product families" },
          { value: 40, suffix: "+", label: "Countries served" },
          { value: 1.4, decimals: 1, suffix: "M", label: "Units in service" },
        ]}
      />

      {PRODUCT_GROUPS.map((group, gi) => {
        const items = group.slugs
          .map((slug) => PRODUCTS.find((p) => p.slug === slug)!)
          .filter(Boolean);
        return (
          <section
            key={group.title}
            className={`section ${gi === 1 ? styles.alt : ""}`}
          >
            <div className="container--wide">
              <SectionHeader
                eyebrow={`0${gi + 1}`}
                title={group.title}
                align="left"
              />
              <div className={styles.grid}>
                {items.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <CTASection
        title="Not sure which system fits?"
        description="Tell us about your building and our engineers will recommend the right product, capacity and configuration."
        primary={{ label: "Get expert advice", href: "/contact" }}
        secondary={{ label: "Our services", href: "/services" }}
      />
    </>
  );
}
