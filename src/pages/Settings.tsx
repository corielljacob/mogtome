import { useState } from 'react';
import { 
  Sun, 
  Moon, 
  Monitor,
  Palette,
  LogOut,
  ChevronRight,
  CalendarDays,
  Ban,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAccessibility, COLORBLIND_MODES, type ColorblindMode, type ToggleableSettingKey } from '../contexts/AccessibilityContext';
import { useTheme, THEME_DEFINITIONS, type ColorMode, type EventOverride } from '../contexts/ThemeContext';
import { SEASONAL_EVENTS } from '../constants/seasonalEvents';


// ─────────────────────────────────────────────────────────────────────────────
// Shared pieces
// ─────────────────────────────────────────────────────────────────────────────

function ToggleSwitch({ enabled, onChange, disabled = false }: { 
  enabled: boolean; 
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      role="switch"
      aria-checked={enabled}
      className={`
        relative w-[44px] h-[26px] rounded-full transition-colors duration-150 cursor-pointer flex-shrink-0
        focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:outline-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${enabled ? 'bg-[var(--primary)]' : 'bg-[var(--text-subtle)]/30'}
      `}
    >
      <div 
        className={`
          absolute top-[2px] left-[2px] w-[22px] h-[22px] rounded-full bg-white shadow-sm
          transition-transform duration-150
          ${enabled ? 'translate-x-[18px]' : 'translate-x-0'}
        `}
      />
    </button>
  );
}

function SettingRow({ label, description, children, disabled = false }: { 
  label: string; 
  description: string; 
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-3 py-2 ${disabled ? 'opacity-50' : ''}`}>
      <div className="min-w-0">
        <p className="font-soft font-medium text-sm text-[var(--text)]">{label}</p>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">{description}</p>
      </div>
      <div className="flex-shrink-0">
        {children}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Theme Section
// ─────────────────────────────────────────────────────────────────────────────

function ThemeSection() {
  const { settings, setColorMode, setColorTheme } = useTheme();
  const [themesExpanded, setThemesExpanded] = useState(false);

  const modeOptions: { value: ColorMode; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <section>
      <h2 className="font-display font-semibold text-sm text-[var(--text)] mb-3">Appearance</h2>
      
      {/* Light / Dark / System — simple segmented control */}
      <fieldset className="mb-4" aria-label="Color mode">
        <legend className="sr-only">Color mode</legend>
        <div className="inline-flex rounded-lg border border-[var(--border)] overflow-hidden">
          {modeOptions.map(({ value, label, icon: Icon }) => {
            const isSelected = settings.colorMode === value;
            return (
              <button
                key={value}
                onClick={() => setColorMode(value)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 text-sm font-soft font-medium cursor-pointer transition-colors
                  focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-inset focus-visible:outline-none
                  ${isSelected 
                    ? 'bg-[var(--primary)] text-white' 
                    : 'bg-[var(--card)] text-[var(--text-muted)] hover:bg-[var(--bg)]'
                  }
                `}
                aria-pressed={isSelected}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Color theme — collapsible */}
      <div className="border-t border-[var(--border)] pt-3">
        <button
          onClick={() => setThemesExpanded(!themesExpanded)}
          className="flex items-center gap-2 cursor-pointer text-sm font-soft text-[var(--text)] hover:text-[var(--primary)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none rounded"
          aria-expanded={themesExpanded}
        >
          <Palette className="w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
          <span className="font-medium">Color Theme</span>
          <span className="text-xs text-[var(--text-muted)]">
            — {THEME_DEFINITIONS.find(t => t.id === settings.colorTheme)?.name || 'Pom-Pom Classic'}
          </span>
          <ChevronRight 
            className={`w-4 h-4 text-[var(--text-muted)] transition-transform ml-auto ${themesExpanded ? 'rotate-90' : ''}`}
            aria-hidden="true"
          />
        </button>

        {themesExpanded && (
          <div
            className="mt-3 grid grid-cols-2 gap-2"
            role="radiogroup"
            aria-label="Color theme options"
          >
            {THEME_DEFINITIONS.map((theme) => {
              const isSelected = settings.colorTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setColorTheme(theme.id)}
                  className={`
                    flex items-center gap-2.5 p-2.5 rounded-lg text-left text-sm cursor-pointer transition-colors
                    focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
                    ${isSelected 
                      ? 'bg-[var(--primary)]/10 text-[var(--primary)] font-medium' 
                      : 'hover:bg-[var(--bg)] text-[var(--text)]'
                    }
                  `}
                  role="radio"
                  aria-checked={isSelected}
                >
                  {/* Preview dots */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.preview.primary }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.preview.secondary }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.preview.accent }} />
                  </div>
                  <span className="font-soft text-sm">{theme.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Seasonal Events Section
// ─────────────────────────────────────────────────────────────────────────────

/** Dev-only event override options for the switcher */
const EVENT_OVERRIDE_OPTIONS: { value: EventOverride; label: string; Icon: LucideIcon }[] = [
  { value: 'auto', label: 'Auto (Real Date)', Icon: CalendarDays },
  { value: 'none', label: 'No Event', Icon: Ban },
  ...SEASONAL_EVENTS.map(e => ({ value: e.id as EventOverride, label: e.name, Icon: e.icon })),
];

function SeasonalEventSection() {
  const {
    activeEvent, nextEvent, isEventThemeActive, settings,
    setEventThemingDisabled, eventOverride, setEventOverride,
  } = useTheme();
  const [eventsExpanded, setEventsExpanded] = useState(false);

  const formatDateRange = (startMonth: number, startDay: number, endMonth: number, endDay: number): string => {
    const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (startMonth === endMonth) return `${months[startMonth]} ${startDay}–${endDay}`;
    return `${months[startMonth]} ${startDay} – ${months[endMonth]} ${endDay}`;
  };

  return (
    <section>
      <h2 className="font-display font-semibold text-sm text-[var(--text)] mb-3">Seasonal Events</h2>

      {/* Dev override switcher */}
      {import.meta.env.DEV && (
        <div className="mb-3 p-2.5 rounded-lg border border-dashed border-amber-500/40 bg-amber-500/5">
          <p className="font-soft font-bold text-[10px] text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-2">
            Dev: Event Override
            {eventOverride !== 'auto' && (
              <span className="ml-2 font-medium normal-case tracking-normal text-amber-500">({eventOverride})</span>
            )}
          </p>
          <div className="flex flex-wrap gap-1">
            {EVENT_OVERRIDE_OPTIONS.map(({ value, label, Icon }) => {
              const isSelected = eventOverride === value;
              return (
                <button
                  key={value}
                  onClick={() => setEventOverride(value)}
                  className={`
                    flex items-center gap-1.5 px-2 py-1 rounded text-xs font-soft cursor-pointer transition-colors
                    focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none
                    ${isSelected
                      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-medium'
                      : 'text-[var(--text-muted)] hover:bg-[var(--bg)]'
                    }
                  `}
                >
                  <Icon className="w-3 h-3" aria-hidden="true" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active / next event note */}
      {activeEvent ? (
        <p className="text-sm text-[var(--text-muted)] mb-3">
          <activeEvent.icon className="w-3.5 h-3.5 inline -mt-0.5 mr-1 text-[var(--primary)]" aria-hidden="true" />
          <strong className="text-[var(--primary)]">{activeEvent.name}</strong> is active — {activeEvent.description}
        </p>
      ) : nextEvent ? (
        <p className="text-sm text-[var(--text-muted)] mb-3">
          Next up: <strong>{nextEvent.name}</strong> ({formatDateRange(nextEvent.dateRange.startMonth, nextEvent.dateRange.startDay, nextEvent.dateRange.endMonth, nextEvent.dateRange.endDay)})
        </p>
      ) : null}

      {/* Event toggle */}
      <SettingRow
        label="Event Themes"
        description={isEventThemeActive ? 'Seasonal theme is active' : 'Automatically apply event themes'}
      >
        <ToggleSwitch
          enabled={!settings.eventThemingDisabled}
          onChange={() => setEventThemingDisabled(!settings.eventThemingDisabled)}
        />
      </SettingRow>

      {/* Event calendar */}
      <div className="border-t border-[var(--border)] pt-3 mt-2">
        <button
          onClick={() => setEventsExpanded(!eventsExpanded)}
          className="flex items-center gap-2 cursor-pointer text-sm font-soft text-[var(--text)] hover:text-[var(--primary)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none rounded"
          aria-expanded={eventsExpanded}
        >
          <CalendarDays className="w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
          <span className="font-medium">Event Calendar</span>
          <ChevronRight 
            className={`w-4 h-4 text-[var(--text-muted)] transition-transform ml-auto ${eventsExpanded ? 'rotate-90' : ''}`}
            aria-hidden="true"
          />
        </button>

        {eventsExpanded && (
          <ul className="mt-2 space-y-0.5">
            {SEASONAL_EVENTS.map((event) => {
              const isActive = activeEvent?.id === event.id;
              const EventIcon = event.icon;
              return (
                <li
                  key={event.id}
                  className={`flex items-center gap-2.5 py-1.5 px-2 rounded text-sm ${isActive ? 'bg-[var(--primary)]/8 text-[var(--primary)]' : 'text-[var(--text)]'}`}
                >
                  <EventIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`} aria-hidden="true" />
                  <span className="font-soft">{event.name}</span>
                  <span className="text-xs text-[var(--text-muted)] ml-auto">
                    {formatDateRange(event.dateRange.startMonth, event.dateRange.startDay, event.dateRange.endMonth, event.dateRange.endDay)}
                  </span>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: event.preview.primary }} />
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: event.preview.secondary }} />
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: event.preview.accent }} />
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Accessibility Section
// ─────────────────────────────────────────────────────────────────────────────

interface AccessibilityOption {
  key: ToggleableSettingKey;
  label: string;
  description: string;
  requiresDark?: boolean;
}

const ACCESSIBILITY_OPTIONS: AccessibilityOption[] = [
  {
    key: 'highContrast',
    label: 'High Contrast',
    description: 'Increases color contrast for better visibility',
  },
  {
    key: 'extraDark',
    label: 'Extra Dark',
    description: 'Deeper blacks for OLED screens',
    requiresDark: true,
  },
  {
    key: 'largeText',
    label: 'Large Text',
    description: 'Increases font size across the site',
  },
  {
    key: 'reducedMotion',
    label: 'Reduce Motion',
    description: 'Minimizes animations and transitions',
  },
  {
    key: 'enhancedFocus',
    label: 'Enhanced Focus',
    description: 'More visible focus indicators',
  },
  {
    key: 'dyslexiaFont',
    label: 'Dyslexia-Friendly',
    description: 'Easier-to-read font spacing',
  },
];

function AccessibilitySection() {
  const { settings, toggleSetting, updateSetting } = useAccessibility();
  const { isDarkMode } = useTheme();
  const [colorblindExpanded, setColorblindExpanded] = useState(false);

  return (
    <section>
      <h2 className="font-display font-semibold text-sm text-[var(--text)] mb-3">Accessibility</h2>
      
      <div className="space-y-0.5">
        {ACCESSIBILITY_OPTIONS.map(({ key, label, description, requiresDark }) => {
          const isDisabled = requiresDark && !isDarkMode;
          return (
            <SettingRow 
              key={key} 
              label={label} 
              description={isDisabled ? `${description} (requires dark mode)` : description}
              disabled={isDisabled}
            >
              <ToggleSwitch 
                enabled={settings[key]} 
                onChange={() => toggleSetting(key)}
                disabled={isDisabled}
              />
            </SettingRow>
          );
        })}
      </div>

      {/* Colorblind mode */}
      <div className="border-t border-[var(--border)] pt-3 mt-2">
        <button
          onClick={() => setColorblindExpanded(!colorblindExpanded)}
          className="flex items-center gap-2 cursor-pointer text-sm font-soft text-[var(--text)] hover:text-[var(--primary)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none rounded"
          aria-expanded={colorblindExpanded}
        >
          <Palette className="w-3.5 h-3.5 text-[var(--text-muted)]" aria-hidden="true" />
          <span className="font-medium">Colorblind Mode</span>
          {settings.colorblindMode !== 'none' && (
            <span className="text-xs text-[var(--primary)]">
              ({COLORBLIND_MODES.find(m => m.value === settings.colorblindMode)?.label})
            </span>
          )}
          <ChevronRight 
            className={`w-4 h-4 text-[var(--text-muted)] transition-transform ml-auto ${colorblindExpanded ? 'rotate-90' : ''}`}
            aria-hidden="true"
          />
        </button>

        {colorblindExpanded && (
          <div
            className="mt-2 ml-5 space-y-0.5"
            role="radiogroup"
            aria-label="Colorblind mode options"
          >
            {COLORBLIND_MODES.map(({ value, label, description }) => {
              const isSelected = settings.colorblindMode === value;
              return (
                <button
                  key={value}
                  onClick={() => updateSetting('colorblindMode', value as ColorblindMode)}
                  className={`
                    w-full flex items-center gap-2.5 py-1.5 px-2 rounded text-left text-sm cursor-pointer transition-colors
                    focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
                    ${isSelected ? 'bg-[var(--primary)]/8 text-[var(--primary)]' : 'hover:bg-[var(--bg)] text-[var(--text)]'}
                  `}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <div className={`
                    w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                    ${isSelected ? 'border-[var(--primary)] bg-[var(--primary)]' : 'border-[var(--text-muted)]/40'}
                  `}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <span className={`font-soft text-sm ${isSelected ? 'font-medium' : ''}`}>{label}</span>
                    <span className="text-xs text-[var(--text-muted)] ml-1">— {description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Account Section
// ─────────────────────────────────────────────────────────────────────────────

function AccountSection() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <section>
        <h2 className="font-display font-semibold text-sm text-[var(--text)] mb-3">Account</h2>
        <p className="text-sm text-[var(--text-muted)]">Loading…</p>
      </section>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <section>
        <h2 className="font-display font-semibold text-sm text-[var(--text)] mb-3">Account</h2>
        <p className="text-sm text-[var(--text-muted)]">
          Sign in with Discord using the button in the navigation bar.
        </p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="font-display font-semibold text-sm text-[var(--text)] mb-3">Account</h2>
      
      <div className="flex items-center gap-3 mb-3">
        <img
          src={user.memberPortraitUrl}
          alt=""
          className="w-10 h-10 rounded-lg object-cover border border-[var(--border)]"
        />
        <div className="min-w-0 flex-1">
          <p className="font-soft font-medium text-sm text-[var(--text)] truncate">
            {user.memberName}
          </p>
          <p className="text-xs text-[var(--text-muted)]">{user.memberRank}</p>
        </div>
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors cursor-pointer font-soft focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none rounded"
      >
        <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
        Sign Out
      </button>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Settings Page
// ─────────────────────────────────────────────────────────────────────────────

export function Settings() {
  return (
    <div className="min-h-[100dvh] pt-[calc(4rem+env(safe-area-inset-top)+1.5rem)] sm:pt-[calc(4rem+env(safe-area-inset-top)+2rem)] md:pt-8 pb-[calc(5rem+env(safe-area-inset-bottom)+1.5rem)] sm:pb-[calc(5rem+env(safe-area-inset-bottom)+2rem)] md:pb-8 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <h1 className="font-display font-bold text-lg text-[var(--text)] mb-6">Settings</h1>

        <div className="space-y-6">
          <ThemeSection />
          <hr className="border-[var(--border)]" />
          <SeasonalEventSection />
          <hr className="border-[var(--border)]" />
          <AccessibilitySection />
          <hr className="border-[var(--border)]" />
          <AccountSection />
        </div>

        <p className="text-xs text-[var(--text-subtle)] mt-8">
          Settings are saved automatically to your browser.
        </p>
      </div>
    </div>
  );
}
