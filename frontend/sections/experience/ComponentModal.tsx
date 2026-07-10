"use client";
import { useEffect, useRef, createElement } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import type { ElevatorComponent } from "@/data/elevatorComponents";
import { getIcon } from "@/lib/icons";
import styles from "./ComponentModal.module.css";

export function ComponentModal({
  component,
  onClose,
}: {
  component: ElevatorComponent | null;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!component) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const id = window.setTimeout(() => panelRef.current?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(id);
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
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
          <FiX />
        </button>

        <div className={styles.head}>
          <span className={styles.icon}>
            {createElement(icon)}
          </span>
          <span className={styles.index}>{component.index}</span>
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
      </div>
    </div>,
    document.body
  );
}
