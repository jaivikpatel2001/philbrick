import type { Feature } from "@/types";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/utils/cn";
import styles from "./FeatureGrid.module.css";

interface FeatureGridProps {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  features: Feature[];
  columns?: 2 | 3 | 4;
  variant?: "default" | "numbered" | "plain";
  align?: "left" | "center";
  className?: string;
}

export function FeatureGrid({
  eyebrow,
  title,
  description,
  features,
  columns = 3,
  variant = "default",
  align = "center",
  className,
}: FeatureGridProps) {
  return (
    <div className={className}>
      {title && (
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          align={align}
        />
      )}
      <div className={cn(styles.grid)} data-cols={columns}>
        {features.map((f, i) => (
          <FeatureCard
            key={i}
            iconName={f.iconName}
            icon={f.icon}
            title={f.title}
            description={f.description}
            index={i}
            variant={variant}
          />
        ))}
      </div>
    </div>
  );
}
