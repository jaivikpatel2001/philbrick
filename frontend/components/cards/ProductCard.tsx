import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import type { ProductNode } from "@/types";
import { productImage } from "@/data/catalog";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  node: ProductNode;
  href: string;
}

export function ProductCard({ node, href }: ProductCardProps) {
  /* The client's real catalogue photography wherever it exists, so every card
     grid on the site (products index, category ranges, related products) shows
     the actual product rather than the AI-generated brand shot. */
  const image = productImage(node.slug, node.image);

  return (
    <Link href={href} className={styles.card} data-reveal="up">
      <div className={styles.media}>
        <Image
          src={image}
          alt={node.name}
          fill
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          className={styles.img}
        />
        <span className={styles.category}>{node.category}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{node.name}</h3>
          <FiArrowUpRight className={styles.arrow} />
        </div>
        <p className={styles.tagline}>{node.tagline ?? node.description}</p>
      </div>
    </Link>
  );
}
