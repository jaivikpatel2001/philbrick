import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { SERVICES } from "@/data/services";
import styles from "./ServiceEcosystem.module.css";

export function ServiceEcosystem() {
  return (
    <section className="section">
      <div className="container--wide">
        <SectionHeader
          eyebrow="03 — Lifecycle support"
          title="We don't just install. We stay."
          description="An elevator lasts decades — and so should the relationship behind it. From first survey to predictive care, VERTIQ covers installation, maintenance, modernization and AMC across the whole lifecycle."
          action={
            <Button href="/contact" variant="ghost" withArrow>
              Discuss your project
            </Button>
          }
        />
        <div className={styles.rows}>
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
