"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiArrowRight, FiChevronRight } from "react-icons/fi";
import type { NavItem } from "@/types";
import { cn } from "@/utils/cn";
import styles from "./MegaMenu.module.css";

interface MegaMenuProps {
  item: NavItem;
  onEnter: () => void;
  onLeave: () => void;
}

/**
 * Enterprise two-pane mega menu. Left rail lists product categories (grouped);
 * hovering/focusing a category reveals its sub-products (or a category CTA) in
 * the detail pane. A flagship feature card sits on the right at wide widths.
 * Keyboard accessible: category links set the active pane on focus.
 */
export function MegaMenu({ item, onEnter, onLeave }: MegaMenuProps) {
  const allCats = item.mega ? item.mega.groups.flatMap((g) => g.categories) : [];
  const [activeSlug, setActiveSlug] = useState(allCats[0]?.slug);

  if (!item.mega) return null;
  const { groups, feature } = item.mega;
  const active = allCats.find((c) => c.slug === activeSlug) ?? allCats[0];

  return (
    <motion.div
      className={styles.panel}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className={`container--wide ${styles.inner}`}>
        {/* Left rail — grouped categories */}
        <nav className={styles.rail} aria-label="Product categories">
          {groups.map((group) => (
            <div key={group.title} className={styles.railGroup}>
              <p className={styles.railTitle}>{group.title}</p>
              <ul>
                {group.categories.map((cat) => (
                  <li key={cat.slug}>
                    <Link
                      href={cat.href}
                      className={cn(
                        styles.railLink,
                        cat.slug === active?.slug && styles.railLinkActive
                      )}
                      onMouseEnter={() => setActiveSlug(cat.slug)}
                      onFocus={() => setActiveSlug(cat.slug)}
                    >
                      <span>{cat.label}</span>
                      {cat.children.length > 0 && (
                        <FiChevronRight className={styles.railChev} aria-hidden />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Detail pane — active category's sub-products or CTA */}
        {active && (
          <div className={styles.detail} key={active.slug}>
            <div className={styles.detailHead}>
              <div>
                <p className={styles.detailTitle}>{active.label}</p>
                <p className={styles.detailDesc}>{active.description}</p>
              </div>
              <Link href={active.href} className={styles.viewAll}>
                View all <FiArrowRight aria-hidden />
              </Link>
            </div>

            {active.children.length > 0 ? (
              <ul className={styles.children}>
                {active.children.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.childLink}>
                      <span className={styles.childLabel}>
                        {link.label}
                        <FiArrowUpRight className={styles.childArrow} aria-hidden />
                      </span>
                      {link.description && (
                        <span className={styles.childDesc}>{link.description}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <Link href={active.href} className={styles.leaf}>
                <Image
                  src={active.image}
                  alt={active.label}
                  fill
                  sizes="440px"
                  className={styles.leafImg}
                />
                <span className={styles.leafCta}>
                  Explore {active.label} <FiArrowUpRight aria-hidden />
                </span>
              </Link>
            )}
          </div>
        )}

        {/* Flagship feature */}
        {feature && (
          <Link href={feature.href} className={styles.feature}>
            <Image
              src={feature.image}
              alt={feature.title}
              fill
              sizes="300px"
              className={styles.featureImg}
            />
            <span className={styles.featureBody}>
              <span className={styles.featureEyebrow}>{feature.eyebrow}</span>
              <span className={styles.featureTitle}>{feature.title}</span>
              <span className={styles.featureDesc}>{feature.description}</span>
              <span className={styles.featureCta}>
                Explore <FiArrowUpRight aria-hidden />
              </span>
            </span>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
