"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiX, FiChevronDown } from "react-icons/fi";
import { MAIN_NAV } from "@/constants/navigation";
import { SITE } from "@/constants/site";
import type { MegaCategory } from "@/types";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useLockBody } from "@/hooks/useLockBody";
import { stopLenis, startLenis } from "@/components/providers/SmoothScroll";
import { cn } from "@/utils/cn";
import { collapseMotion, collapseTransition } from "@/lib/motion";
import styles from "./MobileNav.module.css";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const [openTop, setOpenTop] = useState<string | null>(null);
  const [openCat, setOpenCat] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const accordion = { ...collapseMotion, transition: collapseTransition(reduce) };
  useLockBody(open);

  useEffect(() => {
    if (open) stopLenis();
    else startLenis();
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  /* Nested category row: either a sub-accordion (has children) or a link. */
  const CategoryRow = ({ cat }: { cat: MegaCategory }) => {
    if (cat.children.length === 0) {
      return (
        <Link href={cat.href} className={styles.subLink} onClick={onClose}>
          {cat.label}
        </Link>
      );
    }
    const isOpen = openCat === cat.slug;
    return (
      <div className={styles.subGroup}>
        <button
          className={styles.subGroupBtn}
          onClick={() => setOpenCat(isOpen ? null : cat.slug)}
          aria-expanded={isOpen}
        >
          {cat.label}
          <FiChevronDown className={cn(styles.chev, isOpen && styles.chevOpen)} />
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div className={styles.subSub} {...accordion}>
              <Link href={cat.href} className={styles.subSubLink} onClick={onClose}>
                All {cat.label}
              </Link>
              {cat.children.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={styles.subSubLink}
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.root}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className={styles.scrim} onClick={onClose} />
          <motion.aside
            className={styles.panel}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Menu"
          >
            <div className={styles.head}>
              <Logo />
              <button
                className={styles.close}
                onClick={onClose}
                aria-label="Close menu"
              >
                <FiX />
              </button>
            </div>

            <nav className={styles.body} aria-label="Mobile">
              {MAIN_NAV.map((item) => {
                /* Simple link */
                if (!item.mega && !item.dropdown) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={styles.topLink}
                      onClick={onClose}
                    >
                      {item.label}
                    </Link>
                  );
                }

                const isOpen = openTop === item.label;
                return (
                  <div key={item.label} className={styles.group}>
                    <button
                      className={styles.groupBtn}
                      onClick={() => setOpenTop(isOpen ? null : item.label)}
                      aria-expanded={isOpen}
                    >
                      {item.label}
                      <FiChevronDown
                        className={cn(styles.chev, isOpen && styles.chevOpen)}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div className={styles.sub} {...accordion}>
                          <div className={styles.subInner}>
                            {/* Flat dropdown (About) */}
                            {item.dropdown?.map((link) => (
                              <Link
                                key={link.href}
                                href={link.href}
                                className={styles.subLink}
                                onClick={onClose}
                              >
                                {link.label}
                              </Link>
                            ))}
                            {/* Nested product categories */}
                            {item.mega?.groups.flatMap((g) => g.categories).map(
                              (cat) => <CategoryRow key={cat.slug} cat={cat} />
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            <div className={styles.foot}>
              <div className={styles.footRow}>
                <span className={styles.footLabel}>Theme</span>
                <ThemeToggle />
              </div>
              <Button href="/contact" fullWidth withArrow onClick={onClose}>
                Get a quote
              </Button>
              <a href={SITE.phoneHref} className={styles.phone}>
                {SITE.phone}
              </a>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
