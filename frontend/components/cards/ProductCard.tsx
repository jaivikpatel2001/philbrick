import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import type { Product } from "@/types";
import styles from "./ProductCard.module.css";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={styles.card}
      data-reveal="up"
    >
      <div className={styles.media}>
        <Image
          src={product.cardImage}
          alt={product.name}
          fill
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          className={styles.img}
        />
        <span className={styles.category}>{product.category}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{product.name}</h3>
          <FiArrowUpRight className={styles.arrow} />
        </div>
        <p className={styles.tagline}>{product.tagline}</p>
        {(product.capacityRange || product.speedRange) && (
          <div className={styles.specs}>
            {product.capacityRange && (
              <span className={styles.spec}>{product.capacityRange}</span>
            )}
            {product.speedRange && (
              <span className={styles.spec}>{product.speedRange}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
