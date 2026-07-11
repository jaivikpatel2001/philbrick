"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ThemeMode } from "@/types";

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (t: ThemeMode) => void;
}

const STORAGE_KEY = "philbrick-theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

/** Inline script — runs before paint to set [data-theme] and avoid FOUC. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');})();`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as ThemeMode) ||
      "dark";
    Promise.resolve().then(() => {
      setThemeState(current);
    });
  }, []);

  const apply = useCallback((t: ThemeMode) => {
    document.documentElement.setAttribute("data-theme", t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* storage may be unavailable */
    }
    setThemeState(t);
  }, []);

  const toggleTheme = useCallback(() => {
    apply(theme === "dark" ? "light" : "dark");
  }, [theme, apply]);

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme: apply }),
    [theme, toggleTheme, apply]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>");
  return ctx;
}
