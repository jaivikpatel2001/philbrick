import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FiCheck } from "react-icons/fi";
import { PageHero } from "@/sections/shared/PageHero";
import { TechShowcase } from "@/sections/shared/TechShowcase";
import { CTASection } from "@/sections/shared/CTASection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProductCard } from "@/components/cards/ProductCard";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { PRODUCTS, getProduct } from "@/data/products";
import styles from "./detail.module.css";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: `${product.name} · VERTIQ`,
      description: product.description,
      images: [product.heroImage],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = PRODUCTS.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={product.category}
        title={product.name}
        description={product.description}
        image={product.heroImage}
        imageAlt={product.name}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
      />

      {/* Overview */}
      <section className="section">
        <div className="container--wide">
          <TechShowcase
            eyebrow="Overview"
            title={product.tagline}
            description={product.longDescription ?? product.description}
            image={product.gallery?.[0] ?? product.heroImage}
            imageAlt={product.name}
            badge={
              product.capacityRange
                ? { value: product.capacityRange, label: "Capacity range" }
                : undefined
            }
            features={product.features.slice(0, 3)}
          />
        </div>
      </section>

      {/* Highlights */}
      <section className={`section--sm ${styles.highlightBand}`}>
        <div className="container--wide">
          <ul className={styles.highlights}>
            {product.highlights.map((h) => (
              <li key={h} data-reveal="up">
                <FiCheck /> {h}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Subcategories */}
      {product.subcategories && product.subcategories.length > 0 && (
        <section className="section">
          <div className="container--wide">
            <SectionHeader
              eyebrow="Configurations"
              title="Choose the right variant"
              description={`Every ${product.name.toLowerCase()} project is different. Pick the configuration that fits your building and we'll tailor the rest.`}
            />
            <div className={styles.subGrid}>
              {product.subcategories.map((sub, i) => (
                <div key={sub.name} className={styles.subCard} data-reveal="up">
                  <span className={styles.subNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{sub.name}</h3>
                  <p>{sub.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Specifications */}
      <section className={`section ${styles.specSection}`}>
        <div className="container--wide">
          <div className={styles.specLayout}>
            <SectionHeader
              eyebrow="Technical"
              title="Specifications"
              description="Indicative figures — final specifications are confirmed during engineering."
            />
            <dl className={styles.specs}>
              {product.specs.map((spec) => (
                <div key={spec.label} className={styles.specRow} data-reveal="up">
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {product.gallery && product.gallery.length > 1 && (
        <section className="section">
          <div className="container--wide">
            <SectionHeader eyebrow="Gallery" title="See it in place" />
          </div>
          <ImageGallery images={product.gallery} altPrefix={product.name} />
        </section>
      )}

      {/* Related */}
      <section className={`section ${styles.relatedSection}`}>
        <div className="container--wide">
          <SectionHeader eyebrow="Explore more" title="Related products" />
          <div className={styles.relatedGrid}>
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={`Specify your ${product.name.toLowerCase()}`}
        description="Share your building details and a VERTIQ engineer will prepare a tailored proposal."
        primary={{ label: "Request a quote", href: "/contact" }}
        secondary={{ label: "All products", href: "/products" }}
      />
    </>
  );
}
