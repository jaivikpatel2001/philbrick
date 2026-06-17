"use client";
import { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/utils/cn";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(styles.toggle, className)}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      <span
        className={styles.track}
        data-state={mounted ? (isDark ? "dark" : "light") : "dark"}
      >
        <span className={styles.thumb}>
          {isDark ? <FiMoon /> : <FiSun />}
        </span>
      </span>
    </button>
  );
}
