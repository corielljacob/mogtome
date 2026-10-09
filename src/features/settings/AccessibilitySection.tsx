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
  const colorHelp =
    settings.colorblindMode === "none" ? undefined : selectedMode?.description;

  return (
    <SettingsCard icon="eye" title="Accessibility">
      <div className="settings-comfort-groups">
        <fieldset className="settings-fieldset settings-comfort-group">
          <legend className="settings-subheading">
            <SettingsIcon name="book" size={18} /> Reading
          </legend>
          <SettingRow label="Larger text">
            <ToggleSwitch
              label="Larger text"
              enabled={settings.largeText}
              onChange={() => toggleSetting("largeText")}
            />
          </SettingRow>
          <SettingRow
            label="Dyslexia-friendly font"
            description="Wider letter and word spacing."
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
          <SettingRow label="High contrast">
            <ToggleSwitch
              label="High contrast"
              enabled={settings.highContrast}
              onChange={() => toggleSetting("highContrast")}
            />
          </SettingRow>
          <SettingRow
            label="Extra dark"
            description="Darker backgrounds in Dark mode."
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
                aria-describedby={colorHelp ? `${colorId}-help` : undefined}
              >
                {COLORBLIND_MODES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {value === "none" ? "Default colors" : label}
                  </option>
                ))}
              </select>
              <SettingsIcon name="chevron" size={17} />
            </div>
            {colorHelp && (
              <p className="settings-help" id={`${colorId}-help`}>
                {colorHelp}
              </p>
            )}
          </div>
        </fieldset>

        <fieldset className="settings-fieldset settings-comfort-group">
          <legend className="settings-subheading">
            <SettingsIcon name="motion" size={18} /> Motion &amp; navigation
          </legend>
          <SettingRow
            label="Reduce motion"
            description="Turn off animations and smooth scrolling."
          >
            <ToggleSwitch
              label="Reduce motion"
              enabled={settings.reducedMotion}
              onChange={() => toggleSetting("reducedMotion")}
            />
          </SettingRow>
          <SettingRow
            label="Stronger focus outlines"
            description="Highlight the focused control when using the keyboard."
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
