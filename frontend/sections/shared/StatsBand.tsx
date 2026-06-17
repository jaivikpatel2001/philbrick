import type { Stat } from "@/types";
import { Stats } from "@/components/ui/Stats";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/utils/cn";
import styles from "./StatsBand.module.css";

interface StatsBandProps {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  stats: Stat[];
  columns?: 2 | 3 | 4;
  variant?: "default" | "bordered" | "bare";
  surface?: boolean;
  align?: "left" | "center";
  className?: string;
  id?: string;
}

export function StatsBand({
  eyebrow,
  title,
  description,
  stats,
  columns = 4,
  variant = "default",
  surface = false,
  align = "center",
  className,
  id,
}: StatsBandProps) {
  return (
    <section id={id} className={cn("section", surface && styles.surface, className)}>
      <div className="container--wide">
        {title && (
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            align={align}
          />
        )}
        <Stats stats={stats} columns={columns} variant={variant} />
      </div>
    </section>
  );
}
