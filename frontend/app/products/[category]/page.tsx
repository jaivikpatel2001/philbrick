import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/sections/shared/PageHero";
import { TechShowcase } from "@/sections/shared/TechShowcase";
import { CTASection } from "@/sections/shared/CTASection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/cards/ProductCard";
import { ProductDetail } from "@/sections/products/ProductDetail";
import { categoryProducts, productImage } from "@/data/catalog";
import {
  getCategory,
  categoryHref,
  productHref,
  categoryParams,
} from "@/data/products";
import { ReleaseGate } from "@/components/release/ReleaseGate";
import { JsonLd } from "@/components/seo/JsonLd";
import { productSchema, breadcrumbSchema } from "@/lib/schema";
import styles from "./detail.module.css";

interface Props {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return categoryParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return { title: "Product not found" };
  return {
    title: cat.name,
    description: cat.description,
    alternates: { canonical: categoryHref(cat.slug) },
    openGraph: {
      title: `${cat.name} · Philbrick`,
      description: cat.description,
      images: [cat.image],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const highlightFeatures = (cat.highlights ?? []).slice(0, 4).map((h) => ({
    iconName: "FiCheckCircle",
    title: h,
    description: "",
  }));

  /* Categories the client's menu links to directly (Elevator Doors, COP/LOP,
     Elevator Cabin…) have no submenu, so their real product content — photos,
     salient features, specification tables — belongs on this page rather than
     behind another click. Categories that DO have a submenu keep the card grid. */
  const inlineProducts = cat.children?.length ? [] : categoryProducts(cat.slug);
  const heroImage = productImage(cat.slug, cat.image);

  return (
    <ReleaseGate route={categoryHref(cat.slug)} label={cat.name}>
      <JsonLd data={productSchema(cat, categoryHref(cat.slug))} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: cat.name, path: categoryHref(cat.slug) },
        ])}
      />

      <PageHero
        eyebrow={cat.category}
        title={cat.name}
        description={cat.tagline ?? cat.description}
        image={heroImage}
        imageAlt={cat.name}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: cat.name },
        ]}
      />

      {/* Overview — only where a card grid follows; a self-contained category
          leads with the product itself instead of an abstract intro. */}
      {inlineProducts.length === 0 && (
        <section className="section">
          <div className="container--wide">
            <TechShowcase
              eyebrow="Overview"
              title={cat.tagline ?? cat.name}
              description={cat.longDescription ?? cat.description}
              image={cat.image}
              imageAlt={cat.name}
              features={highlightFeatures}
            />
          </div>
        </section>
      )}

      {/* Self-contained category: the client's own product content, inline */}
      {inlineProducts.length > 0 && (
        <section className="section">
          <div className="container--wide">
            <div className={styles.inlineProducts}>
              {inlineProducts.map((product, i) => (
                <ProductDetail
                  key={product.slug}
                  product={product}
                  description={
                    i === 0 ? (cat.longDescription ?? cat.description) : ""
                  }
                  showName={inlineProducts.length > 1}
                  priority={i === 0}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Child products (the range) */}
      {cat.children && cat.children.length > 0 && (
        <section className={`section ${styles.specSection}`}>
          <div className="container--wide">
            <SectionHeader
              eyebrow="The range"
              title={`Explore ${cat.name}`}
              description={`Choose the ${cat.name.toLowerCase()} variant that fits your project. The Philbrick team will help you specify the rest.`}
            />
            <div className={styles.rangeGrid}>
              {cat.children.map((child) => (
                <ProductCard
                  key={child.slug}
                  node={child}
                  href={productHref(cat.slug, child.slug)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection
        title={`Interested in ${cat.name}?`}
        description="Tell us about your project and the Philbrick team will help you specify the right solution."
        primary={{ label: "Request a quote", href: "/contact" }}
        secondary={{ label: "All products", href: "/products" }}
      />
    </ReleaseGate>
  );
}
