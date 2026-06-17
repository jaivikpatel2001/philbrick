import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { MISC } from "@/data/images";
import { cn } from "@/utils/cn";
import styles from "./CTASection.module.css";

interface CTASectionProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  image?: string;
  variant?: "image" | "gradient";
  className?: string;
}

export function CTASection({
  eyebrow = "Let's build upward",
  title,
  description,
  primary = { label: "Request a consultation", href: "/contact" },
  secondary,
  image = MISC.ctaTower,
  variant = "image",
  className,
}: CTASectionProps) {
  return (
    <section className={cn("section", styles.wrap, className)}>
      <div className="container--wide">
        <div className={cn(styles.cta, styles[variant])} data-reveal="scale">
          {variant === "image" && (
            <>
              <Image
                src={image}
                alt=""
                fill
                sizes="(max-width: 1480px) 100vw, 1480px"
                className={styles.bg}
              />
              <div className={styles.scrim} />
            </>
          )}
          <div className={styles.body}>
            {eyebrow && <span className={cn("eyebrow", styles.eyebrow)}>{eyebrow}</span>}
            <h2 className={styles.title}>{title}</h2>
            {description && <p className={styles.desc}>{description}</p>}
            <div className={styles.actions}>
              <Button href={primary.href} size="lg" withArrow>
                {primary.label}
              </Button>
              {secondary && (
                <Button href={secondary.href} size="lg" variant="secondary">
                  {secondary.label}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
