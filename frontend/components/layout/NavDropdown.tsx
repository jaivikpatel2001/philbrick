"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import type { NavLink } from "@/types";
import styles from "./NavDropdown.module.css";

interface NavDropdownProps {
  links: NavLink[];
  onEnter: () => void;
  onLeave: () => void;
}

/** Compact flat dropdown anchored under a nav item (e.g. About). */
export function NavDropdown({ links, onEnter, onLeave }: NavDropdownProps) {
  return (
    <motion.div
      className={styles.panel}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      role="menu"
    >
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={styles.link} role="menuitem">
              <span className={styles.label}>
                {link.label}
                <FiArrowUpRight className={styles.arrow} aria-hidden />
              </span>
              {link.description && (
                <span className={styles.desc}>{link.description}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
