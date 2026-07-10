"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import { MAIN_NAV } from "@/constants/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { cn } from "@/utils/cn";
import styles from "./Navbar.module.css";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      setActive(null);
      setMobileOpen(false);
    });
  }, [pathname]);

  const openMega = (i: number) => {
    window.clearTimeout(closeTimer.current);
    setActive(MAIN_NAV[i].mega ? i : null);
  };
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActive(null), 140);
  };

  return (
    <>
      <header
        className={cn(styles.header, active !== null && styles.megaOpen)}
        data-scrolled={scrolled}
        onMouseLeave={scheduleClose}
      >
        <div className={cn("container--wide", styles.inner)}>
          <Logo />

          <nav className={styles.nav} aria-label="Primary">
            <ul className={styles.navList}>
              {MAIN_NAV.map((item, i) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <li
                    key={item.label}
                    className={styles.navItem}
                    onMouseEnter={() => openMega(i)}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        styles.navLink,
                        (isActive || active === i) && styles.navLinkActive
                      )}
                      aria-expanded={item.mega ? active === i : undefined}
                    >
                      {item.label}
                      {item.mega && <span className={styles.caret} aria-hidden />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={styles.actions}>
            <ThemeToggle className={styles.themeToggle} />
            <Button
              href="/contact"
              size="sm"
              className={styles.cta}
              withArrow
            >
              Get a quote
            </Button>
            <button
              type="button"
              className={styles.hamburger}
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <FiMenu />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {active !== null && MAIN_NAV[active].mega && (
            <MegaMenu
              item={MAIN_NAV[active]}
              onEnter={() => window.clearTimeout(closeTimer.current)}
              onLeave={scheduleClose}
            />
          )}
        </AnimatePresence>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
