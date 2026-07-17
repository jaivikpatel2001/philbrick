"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import type { NavItem } from "@/types";
import styles from "./MegaMenu.module.css";

interface MegaMenuProps {
  item: NavItem;
  onEnter: () => void;
  onLeave: () => void;
}

/**
 * Products menu — a clean, grouped dropdown in the same flat style as the About
 * dropdown (NavDropdown). No two-pane hover interaction, category images or
 * flagship card: the whole range is listed under its group headings so it reads
 * at a glance, and one click opens a category page. Kept intentionally simple so
 * visitors don't get lost in a nested mega menu.
 */
export function MegaMenu({ item, onEnter, onLeave }: MegaMenuProps) {
  if (!item.mega) return null;
  const { groups } = item.mega;

  return (
    <motion.div
      className={styles.panel}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={styles.card}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        data-lenis-prevent
      >
        <div className={styles.grid}>
          {groups.map((group) => (
            <div key={group.title} className={styles.group}>
              <p className={styles.groupTitle}>{group.title}</p>
              <ul>
                {group.categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link href={cat.href} className={styles.link}>
                      <span>{cat.label}</span>
                      <FiArrowUpRight className={styles.arrow} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Link href={item.href} className={styles.viewAll}>
          View all products <FiArrowRight aria-hidden />
        </Link>
      </div>
    </motion.div>
  );
}
