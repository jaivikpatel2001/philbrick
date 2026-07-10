import { createElement } from "react";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import type { IconType } from "react-icons";
import { getIcon } from "@/lib/icons";
import { cn } from "@/utils/cn";
import { pad2 } from "@/utils/format";
import styles from "./FeatureCard.module.css";

interface FeatureCardProps {
  icon?: IconType;
  iconName?: string;
  title: string;
  description: string;
  href?: string;
  index?: number;
  variant?: "default" | "numbered" | "plain";
  className?: string;
}

export function FeatureCard({
  icon,
  iconName,
  title,
  description,
  href,
  index,
  variant = "default",
  className,
}: FeatureCardProps) {
  const resolvedIcon = icon ?? getIcon(iconName);
  const classes = cn(
    styles.card,
    styles[variant],
    href && styles.link,
    className
  );

  const inner = (
    <>
      <div className={styles.head}>
        {variant === "numbered" && index !== undefined ? (
          <span className={styles.num}>{pad2(index + 1)}</span>
        ) : (
          <span className={styles.iconBadge}>
            {createElement(resolvedIcon)}
          </span>
        )}
        {href && <FiArrowUpRight className={styles.arrow} />}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{description}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} data-reveal="up">
        {inner}
      </Link>
    );
  }
  return (
    <div className={classes} data-reveal="up">
      {inner}
    </div>
  );
}
