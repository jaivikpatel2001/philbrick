"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import type { FAQItem } from "@/types";
import { cn } from "@/utils/cn";
import { collapseMotion, collapseTransition } from "@/lib/motion";
import styles from "./FAQAccordion.module.css";

export function FAQAccordion({
  items,
  className,
}: {
  items: FAQItem[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <div className={cn(styles.list, className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className={cn(styles.item, isOpen && styles.itemOpen)}>
            <button
              className={styles.trigger}
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className={styles.question}>{item.question}</span>
              <FiPlus className={cn(styles.icon, isOpen && styles.iconOpen)} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  className={styles.answerWrap}
                  {...collapseMotion}
                  transition={collapseTransition(reduce)}
                >
                  <p className={styles.answer}>{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
