import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const KEY = "mm-theme";

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
  localStorage.setItem(KEY, theme);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem(KEY);
    if (stored === "dark" || stored === "light") return stored;
    return "light";
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return {
    theme,
    toggle: () => setTheme((current) => (current === "light" ? "dark" : "light")),
  };
}
