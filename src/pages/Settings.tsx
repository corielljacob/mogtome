import { useState } from 'react';
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
  Sparkles,
  Paintbrush,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAccessibility, COLORBLIND_MODES, type ColorblindMode, type ToggleableSettingKey } from '../contexts/AccessibilityContext';
import { useTheme, THEME_DEFINITIONS, type ColorMode } from '../contexts/ThemeContext';
import { ContentCard } from '../components';


// ─────────────────────────────────────────────────────────────────────────────
// Section Components
// ─────────────────────────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, description }: { 
  icon: typeof SettingsIcon; 
  title: string; 
  description?: string;
}) {
  return (
    <div className="flex items-start gap-2.5 sm:gap-3 mb-3 sm:mb-4">
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[var(--bento-primary)]/15 to-[var(--bento-secondary)]/15 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--bento-primary)]" aria-hidden="true" />
      </div>
      <div>
        <h2 className="font-display font-semibold text-base sm:text-lg text-[var(--bento-text)]">{title}</h2>
        {description && (
          <p className="text-xs sm:text-sm text-[var(--bento-text-muted)] mt-0.5">{description}</p>
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
        relative w-[52px] h-[32px] sm:w-[52px] sm:h-[31px] rounded-full transition-colors duration-200 cursor-pointer flex-shrink-0
        focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:ring-offset-2 focus-visible:outline-none
        touch-manipulation active:scale-95
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${enabled ? 'bg-[var(--bento-primary)]' : 'bg-[var(--bento-text-subtle)]/40'}
      `}
    >
      {/* Using CSS transform instead of motion to avoid reduced-motion conflicts */}
      <div 
        className={`
          absolute top-[2px] left-[2px] w-[28px] h-[28px] sm:w-[27px] sm:h-[27px] rounded-full bg-white shadow-md
          transition-transform duration-200 ease-out
          ${enabled ? 'translate-x-[20px] sm:translate-x-[21px]' : 'translate-x-0'}
        `}
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
    <div className={`flex items-center justify-between gap-3 sm:gap-4 py-2.5 sm:py-3 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[var(--bento-bg)] flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[var(--bento-text-muted)]" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="font-soft font-semibold text-xs sm:text-sm text-[var(--bento-text)]">{label}</p>
          <p className="text-[10px] sm:text-xs text-[var(--bento-text-muted)] mt-0.5 leading-relaxed">{description}</p>
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
  const { settings, setColorMode, setColorTheme } = useTheme();
  const [themesExpanded, setThemesExpanded] = useState(false);

  const modeOptions: { value: ColorMode; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const currentTheme = THEME_DEFINITIONS.find(t => t.id === settings.colorTheme);

  return (
    <ContentCard>
      <SectionHeader 
        icon={Palette} 
        title="Appearance" 
        description="Choose how MogTome looks to you"
      />
      
      {/* Light/Dark/System Mode */}
      <div className="grid grid-cols-3 gap-3 sm:gap-2 mb-4">
        {modeOptions.map(({ value, label, icon: Icon }) => {
          const isSelected = settings.colorMode === value;
          return (
            <button
              key={value}
              onClick={() => setColorMode(value)}
              className={`
                relative flex flex-col items-center gap-2.5 sm:gap-2 p-4 sm:p-4 rounded-2xl sm:rounded-xl border-2 transition-all cursor-pointer
                focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:ring-offset-2 focus-visible:outline-none
                touch-manipulation active:scale-[0.97]
                ${isSelected 
                  ? 'border-[var(--bento-primary)] bg-[var(--bento-primary)]/10' 
                  : 'border-[var(--bento-border)] active:border-[var(--bento-primary)]/30 active:bg-[var(--bento-bg)] sm:hover:border-[var(--bento-primary)]/30 sm:hover:bg-[var(--bento-bg)]'
                }
              `}
              aria-pressed={isSelected}
            >
              <div className={`
                w-14 h-14 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center
                ${isSelected 
                  ? 'bg-[var(--bento-primary)] text-white' 
                  : 'bg-[var(--bento-bg)] text-[var(--bento-text-muted)]'
                }
              `}>
                <Icon className="w-7 h-7 sm:w-6 sm:h-6" />
              </div>
              <span className={`font-soft font-semibold text-sm ${isSelected ? 'text-[var(--bento-primary)]' : 'text-[var(--bento-text)]'}`}>
                {label}
              </span>
              {isSelected && (
                <motion.div
                  className="absolute top-2.5 right-2.5 sm:top-2 sm:right-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  <Check className="w-5 h-5 sm:w-4 sm:h-4 text-[var(--bento-primary)]" />
                </motion.div>
              )}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--bento-border)] to-transparent my-4" />

      {/* Color Theme Selector */}
      <div>
        <button
          onClick={() => setThemesExpanded(!themesExpanded)}
          className="w-full flex items-center justify-between gap-4 cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none rounded-lg p-2 -m-2"
          aria-expanded={themesExpanded}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[var(--bento-primary)]/15 to-[var(--bento-secondary)]/15 flex items-center justify-center flex-shrink-0">
              <Paintbrush className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--bento-primary)]" aria-hidden="true" />
            </div>
            <div className="text-left">
              <p className="font-soft font-semibold text-sm text-[var(--bento-text)]">
                Color Theme
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {/* Theme color preview dots */}
                {currentTheme && (
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-3 h-3 rounded-full border border-white/50 shadow-sm" 
                      style={{ backgroundColor: currentTheme.preview.primary }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full border border-white/50 shadow-sm" 
                      style={{ backgroundColor: currentTheme.preview.secondary }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full border border-white/50 shadow-sm" 
                      style={{ backgroundColor: currentTheme.preview.accent }}
                    />
                  </div>
                )}
                <span className="text-xs text-[var(--bento-primary)] font-medium">
                  {currentTheme?.name || 'Pom-Pom Classic'}
                </span>
              </div>
            </div>
          </div>
          <ChevronRight 
            className={`w-5 h-5 text-[var(--bento-text-muted)] transition-transform ${themesExpanded ? 'rotate-90' : ''}`}
            aria-hidden="true"
          />
        </button>

        {themesExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-4 grid grid-cols-2 gap-3"
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
                    relative flex flex-col gap-2.5 p-4 sm:p-3 rounded-2xl sm:rounded-xl text-left cursor-pointer
                    transition-all border-2 touch-manipulation
                    active:scale-[0.97]
                    focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
                    ${isSelected 
                      ? 'border-[var(--bento-primary)] bg-[var(--bento-primary)]/10' 
                      : 'border-[var(--bento-border)] active:border-[var(--bento-primary)]/30 active:bg-[var(--bento-bg)] sm:hover:border-[var(--bento-primary)]/30 sm:hover:bg-[var(--bento-bg)]'
                    }
                  `}
                  role="radio"
                  aria-checked={isSelected}
                >
                  {/* Color preview - larger dots on mobile */}
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 sm:w-5 sm:h-5 rounded-full border-2 border-white shadow-sm" 
                      style={{ backgroundColor: theme.preview.primary }}
                    />
                    <div 
                      className="w-5 h-5 sm:w-4 sm:h-4 rounded-full border-2 border-white shadow-sm" 
                      style={{ backgroundColor: theme.preview.secondary }}
                    />
                    <div 
                      className="w-4 h-4 sm:w-3 sm:h-3 rounded-full border-2 border-white shadow-sm" 
                      style={{ backgroundColor: theme.preview.accent }}
                    />
                  </div>
                  
                  {/* Theme info */}
                  <div>
                    <p className={`font-soft font-semibold text-sm sm:text-sm ${isSelected ? 'text-[var(--bento-primary)]' : 'text-[var(--bento-text)]'}`}>
                      {theme.name}
                    </p>
                    <p className="text-xs sm:text-xs text-[var(--bento-text-muted)] leading-snug mt-0.5">
                      {theme.description}
                    </p>
                  </div>

                  {/* Selected indicator */}
                  {isSelected && (
                    <motion.div
                      className="absolute top-3 right-3 sm:top-2 sm:right-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    >
                      <Check className="w-5 h-5 sm:w-4 sm:h-4 text-[var(--bento-primary)]" />
                    </motion.div>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
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
  const { isDarkMode } = useTheme();
  const [colorblindExpanded, setColorblindExpanded] = useState(false);

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
        <div className="flex items-center justify-center py-6 sm:py-8">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[var(--bento-primary)]/20 border-t-[var(--bento-primary)] animate-spin" />
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
        <div className="flex items-center justify-center py-4 sm:py-6">
          <p className="text-xs sm:text-sm text-[var(--bento-text-muted)] text-center px-2">
            Use the login button in the navigation bar to sign in with Discord.
          </p>
        </div>
      </ContentCard>
    );
  }

  return (
    <ContentCard>
      <SectionHeader icon={User} title="Account" />
      
      {/* User info */}
      <div className="flex items-center gap-3 sm:gap-4 py-2">
        <img
          src={user.memberPortraitUrl}
          alt=""
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover ring-2 ring-[var(--bento-primary)]/20"
        />
        <div className="min-w-0 flex-1">
          <p className="font-display font-semibold text-sm sm:text-base text-[var(--bento-text)] truncate">
            {user.memberName}
          </p>
          <p className="text-xs sm:text-sm text-[var(--bento-text-muted)]">{user.memberRank}</p>
        </div>
        {/* Connected status */}
        <div className="flex items-center gap-1.5 text-xs text-[var(--bento-text-muted)]">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="hidden sm:inline">Connected via Discord</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--bento-border)]">
        <button
          onClick={logout}
          className="flex items-center justify-center gap-3 sm:gap-3 px-4 sm:px-4 py-3.5 sm:py-3 rounded-xl text-red-500 sm:hover:bg-red-500/10 active:bg-red-500/15 active:scale-[0.98] transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none w-full touch-manipulation"
        >
          <LogOut className="w-5 h-5 sm:w-5 sm:h-5" aria-hidden="true" />
          <span className="font-soft font-semibold text-base sm:text-base">Sign Out</span>
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
    <div className="min-h-[100dvh] pt-[calc(4rem+env(safe-area-inset-top)+1.5rem)] sm:pt-[calc(4rem+env(safe-area-inset-top)+2rem)] md:pt-8 pb-[calc(5rem+env(safe-area-inset-bottom)+1.5rem)] sm:pb-[calc(5rem+env(safe-area-inset-bottom)+2rem)] md:pb-8 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[var(--bento-primary)] to-[var(--bento-secondary)] flex items-center justify-center shadow-lg shadow-[var(--bento-primary)]/25">
              <SettingsIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl sm:text-2xl md:text-3xl text-[var(--bento-text)]">
                Settings
              </h1>
              <p className="text-xs sm:text-sm text-[var(--bento-text-muted)]">
                Customize your MogTome experience
              </p>
            </div>
          </div>
          
          {/* Decorative divider */}
          <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--bento-primary)]/20 to-transparent" />
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--bento-secondary)]" aria-hidden="true" />
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--bento-primary)]/20 to-transparent" />
          </div>
        </motion.div>

        {/* Settings Sections */}
        <motion.div
          className="space-y-4 sm:space-y-6"
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
          className="text-center text-[10px] sm:text-xs text-[var(--bento-text-subtle)] mt-6 sm:mt-8"
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
