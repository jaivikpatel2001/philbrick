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
          eyebrow="Lifecycle services"
          title="We don't just install. We stay."
          description="An elevator lasts decades — and so should the relationship behind it. From first survey to predictive care, VERTIQ covers the whole lifecycle."
          action={
            <Button href="/services" variant="ghost" withArrow>
              All services
            </Button>
          }
        />
        <div className={styles.grid}>
          {SERVICES.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
