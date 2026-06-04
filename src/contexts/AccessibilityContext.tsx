import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export type ColorblindMode =
  | "none"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "monochromacy";

export interface AccessibilitySettings {
  /** High contrast mode - increases color contrast for better visibility */
  highContrast: boolean;
  /** Extra dark mode - deeper blacks for OLED screens and light sensitivity */
  extraDark: boolean;
  /** Large text mode - increases base font size */
  largeText: boolean;
  /** Reduced motion - disables animations (also respects prefers-reduced-motion) */
  reducedMotion: boolean;
  /** Focus indicators - makes focus outlines more visible */
  enhancedFocus: boolean;
  /** Dyslexia-friendly font - uses more readable font spacing */
  dyslexiaFont: boolean;
  /** Colorblind mode - adjusts colors for different types of color vision deficiency */
  colorblindMode: ColorblindMode;
}

/** Keys that are boolean toggles */
export type ToggleableSettingKey = Exclude<
  keyof AccessibilitySettings,
  "colorblindMode"
>;

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K],
  ) => void;
  toggleSetting: (key: ToggleableSettingKey) => void;
  resetSettings: () => void;
}

const STORAGE_KEY = "mogtome-accessibility";

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  extraDark: false,
  largeText: false,
  reducedMotion: false,
  enhancedFocus: false,
  dyslexiaFont: false,
  colorblindMode: "none",
};

export const COLORBLIND_MODES: {
  value: ColorblindMode;
  label: string;
  description: string;
}[] = [
  { value: "none", label: "None", description: "Default colors" },
  {
    value: "protanopia",
    label: "Protanopia",
    description: "Red-blind friendly (blue/yellow palette)",
  },
  {
    value: "deuteranopia",
    label: "Deuteranopia",
    description: "Green-blind friendly (blue/yellow palette)",
  },
  {
    value: "tritanopia",
    label: "Tritanopia",
    description: "Blue-blind friendly (red/green palette)",
  },
  {
    value: "monochromacy",
    label: "Monochromacy",
    description: "Grayscale for complete color blindness",
  },
];

const AccessibilityContext = createContext<AccessibilityContextType | null>(
  null,
);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    if (typeof window === "undefined") return defaultSettings;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // merge with defaults so settings added in future versions get a value
        return { ...defaultSettings, ...parsed };
      }
    } catch {
      // invalid JSON, use defaults
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    return {
      ...defaultSettings,
      reducedMotion: prefersReducedMotion,
    };
  });

  // apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.classList.toggle("high-contrast", settings.highContrast);
    root.classList.toggle("extra-dark", settings.extraDark);
    root.classList.toggle("large-text", settings.largeText);
    root.classList.toggle("reduce-motion", settings.reducedMotion);

    // force-stop any in-flight CSS animations now rather than waiting for the class
    if (settings.reducedMotion) {
      const animatedElements = document.querySelectorAll(
        '[class*="animate-"], .animate-spin, .animate-pulse, .animate-bounce, .animate-ping',
      );
      animatedElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.style.animation = "none";
      });
    }

    root.classList.toggle("enhanced-focus", settings.enhancedFocus);
    body.classList.toggle("dyslexia-font", settings.dyslexiaFont);

    root.classList.remove(
      "colorblind-protanopia",
      "colorblind-deuteranopia",
      "colorblind-tritanopia",
      "colorblind-monochromacy",
    );
    if (settings.colorblindMode !== "none") {
      root.classList.add(`colorblind-${settings.colorblindMode}`);
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // storage might be full or disabled
    }
  }, [settings]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e: MediaQueryListEvent) => {
      // don't override a preference the user has explicitly saved
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setSettings((prev) => ({ ...prev, reducedMotion: e.matches }));
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const updateSetting = useCallback(
    <K extends keyof AccessibilitySettings>(
      key: K,
      value: AccessibilitySettings[K],
    ) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleSetting = useCallback((key: ToggleableSettingKey) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{ settings, updateSetting, toggleSetting, resetSettings }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider",
    );
  }
  return context;
}
