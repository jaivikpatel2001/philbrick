import Image from "next/image";
import type { Stat } from "@/types";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import { Stats } from "@/components/ui/Stats";
import { cn } from "@/utils/cn";
import styles from "./PageHero.module.css";

interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  image: string;
  imageAlt?: string;
  breadcrumb?: Crumb[];
  actions?: React.ReactNode;
  align?: "left" | "center";
  size?: "standard" | "tall";
  stats?: Stat[];
}

/** Cinematic inner-page hero used across product, service, industry & company pages. */
export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt = "",
  breadcrumb,
  actions,
  align = "left",
  size = "standard",
  stats,
}: PageHeroProps) {
  return (
    <section
      className={cn(styles.hero, styles[align])}
      data-size={size}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority
        sizes="100vw"
        quality={90}
        className={styles.bg}
      />
      <div className={styles.scrim} />
      <div className={cn("container--wide", styles.inner)}>
        {breadcrumb && (
          <div className={styles.crumbs}>
            <Breadcrumb items={breadcrumb} tone="light" />
          </div>
        )}
        {eyebrow && <span className={cn("eyebrow", styles.eyebrow)}>{eyebrow}</span>}
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.desc}>{description}</p>}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>

      {stats && (
        <div className={cn("container--wide", styles.statsWrap)}>
          <div className={styles.statsCard}>
            <Stats stats={stats} columns={stats.length as 2 | 3 | 4} variant="bordered" />
          </div>
        </div>
      )}
    </section>
  );
}
