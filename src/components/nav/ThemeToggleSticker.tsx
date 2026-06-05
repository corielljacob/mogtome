import { memo } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export const ThemeToggleSticker = memo(function ThemeToggleSticker() {
  const { isDarkMode, setColorMode } = useTheme();
  return (
    <button
      onClick={() => setColorMode(isDarkMode ? "light" : "dark")}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="group relative flex items-center justify-center w-12 h-12 rounded-r-2xl -translate-x-1.5 hover:translate-x-0 transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]"
      style={{
        background: "color-mix(in srgb, var(--accent) 20%, var(--card))",
        color: "var(--accent)",
        boxShadow:
          "0 0 0 3px var(--card), 2px 3px 0 0 color-mix(in srgb, var(--accent) 28%, transparent)",
      }}
    >
      <Sun
        className="absolute w-5 h-5 transition-all duration-300"
        style={{
          transform: isDarkMode
            ? "rotate(90deg) scale(0)"
            : "rotate(0deg) scale(1)",
          opacity: isDarkMode ? 0 : 1,
        }}
      />
      <Moon
        className="absolute w-5 h-5 transition-all duration-300"
        style={{
          transform: isDarkMode
            ? "rotate(0deg) scale(1)"
            : "rotate(-90deg) scale(0)",
          opacity: isDarkMode ? 1 : 0,
        }}
      />
    </button>
  );
});
