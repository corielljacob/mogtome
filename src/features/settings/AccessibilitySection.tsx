import { useId } from "react";
import {
  useAccessibility,
  COLORBLIND_MODES,
  type ColorblindMode,
} from "@/shared/contexts/AccessibilityContext";
import { useTheme } from "@/shared/contexts/ThemeContext";
import { SettingsCard, SettingRow, ToggleSwitch } from "./SettingsControls";
import { SettingsIcon } from "./SettingsIcons";
import "./settings-comfort.css";

export function AccessibilitySection() {
  const { settings, toggleSetting, updateSetting } = useAccessibility();
  const { isDarkMode } = useTheme();
  const colorId = useId();
  const darkHelpId = useId();
  const selectedMode = COLORBLIND_MODES.find(
    (mode) => mode.value === settings.colorblindMode,
  );

  return (
    <SettingsCard
      icon="eye"
      title="Accessibility"
      description="Adjust the text, colors, and motion to suit you."
    >
      <div className="settings-comfort-groups">
        <fieldset className="settings-fieldset settings-comfort-group">
          <legend className="settings-subheading">
            <SettingsIcon name="book" size={18} /> Reading
          </legend>
          <SettingRow
            label="Larger text"
            description="Increase text size across the site."
          >
            <ToggleSwitch
              label="Larger text"
              enabled={settings.largeText}
              onChange={() => toggleSetting("largeText")}
            />
          </SettingRow>
          <SettingRow
            label="Dyslexia-friendly font"
            description="Use a reading font with wider spacing."
          >
            <ToggleSwitch
              label="Dyslexia-friendly font"
              enabled={settings.dyslexiaFont}
              onChange={() => toggleSetting("dyslexiaFont")}
            />
          </SettingRow>
        </fieldset>

        <fieldset className="settings-fieldset settings-comfort-group">
          <legend className="settings-subheading">
            <SettingsIcon name="contrast" size={18} /> Display
          </legend>
          <SettingRow
            label="High contrast"
            description="Make text and controls stand out more clearly."
          >
            <ToggleSwitch
              label="High contrast"
              enabled={settings.highContrast}
              onChange={() => toggleSetting("highContrast")}
            />
          </SettingRow>
          <SettingRow
            label="Extra dark"
            description="Use deeper blacks in dark mode."
            disabled={!isDarkMode}
          >
            <ToggleSwitch
              label="Extra dark"
              enabled={settings.extraDark}
              onChange={() => toggleSetting("extraDark")}
              disabled={!isDarkMode}
              describedBy={!isDarkMode ? darkHelpId : undefined}
            />
          </SettingRow>
          {!isDarkMode && (
            <p
              className="settings-help settings-comfort-dark-help"
              id={darkHelpId}
            >
              <SettingsIcon name="info" size={16} /> Choose Dark in Appearance
              to use extra dark.
            </p>
          )}
          <div className="settings-comfort-color">
            <label htmlFor={colorId}>Color vision</label>
            <div className="settings-comfort-select">
              <select
                id={colorId}
                value={settings.colorblindMode}
                onChange={(event) =>
                  updateSetting(
                    "colorblindMode",
                    event.target.value as ColorblindMode,
                  )
                }
                aria-describedby={`${colorId}-help`}
              >
                {COLORBLIND_MODES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {value === "none" ? "Default colors" : label}
                  </option>
                ))}
              </select>
              <SettingsIcon name="chevron" size={17} />
            </div>
            <p className="settings-help" id={`${colorId}-help`}>
              {selectedMode?.description ?? "Default colors"}
            </p>
          </div>
        </fieldset>

        <fieldset className="settings-fieldset settings-comfort-group">
          <legend className="settings-subheading">
            <SettingsIcon name="motion" size={18} /> Motion &amp; navigation
          </legend>
          <SettingRow
            label="Reduce motion"
            description="Reduce animations and turn off smooth scrolling."
          >
            <ToggleSwitch
              label="Reduce motion"
              enabled={settings.reducedMotion}
              onChange={() => toggleSetting("reducedMotion")}
            />
          </SettingRow>
          <SettingRow
            label="Stronger focus outlines"
            description="Make it easier to see where you are when using the keyboard."
          >
            <ToggleSwitch
              label="Stronger focus outlines"
              enabled={settings.enhancedFocus}
              onChange={() => toggleSetting("enhancedFocus")}
            />
          </SettingRow>
        </fieldset>
      </div>
    </SettingsCard>
  );
}
