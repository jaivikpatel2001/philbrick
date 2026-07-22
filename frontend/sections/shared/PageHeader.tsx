import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import { cn } from "@/utils/cn";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumb?: Crumb[];
  actions?: React.ReactNode;
}

/**
 * Text-only page header for the secondary pages (Career, Quality Policy,
 * Privacy Policy, Downloads). Same voice as `PageHero` — breadcrumb, eyebrow,
 * display title, lead — but no photograph, because these pages have no
 * dedicated brand image and reusing an unrelated one would be worse than none.
 * A hairline rule and the index tick carry the "Engineered Editorial" look.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumb,
  actions,
}: PageHeaderProps) {
  return (
    <section className={styles.header}>
      <div className={cn("container--wide", styles.inner)}>
        {breadcrumb && (
          <div className={styles.crumbs}>
            <Breadcrumb items={breadcrumb} />
          </div>
        )}
        {eyebrow && <span className={cn("eyebrow", styles.eyebrow)}>{eyebrow}</span>}
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.desc}>{description}</p>}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </section>
  );
}
