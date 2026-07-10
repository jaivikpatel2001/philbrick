import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { PRODUCTS } from "@/data/products";
import styles from "./ProductsShowcase.module.css";

/* The six families that carry the story on the homepage; the full catalogue
   of twelve lives at /products. */
const FEATURED = [
  "passenger-elevators",
  "high-speed-elevators",
  "panoramic-elevators",
  "home-elevators",
  "hospital-elevators",
  "freight-elevators",
];

export function ProductsShowcase() {
  const featured = FEATURED.map((slug) => PRODUCTS.find((p) => p.slug === slug)!).filter(Boolean);
  return (
    <section className={`section ${styles.section}`}>
      <div className="container--wide">
        <SectionHeader
          eyebrow="02 — The portfolio"
          title="One platform. Every kind of rise."
          description="From a single home lift to forty-two cars in a supertall, every VERTIQ system shares the same intelligent core."
          action={
            <Button href="/products" variant="ghost" withArrow>
              All 12 product families
            </Button>
          }
        />

        <div className={styles.index} role="list">
          {featured.map((product, i) => (
            <Link
              key={product.slug}
              role="listitem"
              href={`/products/${product.slug}`}
              className={styles.row}
              data-reveal="up"
              style={{ "--reveal-delay": `${i * 0.05}s` } as React.CSSProperties}
            >
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.name}>{product.name}</span>
              <span className={styles.meta}>
                <span className={styles.metaItem}>{product.category}</span>
                {product.capacityRange && (
                  <span className={styles.metaItem}>{product.capacityRange}</span>
                )}
                {product.speedRange && (
                  <span className={styles.metaItem}>{product.speedRange}</span>
                )}
              </span>
              <span className={styles.thumb} aria-hidden>
                <Image
                  src={product.cardImage}
                  alt=""
                  fill
                  sizes="260px"
                  className={styles.thumbImg}
                />
              </span>
              <FiArrowUpRight className={styles.arrow} aria-hidden />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
