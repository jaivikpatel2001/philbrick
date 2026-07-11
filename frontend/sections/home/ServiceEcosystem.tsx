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
          eyebrow="03 What we offer"
          title="More than parts. A partner."
          description="An elevator lasts decades, and the components inside it should be supported for just as long. Philbrick manufactures, supplies, modernises and stocks the systems that keep lifts running."
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
