import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Accessibility, 
  X, 
  Contrast, 
  Moon, 
  Type, 
  Zap, 
  Focus, 
  BookOpen,
  RotateCcw,
  Check,
  Eye,
  ChevronDown
} from 'lucide-react';
import { useAccessibility, COLORBLIND_MODES, type ToggleableSettingKey, type ColorblindMode } from '../contexts/AccessibilityContext';

interface SettingOption {
  key: ToggleableSettingKey;
  label: string;
  description: string;
  icon: typeof Contrast;
}

const SETTING_OPTIONS: SettingOption[] = [
  {
    key: 'highContrast',
    label: 'High Contrast',
    description: 'Increases color contrast for better visibility',
    icon: Contrast,
  },
  {
    key: 'extraDark',
    label: 'Extra Dark',
    description: 'Deeper blacks for OLED screens (dark mode only)',
    icon: Moon,
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
    description: 'More visible focus indicators for keyboard navigation',
    icon: Focus,
  },
  {
    key: 'dyslexiaFont',
    label: 'Dyslexia-Friendly',
    description: 'Uses easier-to-read font spacing',
    icon: BookOpen,
  },
];

/**
 * AccessibilityMenu - A dropdown menu for accessibility settings.
 * Provides toggles for high contrast, extra dark mode, large text, and more.
 */
export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [colorblindExpanded, setColorblindExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { settings, toggleSetting, updateSetting, resetSettings } = useAccessibility();

  // Count active settings (boolean toggles + colorblind mode if not 'none')
  const activeCount = Object.entries(settings).filter(([key, value]) => {
    if (key === 'colorblindMode') return value !== 'none';
    return value === true;
  }).length;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative">
      {/* Trigger button */}
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          relative w-10 h-10 md:w-9 md:h-9 rounded-xl 
          bg-[var(--bento-card)]/80 border cursor-pointer shadow-sm
          transition-colors duration-200
          focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
          ${activeCount > 0 
            ? 'border-[var(--bento-primary)]/30 text-[var(--bento-primary)]' 
            : 'border-[var(--bento-primary)]/15 text-[var(--bento-text-muted)] hover:text-[var(--bento-text)]'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={`Accessibility settings${activeCount > 0 ? `, ${activeCount} options enabled` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Accessibility className="w-5 h-5 mx-auto" />
        
        {/* Badge showing active count */}
        {activeCount > 0 && (
          <span 
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--bento-primary)] text-white text-[10px] font-bold flex items-center justify-center"
            aria-hidden="true"
          >
            {activeCount}
          </span>
        )}
      </motion.button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-full mt-2 z-50 w-80 sm:w-96"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            role="dialog"
            aria-label="Accessibility settings"
            aria-modal="true"
          >
            <div className="bg-[var(--bento-card)] rounded-2xl border border-[var(--bento-primary)]/15 shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--bento-border)]">
                <div className="flex items-center gap-2">
                  <Accessibility className="w-5 h-5 text-[var(--bento-primary)]" aria-hidden="true" />
                  <h2 className="font-display font-semibold text-[var(--bento-text)]">
                    Accessibility
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-[var(--bento-text-muted)] hover:text-[var(--bento-text)] hover:bg-[var(--bento-bg)] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none"
                  aria-label="Close accessibility menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Settings list */}
              <div className="p-2 max-h-[60vh] overflow-y-auto">
                <ul className="space-y-1" role="list">
                  {SETTING_OPTIONS.map(({ key, label, description, icon: Icon }) => {
                    const isEnabled = settings[key];
                    const isDisabled = key === 'extraDark' && !document.documentElement.classList.contains('dark');
                    
                    return (
                      <li key={key}>
                        <button
                          onClick={() => !isDisabled && toggleSetting(key)}
                          disabled={isDisabled}
                          className={`
                            w-full flex items-start gap-3 p-3 rounded-xl text-left
                            transition-all duration-150 cursor-pointer
                            focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
                            ${isDisabled 
                              ? 'opacity-50 cursor-not-allowed' 
                              : isEnabled
                                ? 'bg-[var(--bento-primary)]/10 border border-[var(--bento-primary)]/20'
                                : 'hover:bg-[var(--bento-bg)] border border-transparent'
                            }
                          `}
                          role="switch"
                          aria-checked={isEnabled}
                          aria-describedby={`${key}-description`}
                        >
                          {/* Icon */}
                          <div className={`
                            flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                            ${isEnabled 
                              ? 'bg-[var(--bento-primary)] text-white' 
                              : 'bg-[var(--bento-bg)] text-[var(--bento-text-muted)]'
                            }
                          `}>
                            <Icon className="w-5 h-5" aria-hidden="true" />
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`font-soft font-semibold text-sm ${isEnabled ? 'text-[var(--bento-primary)]' : 'text-[var(--bento-text)]'}`}>
                                {label}
                              </span>
                              {isEnabled && (
                                <Check className="w-4 h-4 text-[var(--bento-primary)]" aria-hidden="true" />
                              )}
                            </div>
                            <p id={`${key}-description`} className="text-xs text-[var(--bento-text-muted)] mt-0.5">
                              {description}
                              {isDisabled && ' (enable dark mode first)'}
                            </p>
                          </div>

                          {/* Toggle indicator */}
                          <div 
                            className={`
                              flex-shrink-0 w-11 h-6 rounded-full p-0.5 transition-colors duration-200
                              ${isEnabled ? 'bg-[var(--bento-primary)]' : 'bg-[var(--bento-border)]'}
                            `}
                            aria-hidden="true"
                          >
                            <div 
                              className={`
                                w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200
                                ${isEnabled ? 'translate-x-5' : 'translate-x-0'}
                              `}
                            />
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* Colorblind Mode Section */}
                <div className="mt-3 pt-3 border-t border-[var(--bento-border)]">
                  <button
                    onClick={() => setColorblindExpanded(!colorblindExpanded)}
                    className={`
                      w-full flex items-start gap-3 p-3 rounded-xl text-left
                      transition-all duration-150 cursor-pointer
                      focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
                      ${settings.colorblindMode !== 'none'
                        ? 'bg-[var(--bento-primary)]/10 border border-[var(--bento-primary)]/20'
                        : 'hover:bg-[var(--bento-bg)] border border-transparent'
                      }
                    `}
                    aria-expanded={colorblindExpanded}
                  >
                    {/* Icon */}
                    <div className={`
                      flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                      ${settings.colorblindMode !== 'none'
                        ? 'bg-[var(--bento-primary)] text-white' 
                        : 'bg-[var(--bento-bg)] text-[var(--bento-text-muted)]'
                      }
                    `}>
                      <Eye className="w-5 h-5" aria-hidden="true" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-soft font-semibold text-sm ${settings.colorblindMode !== 'none' ? 'text-[var(--bento-primary)]' : 'text-[var(--bento-text)]'}`}>
                          Colorblind Mode
                        </span>
                        {settings.colorblindMode !== 'none' && (
                          <Check className="w-4 h-4 text-[var(--bento-primary)]" aria-hidden="true" />
                        )}
                      </div>
                      <p className="text-xs text-[var(--bento-text-muted)] mt-0.5">
                        {settings.colorblindMode !== 'none' 
                          ? COLORBLIND_MODES.find(m => m.value === settings.colorblindMode)?.label
                          : 'Adjust colors for color vision deficiency'
                        }
                      </p>
                    </div>

                    {/* Chevron */}
                    <ChevronDown 
                      className={`w-5 h-5 text-[var(--bento-text-muted)] transition-transform duration-200 ${colorblindExpanded ? 'rotate-180' : ''}`} 
                      aria-hidden="true" 
                    />
                  </button>

                  {/* Colorblind options */}
                  <AnimatePresence>
                    {colorblindExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 pt-2 space-y-1" role="radiogroup" aria-label="Colorblind mode options">
                          {COLORBLIND_MODES.map(({ value, label, description }) => {
                            const isSelected = settings.colorblindMode === value;
                            
                            return (
                              <button
                                key={value}
                                onClick={() => updateSetting('colorblindMode', value as ColorblindMode)}
                                className={`
                                  w-full flex items-center gap-3 p-2.5 rounded-lg text-left
                                  transition-all duration-150 cursor-pointer
                                  focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
                                  ${isSelected
                                    ? 'bg-[var(--bento-primary)]/15 text-[var(--bento-primary)]'
                                    : 'hover:bg-[var(--bento-bg)] text-[var(--bento-text)]'
                                  }
                                `}
                                role="radio"
                                aria-checked={isSelected}
                              >
                                {/* Radio indicator */}
                                <div className={`
                                  flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                                  ${isSelected 
                                    ? 'border-[var(--bento-primary)] bg-[var(--bento-primary)]' 
                                    : 'border-[var(--bento-text-muted)]'
                                  }
                                `}>
                                  {isSelected && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                  )}
                                </div>

                                {/* Text */}
                                <div className="flex-1 min-w-0">
                                  <span className={`font-soft font-medium text-sm ${isSelected ? 'text-[var(--bento-primary)]' : ''}`}>
                                    {label}
                                  </span>
                                  <p className="text-xs text-[var(--bento-text-muted)]">
                                    {description}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Footer with reset button */}
              {activeCount > 0 && (
                <div className="px-4 py-3 border-t border-[var(--bento-border)]">
                  <button
                    onClick={resetSettings}
                    className="flex items-center gap-2 text-sm font-soft font-medium text-[var(--bento-text-muted)] hover:text-[var(--bento-primary)] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none rounded"
                  >
                    <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    Reset all settings
                  </button>
                </div>
              )}

              {/* Info footer */}
              <div className="px-4 py-2 bg-[var(--bento-bg)]/50 border-t border-[var(--bento-border)]">
                <p className="text-xs text-[var(--bento-text-subtle)] text-center">
                  Settings are saved automatically
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
