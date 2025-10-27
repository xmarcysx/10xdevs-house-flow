import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    // Pobierz zapisany motyw z localStorage
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    // Funkcja do aktualizacji motywu
    const updateTheme = () => {
      let effectiveTheme: "dark" | "light" = "light";

      if (theme === "system") {
        effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      } else {
        effectiveTheme = theme;
      }

      root.classList.remove("light", "dark");
      root.classList.add(effectiveTheme);
      setResolvedTheme(effectiveTheme);
    };

    updateTheme();

    // Nasłuchuj zmian preferencji systemu jeśli motyw jest ustawiony na system
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => updateTheme();

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const setThemeWithStorage = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setThemeWithStorage("light");
    } else {
      setThemeWithStorage("dark");
    }
  };

  return {
    theme,
    resolvedTheme,
    setTheme: setThemeWithStorage,
    toggleTheme,
  };
}
