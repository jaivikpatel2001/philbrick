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
import { useTheme } from "@/components/providers/ThemeProvider";
import { MegaMenu } from "./MegaMenu";
import { NavDropdown } from "./NavDropdown";
import { MobileNav } from "./MobileNav";
import { cn } from "@/utils/cn";
import styles from "./Navbar.module.css";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const pathname = usePathname();
  const { theme } = useTheme();

  /* What sits under the transparent navbar at the top of the page: inner pages
     always open on a dark photo hero; the homepage's 3D scene is dark at night
     but daylight in light theme — the only case needing dark-text controls. */
  const overlay = pathname === "/" && theme === "light" ? "light" : "dark";

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

  const hasSubmenu = (i: number) =>
    Boolean(MAIN_NAV[i].mega || MAIN_NAV[i].dropdown);

  const openSub = (i: number) => {
    window.clearTimeout(closeTimer.current);
    setActive(hasSubmenu(i) ? i : null);
  };
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActive(null), 140);
  };
  const keepOpen = () => window.clearTimeout(closeTimer.current);

  return (
    <>
      <header
        className={cn(styles.header, active !== null && styles.megaOpen)}
        data-scrolled={scrolled}
        data-overlay={overlay}
        onMouseLeave={scheduleClose}
      >
        <div className={cn("container--wide", styles.inner)}>
          <Logo priority />

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
                    onMouseEnter={() => openSub(i)}
                    onFocus={() => openSub(i)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node))
                        scheduleClose();
                    }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        styles.navLink,
                        (isActive || active === i) && styles.navLinkActive
                      )}
                      aria-expanded={hasSubmenu(i) ? active === i : undefined}
                      aria-haspopup={hasSubmenu(i) ? "menu" : undefined}
                    >
                      {item.label}
                      {hasSubmenu(i) && (
                        <span className={styles.caret} aria-hidden />
                      )}
                    </Link>

                    {/* Flat dropdown (e.g. About) — anchored to this item */}
                    <AnimatePresence>
                      {active === i && item.dropdown && (
                        <NavDropdown
                          links={item.dropdown}
                          onEnter={keepOpen}
                          onLeave={scheduleClose}
                        />
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={styles.actions}>
            <ThemeToggle className={styles.themeToggle} />
            <Button href="/contact" size="sm" className={styles.cta} withArrow>
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

        {/* Full-width mega menu (Products) */}
        <AnimatePresence>
          {active !== null && MAIN_NAV[active].mega && (
            <MegaMenu
              item={MAIN_NAV[active]}
              onEnter={keepOpen}
              onLeave={scheduleClose}
            />
          )}
        </AnimatePresence>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
