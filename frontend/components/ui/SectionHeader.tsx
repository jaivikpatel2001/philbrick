import type { ElementType } from "react";
import { cn } from "@/utils/cn";
import styles from "./SectionHeader.module.css";

interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  titleAs?: ElementType;
  titleClassName?: string;
  action?: React.ReactNode;
  className?: string;
  maxWidth?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  titleAs: Title = "h2",
  titleClassName,
  action,
  className,
  maxWidth,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(styles.header, styles[align], className)}
      data-reveal="up"
    >
      <div className={styles.copy} style={maxWidth ? { maxWidth } : undefined}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <Title className={cn(styles.title, titleClassName)}>{title}</Title>
        {description && <p className={cn("lead", styles.desc)}>{description}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
