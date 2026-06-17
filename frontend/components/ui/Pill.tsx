import { cn } from "@/utils/cn";
import styles from "./Pill.module.css";

interface PillProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  as?: "button" | "span";
}

export function Pill({
  children,
  active = false,
  onClick,
  className,
  as = onClick ? "button" : "span",
}: PillProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(styles.pill, active && styles.active, className)}
      {...(as === "button" ? { onClick, type: "button" as const } : {})}
    >
      {children}
    </Tag>
  );
}
