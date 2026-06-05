import { Sun, Moon, Monitor, Palette, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  useTheme,
  THEME_DEFINITIONS,
  type ColorMode,
} from "@/contexts/ThemeContext";
import { SettingsCard, Collapsible } from "@/components/settings/SettingsControls";

export function ThemeSection() {
  const { settings, setColorMode, setColorTheme } = useTheme();
  const modeOptions: { value: ColorMode; label: string; icon: LucideIcon }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];
  const currentTheme = THEME_DEFINITIONS.find(
    (t) => t.id === settings.colorTheme,
  );

  return (
    <SettingsCard
      icon={Palette}
      title="Appearance"
      accent="var(--primary)"
      pinColor="var(--secondary)"
      tilt={-0.5}
    >
      <fieldset aria-label="Color mode">
        <legend className="font-soft text-xs text-[var(--text-muted)] mb-2">
          Mode
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {modeOptions.map(({ value, label, icon: Icon }) => {
            const sel = settings.colorMode === value;
            return (
              <button
                key={value}
                onClick={() => setColorMode(value)}
                aria-pressed={sel}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-2xl border-2 font-display font-bold text-xs cursor-pointer transition-all
                  focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
                  ${
                    sel
                      ? "bg-[var(--primary)] text-white border-transparent"
                      : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] hover:border-[color:color-mix(in_srgb,var(--primary)_35%,var(--border))] hover:text-[var(--text)]"
                  }`}
                style={
                  sel
                    ? {
                        boxShadow:
                          "0 3px 0 0 color-mix(in srgb, var(--primary) 55%, #000)",
                      }
                    : undefined
                }
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <Collapsible
        icon={Palette}
        label="Color Theme"
        value={currentTheme?.name}
        accent="var(--secondary)"
      >
        <div
          className="grid grid-cols-2 gap-2"
          role="radiogroup"
          aria-label="Color theme options"
        >
          {THEME_DEFINITIONS.map((theme) => {
            const sel = settings.colorTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setColorTheme(theme.id)}
                role="radio"
                aria-checked={sel}
                className={`flex items-center gap-2.5 p-2.5 rounded-2xl border-2 text-left cursor-pointer transition-all
                  focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
                  ${
                    sel
                      ? "border-[var(--primary)] bg-[color:color-mix(in_srgb,var(--primary)_10%,var(--card))]"
                      : "border-[var(--border)] hover:border-[color:color-mix(in_srgb,var(--primary)_30%,var(--border))]"
                  }`}
              >
                <span className="flex items-center gap-0.5 shrink-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: theme.preview.primary }}
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: theme.preview.secondary }}
                  />
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: theme.preview.accent }}
                  />
                </span>
                <span
                  className={`font-soft text-sm flex-1 truncate ${sel ? "text-[var(--primary)] font-bold" : "text-[var(--text)]"}`}
                >
                  {theme.name}
                </span>
                {sel && (
                  <Check
                    className="w-4 h-4 text-[var(--primary)] shrink-0"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </Collapsible>
    </SettingsCard>
  );
}
