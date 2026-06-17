"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import type { NavItem } from "@/types";
import styles from "./MegaMenu.module.css";

interface MegaMenuProps {
  item: NavItem;
  onEnter: () => void;
  onLeave: () => void;
}

export function MegaMenu({ item, onEnter, onLeave }: MegaMenuProps) {
  if (!item.mega) return null;
  const { columns, feature } = item.mega;

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
      <div className={`container--wide ${styles.grid}`}>
        <div className={styles.columns}>
          {columns.map((col) => (
            <div key={col.title} className={styles.column}>
              <p className={styles.colTitle}>{col.title}</p>
              <ul className={styles.colLinks}>
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.link}>
                      <span className={styles.linkLabel}>
                        {link.label}
                        <FiArrowUpRight className={styles.linkArrow} />
                      </span>
                      {link.description && (
                        <span className={styles.linkDesc}>
                          {link.description}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {feature && (
          <Link href={feature.href} className={styles.feature}>
            <Image
              src={feature.image}
              alt={feature.title}
              fill
              sizes="380px"
              className={styles.featureImg}
            />
            <span className={styles.featureBody}>
              <span className={styles.featureEyebrow}>{feature.eyebrow}</span>
              <span className={styles.featureTitle}>{feature.title}</span>
              <span className={styles.featureDesc}>{feature.description}</span>
              <span className={styles.featureCta}>
                Explore <FiArrowUpRight />
              </span>
            </span>
          </Link>
        )}
      </div>
    </motion.div>
  );
}
