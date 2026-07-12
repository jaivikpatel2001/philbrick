import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { SERVICES } from "@/data/services";
import styles from "./ServiceEcosystem.module.css";

/* A partnership continuum: the four real Philbrick offerings presented as a
   relationship that runs the length of an elevator's life, not four cards.
   Distinct from section 02's ecosystem orbit (linear vs radial). */
const STEP_VERB: Record<string, string> = {
  manufacturing: "Manufacture",
  "custom-oem": "Configure",
  modernisation: "Modernise",
  "support-spares": "Support",
};

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

        <ol className={styles.journey} role="list">
          {/* progress line drawn on reveal (behind the steps) */}
          <span className={styles.line} data-reveal="line" aria-hidden />

          {SERVICES.map((service, i) => (
            <li
              key={service.slug}
              className={styles.step}
              data-reveal="up"
              style={{ "--reveal-delay": `${0.12 + i * 0.12}s` } as React.CSSProperties}
            >
              <span className={styles.node} aria-hidden>
                <span className={styles.nodeNum}>{String(i + 1).padStart(2, "0")}</span>
              </span>
              <div className={styles.stepBody}>
                <span className={styles.verb}>{STEP_VERB[service.slug] ?? service.shortName}</span>
                <h3 className={styles.stepTitle}>{service.name}</h3>
                <p className={styles.stepDesc}>{service.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
