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

/** Inline script — runs before paint to set [data-theme] and avoid FOUC.
 *  Brand default is DARK for every first-time visitor (the OS colour-scheme is
 *  deliberately ignored); a theme the visitor picked via the toggle is saved in
 *  localStorage and wins on every return visit. */
export const themeInitScript = `(function(){var t='dark';try{var s=localStorage.getItem('${STORAGE_KEY}');if(s==='light'||s==='dark'){t=s;}}catch(e){}document.documentElement.setAttribute('data-theme',t);var m=document.querySelector('meta[name="theme-color"]');if(m){m.setAttribute('content',t==='dark'?'#0A0E14':'#FFFFFF');}document.documentElement.classList.remove('no-js');document.documentElement.classList.add('js');})();`;

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
    // keep the browser-chrome tint in step with the chosen theme
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", t === "dark" ? "#0A0E14" : "#FFFFFF");
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
