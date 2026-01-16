import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Settings as SettingsIcon,
  Sun, 
  Moon, 
  Monitor,
  Palette,
  Eye,
  Type,
  Zap,
  Focus,
  BookOpen,
  Contrast,
  LogOut,
  User,
  ChevronRight,
  Check,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAccessibility, COLORBLIND_MODES, type ColorblindMode, type ToggleableSettingKey } from '../contexts/AccessibilityContext';
import { ContentCard } from '../components';

// ─────────────────────────────────────────────────────────────────────────────
// Theme Management
// ─────────────────────────────────────────────────────────────────────────────

type ThemeOption = 'light' | 'dark' | 'system';

function useTheme() {
  const getInitialTheme = (): ThemeOption => {
    if (typeof window === 'undefined') return 'system';
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return 'system';
  };

  const [theme, setTheme] = useState<ThemeOption>(getInitialTheme);

  useEffect(() => {
    const applyTheme = () => {
      let isDark: boolean;
      if (theme === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        localStorage.removeItem('theme');
      } else {
        isDark = theme === 'dark';
        localStorage.setItem('theme', theme);
      }
      document.documentElement.classList.toggle('dark', isDark);
    };

    applyTheme();

    // Listen for system theme changes when in system mode
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme();
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [theme]);

  return { theme, setTheme };
}

// ─────────────────────────────────────────────────────────────────────────────
// Section Components
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, description }: { 
  icon: typeof SettingsIcon; 
  title: string; 
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--bento-primary)]/15 to-[var(--bento-secondary)]/15 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-[var(--bento-primary)]" aria-hidden="true" />
      </div>
      <div>
        <h2 className="font-display font-semibold text-lg text-[var(--bento-text)]">{title}</h2>
        {description && (
          <p className="text-sm text-[var(--bento-text-muted)] mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}

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
        relative w-12 h-7 rounded-full p-0.5 transition-colors duration-200 cursor-pointer
        focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:ring-offset-2 focus-visible:outline-none
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${enabled ? 'bg-[var(--bento-primary)]' : 'bg-[var(--bento-border)]'}
      `}
    >
      <motion.div 
        className="w-6 h-6 rounded-full bg-white shadow-sm"
        animate={{ x: enabled ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

function SettingRow({ 
  icon: Icon, 
  label, 
  description, 
  children,
  disabled = false
}: { 
  icon: typeof Eye; 
  label: string; 
  description: string; 
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 py-3 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-[var(--bento-bg)] flex items-center justify-center flex-shrink-0">
          <Icon className="w-4.5 h-4.5 text-[var(--bento-text-muted)]" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="font-soft font-semibold text-sm text-[var(--bento-text)]">{label}</p>
          <p className="text-xs text-[var(--bento-text-muted)] mt-0.5">{description}</p>
        </div>
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
  const { theme, setTheme } = useTheme();

  const themeOptions: { value: ThemeOption; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  return (
    <ContentCard>
      <SectionHeader 
        icon={Palette} 
        title="Appearance" 
        description="Choose how MogTome looks to you"
      />
      
      <div className="grid grid-cols-3 gap-2">
        {themeOptions.map(({ value, label, icon: Icon }) => {
          const isSelected = theme === value;
          return (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`
                relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer
                focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:ring-offset-2 focus-visible:outline-none
                ${isSelected 
                  ? 'border-[var(--bento-primary)] bg-[var(--bento-primary)]/10' 
                  : 'border-[var(--bento-border)] hover:border-[var(--bento-primary)]/30 hover:bg-[var(--bento-bg)]'
                }
              `}
              aria-pressed={isSelected}
            >
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center
                ${isSelected 
                  ? 'bg-[var(--bento-primary)] text-white' 
                  : 'bg-[var(--bento-bg)] text-[var(--bento-text-muted)]'
                }
              `}>
                <Icon className="w-6 h-6" />
              </div>
              <span className={`font-soft font-semibold text-sm ${isSelected ? 'text-[var(--bento-primary)]' : 'text-[var(--bento-text)]'}`}>
                {label}
              </span>
              {isSelected && (
                <motion.div
                  className="absolute top-2 right-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <Check className="w-4 h-4 text-[var(--bento-primary)]" />
                </motion.div>
              )}
            </button>
          );
        })}
      </div>
    </ContentCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Accessibility Section
// ─────────────────────────────────────────────────────────────────────────────

interface AccessibilityOption {
  key: ToggleableSettingKey;
  label: string;
  description: string;
  icon: typeof Eye;
  requiresDark?: boolean;
}

const ACCESSIBILITY_OPTIONS: AccessibilityOption[] = [
  {
    key: 'highContrast',
    label: 'High Contrast',
    description: 'Increases color contrast for better visibility',
    icon: Contrast,
  },
  {
    key: 'extraDark',
    label: 'Extra Dark',
    description: 'Deeper blacks for OLED screens',
    icon: Moon,
    requiresDark: true,
  },
  {
    key: 'largeText',
    label: 'Large Text',
    description: 'Increases font size across the site',
    icon: Type,
  },
  {
    key: 'reducedMotion',
    label: 'Reduce Motion',
    description: 'Minimizes animations and transitions',
    icon: Zap,
  },
  {
    key: 'enhancedFocus',
    label: 'Enhanced Focus',
    description: 'More visible focus indicators',
    icon: Focus,
  },
  {
    key: 'dyslexiaFont',
    label: 'Dyslexia-Friendly',
    description: 'Easier-to-read font spacing',
    icon: BookOpen,
  },
];

function AccessibilitySection() {
  const { settings, toggleSetting, updateSetting } = useAccessibility();
  const [colorblindExpanded, setColorblindExpanded] = useState(false);
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <ContentCard>
      <SectionHeader 
        icon={Eye} 
        title="Accessibility" 
        description="Customize your experience for better usability"
      />
      
      <div className="divide-y divide-[var(--bento-border)]">
        {ACCESSIBILITY_OPTIONS.map(({ key, label, description, icon, requiresDark }) => {
          const isDisabled = requiresDark && !isDarkMode;
          return (
            <SettingRow 
              key={key} 
              icon={icon} 
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

        {/* Colorblind Mode */}
        <div className="py-3">
          <button
            onClick={() => setColorblindExpanded(!colorblindExpanded)}
            className="w-full flex items-center justify-between gap-4 cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none rounded-lg"
            aria-expanded={colorblindExpanded}
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--bento-bg)] flex items-center justify-center flex-shrink-0">
                <Palette className="w-4.5 h-4.5 text-[var(--bento-text-muted)]" aria-hidden="true" />
              </div>
              <div className="text-left">
                <p className="font-soft font-semibold text-sm text-[var(--bento-text)]">
                  Colorblind Mode
                  {settings.colorblindMode !== 'none' && (
                    <span className="ml-2 text-xs text-[var(--bento-primary)]">
                      ({COLORBLIND_MODES.find(m => m.value === settings.colorblindMode)?.label})
                    </span>
                  )}
                </p>
                <p className="text-xs text-[var(--bento-text-muted)] mt-0.5">
                  Adjust colors for color vision deficiency
                </p>
              </div>
            </div>
            <ChevronRight 
              className={`w-5 h-5 text-[var(--bento-text-muted)] transition-transform ${colorblindExpanded ? 'rotate-90' : ''}`}
              aria-hidden="true"
            />
          </button>

          {colorblindExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-3 ml-12 space-y-1"
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
                      w-full flex items-center gap-3 p-3 rounded-lg text-left cursor-pointer
                      transition-colors focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
                      ${isSelected ? 'bg-[var(--bento-primary)]/10' : 'hover:bg-[var(--bento-bg)]'}
                    `}
                    role="radio"
                    aria-checked={isSelected}
                  >
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                      ${isSelected ? 'border-[var(--bento-primary)] bg-[var(--bento-primary)]' : 'border-[var(--bento-text-muted)]'}
                    `}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className={`font-soft font-medium text-sm ${isSelected ? 'text-[var(--bento-primary)]' : 'text-[var(--bento-text)]'}`}>
                        {label}
                      </p>
                      <p className="text-xs text-[var(--bento-text-muted)]">{description}</p>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </ContentCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Account Section
// ─────────────────────────────────────────────────────────────────────────────

function AccountSection() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <ContentCard>
        <SectionHeader icon={User} title="Account" />
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 rounded-full border-2 border-[var(--bento-primary)]/20 border-t-[var(--bento-primary)] animate-spin" />
        </div>
      </ContentCard>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <ContentCard>
        <SectionHeader 
          icon={User} 
          title="Account" 
          description="Sign in to access member features"
        />
        <div className="flex items-center justify-center py-6">
          <p className="text-sm text-[var(--bento-text-muted)]">
            Use the login button in the navigation bar to sign in with Discord.
          </p>
        </div>
      </ContentCard>
    );
  }

  const avatarUrl = user.avatar 
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(user.discriminator || '0') % 5}.png`;

  const displayName = user.globalName || user.username;

  return (
    <ContentCard>
      <SectionHeader icon={User} title="Account" />
      
      <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--bento-bg)]">
        <img 
          src={avatarUrl} 
          alt="" 
          className="w-16 h-16 rounded-xl object-cover shadow-md"
        />
        <div className="min-w-0 flex-1">
          <p className="font-display font-semibold text-lg text-[var(--bento-text)] truncate">
            {displayName}
          </p>
          <p className="text-sm text-[var(--bento-text-muted)] truncate">
            @{user.username}
          </p>
          <p className="text-xs text-[var(--bento-text-subtle)] mt-1">
            Connected via Discord
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--bento-border)]">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none w-full"
        >
          <LogOut className="w-5 h-5" aria-hidden="true" />
          <span className="font-soft font-semibold">Sign Out</span>
        </button>
      </div>
    </ContentCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Settings Page
// ─────────────────────────────────────────────────────────────────────────────

export function Settings() {
  return (
    <div className="min-h-[calc(100vh-4.5rem)] py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--bento-primary)] to-[var(--bento-secondary)] flex items-center justify-center shadow-lg shadow-[var(--bento-primary)]/25">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl md:text-3xl text-[var(--bento-text)]">
                Settings
              </h1>
              <p className="text-sm text-[var(--bento-text-muted)]">
                Customize your MogTome experience
              </p>
            </div>
          </div>
          
          {/* Decorative divider */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--bento-primary)]/20 to-transparent" />
            <Sparkles className="w-4 h-4 text-[var(--bento-secondary)]" aria-hidden="true" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--bento-primary)]/20 to-transparent" />
          </div>
        </motion.div>

        {/* Settings Sections */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <ThemeSection />
          <AccessibilitySection />
          <AccountSection />
        </motion.div>

        {/* Footer note */}
        <motion.p
          className="text-center text-xs text-[var(--bento-text-subtle)] mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Settings are saved automatically to your browser
        </motion.p>
      </div>
    </div>
  );
}
