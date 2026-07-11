import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import type { ProductNode } from "@/types";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  node: ProductNode;
  href: string;
}

export function ProductCard({ node, href }: ProductCardProps) {
  return (
    <Link href={href} className={styles.card} data-reveal="up">
      <div className={styles.media}>
        <Image
          src={node.image}
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
