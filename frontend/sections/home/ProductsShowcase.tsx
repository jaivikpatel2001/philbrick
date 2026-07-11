import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { getCategory, categoryHref } from "@/data/products";
import type { ProductNode } from "@/types";
import styles from "./ProductsShowcase.module.css";

/* Six categories that carry the story on the homepage; the full range lives
   at /products. */
const FEATURED = [
  "elevator-control-panel",
  "integrated-control-panel",
  "ard",
  "elevator-iot",
  "synergy-auto-door",
  "elevator-display",
];

export function ProductsShowcase() {
  const featured = FEATURED.map((slug) => getCategory(slug)).filter(
    Boolean
  ) as ProductNode[];

  return (
    <section className={`section ${styles.section}`}>
      <div className="container--wide">
        <SectionHeader
          eyebrow="02 — The range"
          title="Everything an elevator needs."
          description="Control, safety, doors, cabins and signalling — Philbrick engineers and builds the components that make a lift run, all under one roof."
          action={
            <Button href="/products" variant="ghost" withArrow>
              All products
            </Button>
          }
        />

        <div className={styles.index} role="list">
          {featured.map((product, i) => (
            <Link
              key={product.slug}
              role="listitem"
              href={categoryHref(product.slug)}
              className={styles.row}
              data-reveal="up"
              style={{ "--reveal-delay": `${i * 0.05}s` } as React.CSSProperties}
            >
              <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.name}>{product.name}</span>
              <span className={styles.meta}>
                <span className={styles.metaItem}>{product.category}</span>
              </span>
              <span className={styles.thumb} aria-hidden>
                <Image
                  src={product.image}
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
