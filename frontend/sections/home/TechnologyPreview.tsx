import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { TECH_PILLARS } from "@/data/technology";
import styles from "./TechnologyPreview.module.css";

export function TechnologyPreview() {
  return (
    <section className={`section ${styles.section}`}>
      <div className={styles.grid} aria-hidden />
      <div className={styles.glow} aria-hidden />
      <div className="container--wide">
        <SectionHeader
          eyebrow="The intelligence inside"
          title={
            <>
              Not just an elevator.
              <br />A connected, learning machine.
            </>
          }
          description="Every VERTIQ system runs on Pulse™ — an IoT and AI platform that turns vertical transport into living, self-improving infrastructure."
          align="center"
        />
        <div className={styles.cards}>
          {TECH_PILLARS.map((pillar, i) => (
            <FeatureCard
              key={pillar.title}
              iconName={pillar.iconName}
              title={pillar.title}
              description={pillar.description}
              index={i}
            />
          ))}
        </div>
        <div className={styles.cta}>
          <Button href="/products" size="lg" withArrow>
            Explore products
          </Button>
          <Button href="/contact" size="lg" variant="secondary">
            Talk to an engineer
          </Button>
        </div>
      </div>
    </section>
  );
}
