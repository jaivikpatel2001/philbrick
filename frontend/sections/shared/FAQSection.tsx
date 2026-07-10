import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Faq } from "@/data/faqs";
import { cn } from "@/utils/cn";
import styles from "./FAQSection.module.css";

interface FAQSectionProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  faqs: Faq[];
  className?: string;
}

/**
 * Visible question-and-answer section (native <details>/<summary> — keyboard
 * and screen-reader accessible without ARIA). The same FAQ data feeds the
 * page's FAQPage structured data, so markup and schema never drift apart.
 */
export function FAQSection({ eyebrow, title, description, faqs, className }: FAQSectionProps) {
  return (
    <section className={cn("section", className)}>
      <div className="container--wide">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        <div className={styles.list}>
          {faqs.map((faq, i) => (
            <details key={faq.question} className={styles.item} data-reveal="up">
              <summary className={styles.question}>
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.qText}>{faq.question}</span>
                <span className={styles.marker} aria-hidden />
              </summary>
              <p className={styles.answer}>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
