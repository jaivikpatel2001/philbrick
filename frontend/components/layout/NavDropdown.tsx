"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import type { NavLink } from "@/types";
import styles from "./NavDropdown.module.css";

interface NavDropdownProps {
  links: NavLink[];
  /** Close the menu once a destination is chosen. */
  onNavigate: () => void;
}

/** Compact flat dropdown anchored under a nav item (e.g. About). Opened by
    clicking the nav item — the trigger itself is a button, never a link. */
export function NavDropdown({ links, onNavigate }: NavDropdownProps) {
  return (
    <motion.div
      className={styles.panel}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      role="menu"
      data-lenis-prevent
    >
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={styles.link}
              role="menuitem"
              onClick={onNavigate}
            >
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
