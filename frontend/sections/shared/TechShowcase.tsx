import Image from "next/image";
import type { CSSProperties } from "react";
import type { Feature } from "@/types";
import { getIcon } from "@/lib/icons";
import { cn } from "@/utils/cn";
import styles from "./TechShowcase.module.css";

interface TechShowcaseProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  image: string;
  imageAlt?: string;
  features: Feature[];
  badge?: { value: string; label: string };
  reverse?: boolean;
}

export function TechShowcase({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
  features,
  badge,
  reverse = false,
}: TechShowcaseProps) {
  return (
    <div className={cn(styles.grid, reverse && styles.reverse)}>
      <div className={styles.mediaCol}>
        <div className={styles.media} data-reveal={reverse ? "right" : "left"}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            className={styles.img}
          />
          {badge && (
            <div className={styles.badge}>
              <span className={styles.badgeValue}>{badge.value}</span>
              <span className={styles.badgeLabel}>{badge.label}</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        {eyebrow && <span className="eyebrow" data-reveal="up">{eyebrow}</span>}
        <h2 className={styles.title} data-reveal="up">
          {title}
        </h2>
        {description && (
          <p className={cn("lead", styles.desc)} data-reveal="up">
            {description}
          </p>
        )}
        <ul className={styles.features}>
          {features.map((f, i) => {
            const Icon = getIcon(f.iconName);
            return (
              <li
                key={i}
                className={styles.feature}
                data-reveal="up"
                style={{ "--reveal-delay": `${i * 0.06}s` } as CSSProperties}
              >
                <span className={styles.featIcon}>
                  <Icon />
                </span>
                <div>
                  <h3 className={styles.featTitle}>{f.title}</h3>
                  <p className={styles.featDesc}>{f.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
