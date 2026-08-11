import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolved: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "system",
  setMode: () => {},
  resolved: "light",
});

const STORAGE_KEY = "zico-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "system";
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  });

  const [resolved, setResolved] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const initial = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    if (initial === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return initial === "dark" ? "dark" : "light";
  });

  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const next = mode === "system" ? (media.matches ? "dark" : "light") : mode;
      setResolved(next as "light" | "dark");
      document.documentElement.classList.toggle("dark", next === "dark");
    };
    apply();
    return () => {};
  }, [mode]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (mode === "system") {
        const next = media.matches ? "dark" : "light";
        setResolved(next);
        document.documentElement.classList.toggle("dark", next === "dark");
      }
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch (e) {}
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, setMode, resolved }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
