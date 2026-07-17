"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Faq } from "@/data/faqs";
import { cn } from "@/utils/cn";
import { collapseMotion, collapseTransition } from "@/lib/motion";
import styles from "./FAQSection.module.css";

interface FAQSectionProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  faqs: Faq[];
  className?: string;
}

/**
 * Editorial question-and-answer section that opens and closes with a smooth
 * height animation (shared collapse timing from lib/motion). Each row toggles
 * independently. The same FAQ data also feeds the page's FAQPage structured
 * data, so the visible copy and the schema never drift apart.
 */
export function FAQSection({ eyebrow, title, description, faqs, className }: FAQSectionProps) {
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const reduce = useReducedMotion();

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section className={cn("section", className)}>
      <div className="container--wide">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        <div className={styles.list}>
          {faqs.map((faq, i) => {
            const isOpen = open.has(i);
            /* The row carries data-reveal, and RevealObserver adds `.is-visible`
               to it imperatively once it scrolls into view. Its className MUST
               stay static: if React rewrote it on toggle it would wipe
               `.is-visible` and the whole row would vanish. So the open state is
               expressed via the button's aria-expanded, never a class here. */
            return (
              <div key={faq.question} className={styles.item} data-reveal="up">
                <button
                  type="button"
                  className={styles.question}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  onClick={() => toggle(i)}
                >
                  <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.qText}>{faq.question}</span>
                  <span className={styles.marker} aria-hidden />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${i}`}
                      className={styles.answerWrap}
                      {...collapseMotion}
                      transition={collapseTransition(reduce)}
                    >
                      <p className={styles.answer}>{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
