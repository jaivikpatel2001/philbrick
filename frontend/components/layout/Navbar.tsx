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
import { NavDropdown } from "./NavDropdown";
import { MobileNav } from "./MobileNav";
import { cn } from "@/utils/cn";
import styles from "./Navbar.module.css";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const pathname = usePathname();

  /* Every page now opens on a dark hero: inner pages use dark photo heroes and
     the homepage's frame-sequence hero is a dark studio scene in both themes.
     If the Three.js hero returns (daylight scene in light theme), restore:
       const { theme } = useTheme();
       const overlay = pathname === "/" && theme === "light" ? "light" : "dark"; */
  const overlay = "dark";

  /* Read inside the scroll handler without re-subscribing on every open/close. */
  const activeRef = useRef<number | null>(null);
  activeRef.current = active;

  useEffect(() => {
    const onScroll = () => {
      /* Hold the compact/tall state steady while a menu is open: the header is
         released into the document then (see openMenu), and letting `.inner`
         shrink mid-scroll would drag the menu up a few extra pixels — a small
         but visible jolt on the first scroll. */
      if (activeRef.current !== null) return;
      setScrolled(window.scrollY > 12);
    };
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

  /* Menus respond to BOTH hover and click. "About" and "Products" are group
     labels rather than destinations, so they render as buttons and never
     navigate — clicking one toggles its menu, hovering opens it.

     The panels are DOM descendants of their <li>, so hovering a panel does not
     fire the item's mouseleave; the short close delay only has to cover the
     few pixels of gap between the trigger and the panel. */
  const cancelClose = () => window.clearTimeout(closeTimer.current);

  /**
   * The Products menu is taller than most viewports and does not scroll
   * internally (by client direction — it expands to its natural height like
   * their WordPress site). But the header is sticky/fixed, so an open menu
   * stayed pinned while the page scrolled underneath it and the lower items
   * could never be reached.
   *
   * While a menu is open the header is therefore released into the document at
   * its current scroll offset: it looks identical at the moment of opening, and
   * from then on it scrolls away with the page, carrying the menu with it —
   * which is how the client's own (non-sticky) header behaves.
   */
  const [pinnedTop, setPinnedTop] = useState<number | null>(null);

  const openMenu = (i: number | ((prev: number | null) => number | null)) => {
    setActive((prev) => {
      const next = typeof i === "function" ? i(prev) : i;
      if (next === null) setPinnedTop(null);
      else if (prev === null) setPinnedTop(window.scrollY);
      return next;
    });
  };

  const openOnHover = (i: number) => {
    cancelClose();
    if (hasSubmenu(i)) openMenu(i);
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => openMenu(() => null), 160);
  };

  const toggle = (i: number) => {
    cancelClose();
    openMenu((prev) => (prev === i ? null : i));
  };

  const close = () => {
    cancelClose();
    openMenu(() => null);
  };

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  /* Close on outside click and on Escape (focus returns to the trigger). */
  useEffect(() => {
    if (active === null) return;

    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const i = active;
      close();
      navRef.current
        ?.querySelectorAll<HTMLButtonElement>("[data-nav-trigger]")
        .forEach((b) => {
          if (Number(b.dataset.navTrigger) === i) b.focus();
        });
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [active]);

  return (
    <>
      <header
        className={cn(styles.header, active !== null && styles.megaOpen)}
        data-scrolled={scrolled}
        data-overlay={overlay}
        /* released into the document while a menu is open — see openMenu().
           Inline so it also overrides the floating navbar's `position: fixed`
           on pages that opt into it. */
        style={
          pinnedTop !== null
            ? { position: "absolute", top: pinnedTop, insetInline: 0 }
            : undefined
        }
      >
        <div className={cn("container--wide", styles.inner)}>
          <Logo priority />

          <nav className={styles.nav} aria-label="Primary" ref={navRef}>
            <ul className={styles.navList}>
              {MAIN_NAV.map((item, i) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                const submenu = hasSubmenu(i);

                return (
                  <li
                    key={item.label}
                    className={styles.navItem}
                    onMouseEnter={() => openOnHover(i)}
                    onMouseLeave={submenu ? scheduleClose : undefined}
                  >
                    {submenu ? (
                      /* group label, not a destination — opens on click */
                      <button
                        type="button"
                        data-nav-trigger={i}
                        className={cn(
                          styles.navLink,
                          (isActive || active === i) && styles.navLinkActive
                        )}
                        aria-expanded={active === i}
                        aria-haspopup="menu"
                        onClick={() => toggle(i)}
                      >
                        {item.label}
                        <span className={styles.caret} aria-hidden />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          styles.navLink,
                          isActive && styles.navLinkActive
                        )}
                      >
                        {item.label}
                      </Link>
                    )}

                    {/* Both menus are anchored to THIS item: the panels use
                        `left: 0`, so they must live inside the positioned <li>
                        or they align to the header's left edge instead. */}
                    <AnimatePresence>
                      {active === i && item.dropdown && (
                        <NavDropdown links={item.dropdown} onNavigate={close} />
                      )}
                      {active === i && item.mega && (
                        <MegaMenu item={item} onNavigate={close} />
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

      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
