"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FiX, FiChevronDown } from "react-icons/fi";
import { MAIN_NAV } from "@/constants/navigation";
import { SITE } from "@/constants/site";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useLockBody } from "@/hooks/useLockBody";
import { stopLenis, startLenis } from "@/components/providers/SmoothScroll";
import { cn } from "@/utils/cn";
import styles from "./MobileNav.module.css";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
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
                if (!item.mega) {
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
                const isOpen = expanded === item.label;
                return (
                  <div key={item.label} className={styles.group}>
                    <button
                      className={styles.groupBtn}
                      onClick={() =>
                        setExpanded(isOpen ? null : item.label)
                      }
                      aria-expanded={isOpen}
                    >
                      {item.label}
                      <FiChevronDown
                        className={cn(styles.chev, isOpen && styles.chevOpen)}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          className={styles.sub}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className={styles.subInner}>
                            {item.mega.columns.flatMap((c) => c.links).map(
                              (link) => (
                                <Link
                                  key={link.href}
                                  href={link.href}
                                  className={styles.subLink}
                                  onClick={onClose}
                                >
                                  {link.label}
                                </Link>
                              )
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
