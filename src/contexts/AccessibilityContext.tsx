import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Colorblind mode options */
export type ColorblindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochromacy';

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
export type ToggleableSettingKey = Exclude<keyof AccessibilitySettings, 'colorblindMode'>;

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  toggleSetting: (key: ToggleableSettingKey) => void;
  resetSettings: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'mogtome-accessibility';

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  extraDark: false,
  largeText: false,
  reducedMotion: false,
  enhancedFocus: false,
  dyslexiaFont: false,
  colorblindMode: 'none',
};

/** All available colorblind modes */
export const COLORBLIND_MODES: { value: ColorblindMode; label: string; description: string }[] = [
  { value: 'none', label: 'None', description: 'Default colors' },
  { value: 'protanopia', label: 'Protanopia', description: 'Red-blind friendly (blue/yellow palette)' },
  { value: 'deuteranopia', label: 'Deuteranopia', description: 'Green-blind friendly (blue/yellow palette)' },
  { value: 'tritanopia', label: 'Tritanopia', description: 'Blue-blind friendly (red/green palette)' },
  { value: 'monochromacy', label: 'Monochromacy', description: 'Grayscale for complete color blindness' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Load from localStorage on initial render
    if (typeof window === 'undefined') return defaultSettings;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to handle new settings added in future versions
        return { ...defaultSettings, ...parsed };
      }
    } catch {
      // Invalid JSON, use defaults
    }
    
    // Check system preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    return {
      ...defaultSettings,
      reducedMotion: prefersReducedMotion,
    };
  });

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // High contrast mode
    root.classList.toggle('high-contrast', settings.highContrast);
    
    // Extra dark mode (only applies when dark mode is active)
    root.classList.toggle('extra-dark', settings.extraDark);
    
    // Large text mode
    root.classList.toggle('large-text', settings.largeText);
    
    // Reduced motion
    root.classList.toggle('reduce-motion', settings.reducedMotion);
    
    // When reduced motion is enabled, force stop all CSS animations immediately
    // by triggering a style recalculation
    if (settings.reducedMotion) {
      // Get all animated elements and force them to their final state
      const animatedElements = document.querySelectorAll('[class*="animate-"], .animate-spin, .animate-pulse, .animate-bounce, .animate-ping');
      animatedElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        // Force a reflow to immediately apply the animation: none style
        htmlEl.style.animation = 'none';
      });
    }
    
    // Enhanced focus
    root.classList.toggle('enhanced-focus', settings.enhancedFocus);
    
    // Dyslexia-friendly font
    body.classList.toggle('dyslexia-font', settings.dyslexiaFont);
    
    // Colorblind mode - remove all, then add selected
    root.classList.remove('colorblind-protanopia', 'colorblind-deuteranopia', 'colorblind-tritanopia', 'colorblind-monochromacy');
    if (settings.colorblindMode !== 'none') {
      root.classList.add(`colorblind-${settings.colorblindMode}`);
    }
    
    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage might be full or disabled
    }
  }, [settings]);

  // Listen for system reduced motion preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-update if user hasn't explicitly set a preference
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleSetting = useCallback((key: ToggleableSettingKey) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
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
    <AccessibilityContext.Provider value={{ settings, updateSetting, toggleSetting, resetSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
