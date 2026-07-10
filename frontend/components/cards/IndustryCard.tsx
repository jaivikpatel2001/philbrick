import { createElement } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import type { Industry } from "@/types";
import { getIcon } from "@/lib/icons";
import { cn } from "@/utils/cn";
import styles from "./IndustryCard.module.css";

export function IndustryCard({
  industry,
  large = false,
}: {
  industry: Industry;
  large?: boolean;
}) {
  const icon = getIcon(industry.iconName);
  return (
    <Link
      href={`/industries/${industry.slug}`}
      className={cn(styles.card, large && styles.large)}
      data-reveal="up"
    >
      <Image
        src={industry.cardImage}
        alt={industry.name}
        fill
        sizes={large ? "(max-width: 900px) 100vw, 66vw" : "(max-width: 900px) 100vw, 33vw"}
        className={styles.img}
      />
      <div className={styles.overlay} />
      <div className={styles.body}>
        <span className={styles.icon}>
          {createElement(icon)}
        </span>
        <div className={styles.text}>
          <h3 className={styles.title}>{industry.name}</h3>
          <p className={styles.tagline}>{industry.tagline}</p>
        </div>
        <span className={styles.cta}>
          Explore solutions <FiArrowUpRight />
        </span>
      </div>
    </Link>
  );
}
