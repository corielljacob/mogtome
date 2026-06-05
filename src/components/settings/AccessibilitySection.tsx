import { Accessibility, Eye } from "lucide-react";
import {
  useAccessibility,
  COLORBLIND_MODES,
  type ColorblindMode,
  type ToggleableSettingKey,
} from "@/shared/contexts/AccessibilityContext";
import { useTheme } from "@/shared/contexts/ThemeContext";
import {
  SettingsCard,
  SettingRow,
  Collapsible,
  ToggleSwitch,
} from "@/components/settings/SettingsControls";

interface AccessibilityOption {
  key: ToggleableSettingKey;
  label: string;
  description: string;
  requiresDark?: boolean;
}

const ACCESSIBILITY_OPTIONS: AccessibilityOption[] = [
  {
    key: "highContrast",
    label: "High Contrast",
    description: "Increases color contrast for better visibility",
  },
  {
    key: "extraDark",
    label: "Extra Dark",
    description: "Deeper blacks for OLED screens",
    requiresDark: true,
  },
  {
    key: "largeText",
    label: "Large Text",
    description: "Increases font size across the site",
  },
  {
    key: "reducedMotion",
    label: "Reduce Motion",
    description: "Minimizes animations and transitions",
  },
  {
    key: "enhancedFocus",
    label: "Enhanced Focus",
    description: "More visible focus indicators",
  },
  {
    key: "dyslexiaFont",
    label: "Dyslexia-Friendly",
    description: "Easier-to-read font spacing",
  },
];

export function AccessibilitySection() {
  const { settings, toggleSetting, updateSetting } = useAccessibility();
  const { isDarkMode } = useTheme();

  return (
    <SettingsCard
      icon={Accessibility}
      title="Accessibility"
      accent="var(--secondary)"
      pinColor="var(--accent)"
      tilt={-0.4}
    >
      <div className="divide-y divide-[color:color-mix(in_srgb,var(--text-subtle)_16%,transparent)]">
        {ACCESSIBILITY_OPTIONS.map(
          ({ key, label, description, requiresDark }) => {
            const isDisabled = requiresDark && !isDarkMode;
            return (
              <SettingRow
                key={key}
                label={label}
                description={
                  isDisabled ? `${description} (needs dark mode)` : description
                }
                disabled={isDisabled}
              >
                <ToggleSwitch
                  label={label}
                  enabled={settings[key]}
                  onChange={() => toggleSetting(key)}
                  disabled={isDisabled}
                />
              </SettingRow>
            );
          },
        )}
      </div>

      <Collapsible
        icon={Eye}
        label="Colorblind Mode"
        accent="var(--secondary)"
        value={
          settings.colorblindMode !== "none"
            ? COLORBLIND_MODES.find((m) => m.value === settings.colorblindMode)
                ?.label
            : undefined
        }
      >
        <div
          className="space-y-1"
          role="radiogroup"
          aria-label="Colorblind mode options"
        >
          {COLORBLIND_MODES.map(({ value, label, description }) => {
            const sel = settings.colorblindMode === value;
            return (
              <button
                key={value}
                onClick={() =>
                  updateSetting("colorblindMode", value as ColorblindMode)
                }
                role="radio"
                aria-checked={sel}
                className={`w-full flex items-center gap-2.5 py-2 px-2.5 rounded-xl text-left cursor-pointer transition-colors
                  focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
                  ${sel ? "bg-[color:color-mix(in_srgb,var(--primary)_10%,var(--card))]" : "hover:bg-[var(--bg)]"}`}
              >
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${sel ? "border-[var(--primary)] bg-[var(--primary)]" : "border-[color:color-mix(in_srgb,var(--text-muted)_45%,transparent)]"}`}
                >
                  {sel && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </span>
                <span className="min-w-0">
                  <span
                    className={`font-soft text-sm ${sel ? "text-[var(--primary)] font-bold" : "text-[var(--text)]"}`}
                  >
                    {label}
                  </span>
                  <span className="font-soft text-xs text-[var(--text-muted)] ml-1">
                    - {description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </Collapsible>
    </SettingsCard>
  );
}
