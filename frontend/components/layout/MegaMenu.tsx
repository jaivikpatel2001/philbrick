"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiArrowUpRight, FiChevronRight } from "react-icons/fi";
import type { NavItem, MegaCategory } from "@/types";
import styles from "./MegaMenu.module.css";

interface MegaMenuProps {
  item: NavItem;
  /** Close the whole menu once a destination is chosen. */
  onNavigate: () => void;
}

/**
 * Products menu — the client's own two-level structure, styled to match the
 * About dropdown (NavDropdown): one vertical list of all 14 categories in
 * their published order, and a submenu for the five that have children.
 *
 * Nothing scrolls. The menu grows to its natural height exactly like the
 * client's WordPress site, and the page scrolls if it runs past the fold. That
 * is why the submenu is a plain child of its row and positioned with pure CSS —
 * an earlier version had to measure row offsets and track scrollTop because the
 * scrolling list clipped it.
 *
 * Opens on hover AND click. A category with children is a group label, so it
 * renders as a button and does not navigate; the other nine are plain links.
 */
export function MegaMenu({ item, onNavigate }: MegaMenuProps) {
  const categories: MegaCategory[] =
    item.mega?.categories ?? item.mega?.groups.flatMap((g) => g.categories) ?? [];
  const [open, setOpen] = useState<string | null>(null);

  if (!item.mega || categories.length === 0) return null;

  return (
    <motion.div
      className={styles.panel}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      role="menu"
    >
      <ul className={styles.list}>
        {categories.map((cat) => {
          const children = cat.children ?? [];
          const hasChildren = children.length > 0;
          const isOpen = open === cat.slug;

          return (
            <li
              key={cat.slug}
              data-slug={cat.slug}
              className={styles.row}
              /* hovering a childless row dismisses whichever submenu is
                 showing, so the panel always reflects the row under the
                 pointer */
              onMouseEnter={() => setOpen(hasChildren ? cat.slug : null)}
            >
              {hasChildren ? (
                <button
                  type="button"
                  className={`${styles.link} ${isOpen ? styles.linkOpen : ""}`}
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : cat.slug)}
                >
                  <span className={styles.label}>{cat.label}</span>
                  <FiChevronRight className={styles.chevron} aria-hidden />
                </button>
              ) : (
                <Link
                  href={cat.href}
                  className={styles.link}
                  role="menuitem"
                  onClick={onNavigate}
                >
                  <span className={styles.label}>
                    {cat.label}
                    <FiArrowUpRight className={styles.arrow} aria-hidden />
                  </span>
                </Link>
              )}

              {hasChildren && isOpen && (
                <div className={styles.flyout}>
                  <ul>
                    {children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={styles.link}
                          role="menuitem"
                          onClick={onNavigate}
                        >
                          <span className={styles.label}>
                            {child.label}
                            <FiArrowUpRight className={styles.arrow} aria-hidden />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <Link href={item.href} className={styles.viewAll} onClick={onNavigate}>
        View all products <FiArrowRight aria-hidden />
      </Link>
    </motion.div>
  );
}
