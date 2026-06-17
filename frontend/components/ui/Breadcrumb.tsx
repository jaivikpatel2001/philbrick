import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";
import { cn } from "@/utils/cn";
import styles from "./Breadcrumb.module.css";

export interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: Crumb[];
  tone?: "default" | "light";
  className?: string;
}

export function Breadcrumb({ items, tone = "default", className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(styles.crumbs, tone === "light" && styles.light, className)}
    >
      <ol>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className={styles.item}>
              {item.href && !last ? (
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={styles.current}>
                  {item.label}
                </span>
              )}
              {!last && <FiChevronRight className={styles.sep} aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
