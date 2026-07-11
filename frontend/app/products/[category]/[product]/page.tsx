import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/sections/shared/PageHero";
import { TechShowcase } from "@/sections/shared/TechShowcase";
import { CTASection } from "@/sections/shared/CTASection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/cards/ProductCard";
import {
  getCategory,
  getProduct,
  categoryHref,
  productHref,
  productParams,
} from "@/data/products";
import { ReleaseGate } from "@/components/release/ReleaseGate";
import { JsonLd } from "@/components/seo/JsonLd";
import { productSchema, breadcrumbSchema } from "@/lib/schema";
import styles from "../detail.module.css";

interface Props {
  params: Promise<{ category: string; product: string }>;
}

export function generateStaticParams() {
  return productParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, product } = await params;
  const cat = getCategory(category);
  const p = getProduct(category, product);
  if (!cat || !p) return { title: "Product not found" };
  return {
    title: p.name,
    description: p.description,
    alternates: { canonical: productHref(category, product) },
    openGraph: {
      title: `${p.name} · Philbrick`,
      description: p.description,
      images: [p.image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { category, product } = await params;
  const cat = getCategory(category);
  const p = getProduct(category, product);
  if (!cat || !p) notFound();

  const related = (cat.children ?? [])
    .filter((c) => c.slug !== p.slug)
    .slice(0, 3);

  const features = (p.highlights ?? []).slice(0, 4).map((h) => ({
    iconName: "FiCheckCircle",
    title: h,
    description: "",
  }));

  return (
    <ReleaseGate route={productHref(category, product)} label={p.name}>
      <JsonLd data={productSchema(p, productHref(category, product))} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: cat.name, path: categoryHref(cat.slug) },
          { name: p.name, path: productHref(category, product) },
        ])}
      />

      <PageHero
        eyebrow={cat.name}
        title={p.name}
        description={p.description}
        image={p.image}
        imageAlt={p.name}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: cat.name, href: categoryHref(cat.slug) },
          { label: p.name },
        ]}
      />

      {/* Overview */}
      <section className="section">
        <div className="container--wide">
          <TechShowcase
            eyebrow="Overview"
            title={p.tagline ?? p.name}
            description={p.longDescription ?? p.description}
            image={p.image}
            imageAlt={p.name}
            features={features}
          />
        </div>
      </section>

      {/* Specifications — only when verified specs exist */}
      {p.specs && p.specs.length > 0 && (
        <section className={`section ${styles.specSection}`}>
          <div className="container--wide">
            <div className={styles.specLayout}>
              <SectionHeader
                eyebrow="Technical"
                title="Specifications"
                description="Indicative figures. Final specifications are confirmed during engineering."
              />
              <dl className={styles.specs}>
                {p.specs.map((spec) => (
                  <div key={spec.label} className={styles.specRow} data-reveal="up">
                    <dt>{spec.label}</dt>
                    <dd>{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>
      )}

      {/* Related products in the same category */}
      {related.length > 0 && (
        <section className="section">
          <div className="container--wide">
            <SectionHeader eyebrow="Explore more" title={`More ${cat.name}`} />
            <div className={styles.relatedGrid}>
              {related.map((r) => (
                <ProductCard
                  key={r.slug}
                  node={r}
                  href={productHref(cat.slug, r.slug)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection
        title={`Specify ${p.name}`}
        description="Share your requirements and the Philbrick team will prepare a tailored proposal."
        primary={{ label: "Request a quote", href: "/contact" }}
        secondary={{ label: `All ${cat.name}`, href: categoryHref(cat.slug) }}
      />
    </ReleaseGate>
  );
}
