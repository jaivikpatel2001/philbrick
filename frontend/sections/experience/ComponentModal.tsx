"use client";
import { useEffect, useRef, createElement } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { FiX, FiArrowRight } from "react-icons/fi";
import type { ElevatorComponent } from "@/data/elevatorComponents";
import { getIcon } from "@/lib/icons";
import { stopLenis, startLenis } from "@/components/providers/SmoothScroll";
import styles from "./ComponentModal.module.css";

/**
 * Hotspot detail modal. Premium image + information split: a realistic render
 * of the elevator part (public/images/3D_Elevetor, served as responsive WebP)
 * beside its name, description, specs and benefits.
 *
 * Accessibility: role="dialog" + aria-modal, Escape to close, focus moved into
 * the panel on open and restored to the trigger on close, a lightweight Tab
 * trap, and background scroll locked (Lenis paused + overflow hidden) so the
 * page never moves behind it. Theme-aware via design tokens.
 */
export function ComponentModal({
  component,
  onClose,
}: {
  component: ElevatorComponent | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!component) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Lock the page behind the modal.
    stopLenis();
    document.documentElement.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Minimal focus trap: keep Tab within the panel.
      if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const id = window.setTimeout(() => closeRef.current?.focus(), 40);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(id);
      startLenis();
      document.documentElement.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [component, onClose]);

  if (typeof document === "undefined" || !component) return null;
  const icon = getIcon(component.iconName);

  return createPortal(
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="component-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        >
          <FiX />
        </button>

        {/* Realistic part image — 4:3, no crop (container matches source ratio) */}
        <div className={styles.media}>
          <Image
            src={component.image}
            alt={`Philbrick ${component.name} shown in a modern elevator`}
            fill
            sizes="(max-width: 720px) 92vw, 460px"
            className={styles.mediaImg}
          />
          <span className={styles.mediaIndex} aria-hidden>
            {component.index}
          </span>
        </div>

        {/* Scrollable info column */}
        <div className={styles.body}>
          <div className={styles.head}>
            <span className={styles.icon}>{createElement(icon)}</span>
            <span className={styles.tagline}>{component.tagline}</span>
          </div>

          <h2 id="component-modal-title" className={styles.name}>
            {component.name}
          </h2>
          <p className={styles.desc}>{component.description}</p>

          <div className={styles.cols}>
            <div className={styles.specs}>
              <h3 className={styles.subhead}>Specifications</h3>
              <dl>
                {component.specs.map((s) => (
                  <div key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className={styles.benefits}>
              <h3 className={styles.subhead}>Benefits</h3>
              <ul>
                {component.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>

          <Link href="/products" className={styles.cta} onClick={onClose}>
            Explore Philbrick products
            <FiArrowRight aria-hidden />
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
