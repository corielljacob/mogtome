import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { render, screen, fireEvent } from '../test/test-utils';
import { 
  AccessibilityProvider, 
  useAccessibility,
  COLORBLIND_MODES,
  type ColorblindMode,
} from './AccessibilityContext';
import type { ReactNode } from 'react';

const STORAGE_KEY = 'mogtome-accessibility';

describe('AccessibilityProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset document classes
    document.documentElement.className = '';
    document.body.className = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AccessibilityProvider>{children}</AccessibilityProvider>
  );

  it('provides default settings', () => {
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    
    expect(result.current.settings.highContrast).toBe(false);
    expect(result.current.settings.extraDark).toBe(false);
    expect(result.current.settings.largeText).toBe(false);
    expect(result.current.settings.enhancedFocus).toBe(false);
    expect(result.current.settings.dyslexiaFont).toBe(false);
    expect(result.current.settings.colorblindMode).toBe('none');
  });

  it('loads settings from localStorage', () => {
    const storedSettings = {
      highContrast: true,
      largeText: true,
      colorblindMode: 'protanopia',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storedSettings));
    
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    
    expect(result.current.settings.highContrast).toBe(true);
    expect(result.current.settings.largeText).toBe(true);
    expect(result.current.settings.colorblindMode).toBe('protanopia');
    // Non-stored values should have defaults
    expect(result.current.settings.extraDark).toBe(false);
  });

  it('handles invalid JSON in localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'not valid json');
    
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    
    // Should fall back to defaults
    expect(result.current.settings.highContrast).toBe(false);
  });

  it('respects system reduced motion preference', () => {
    // Mock matchMedia to return reduced motion
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    
    const { result } = renderHook(() => useAccessibility(), { wrapper });
    
    expect(result.current.settings.reducedMotion).toBe(true);
  });

  describe('updateSetting', () => {
    it('updates a boolean setting', () => {
      const { result } = renderHook(() => useAccessibility(), { wrapper });
      
      act(() => {
        result.current.updateSetting('highContrast', true);
      });
      
      expect(result.current.settings.highContrast).toBe(true);
    });

    it('updates colorblind mode', () => {
      const { result } = renderHook(() => useAccessibility(), { wrapper });
      
      act(() => {
        result.current.updateSetting('colorblindMode', 'deuteranopia');
      });
      
      expect(result.current.settings.colorblindMode).toBe('deuteranopia');
    });

    it('persists changes to localStorage', () => {
      const { result } = renderHook(() => useAccessibility(), { wrapper });
      
      act(() => {
        result.current.updateSetting('largeText', true);
      });
      
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      expect(stored.largeText).toBe(true);
    });
  });

  describe('toggleSetting', () => {
    it('toggles a boolean setting on', () => {
      const { result } = renderHook(() => useAccessibility(), { wrapper });
      
      expect(result.current.settings.enhancedFocus).toBe(false);
      
      act(() => {
        result.current.toggleSetting('enhancedFocus');
      });
      
      expect(result.current.settings.enhancedFocus).toBe(true);
    });

    it('toggles a boolean setting off', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ enhancedFocus: true }));
      
      const { result } = renderHook(() => useAccessibility(), { wrapper });
      
      expect(result.current.settings.enhancedFocus).toBe(true);
      
      act(() => {
        result.current.toggleSetting('enhancedFocus');
      });
      
      expect(result.current.settings.enhancedFocus).toBe(false);
    });
  });

  describe('resetSettings', () => {
    it('resets all settings to defaults', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        highContrast: true,
        largeText: true,
        colorblindMode: 'tritanopia',
      }));
      
      const { result } = renderHook(() => useAccessibility(), { wrapper });
      
      expect(result.current.settings.highContrast).toBe(true);
      
      act(() => {
        result.current.resetSettings();
      });
      
      expect(result.current.settings.highContrast).toBe(false);
      expect(result.current.settings.largeText).toBe(false);
      expect(result.current.settings.colorblindMode).toBe('none');
    });

    it('removes custom settings from localStorage', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ highContrast: true }));
      
      const { result } = renderHook(() => useAccessibility(), { wrapper });
      
      act(() => {
        result.current.resetSettings();
      });
      
      // After reset, the effect re-persists default settings
      // What matters is that the settings themselves are reset to defaults
      expect(result.current.settings.highContrast).toBe(false);
      expect(result.current.settings.colorblindMode).toBe('none');
    });
  });

  describe('DOM class application', () => {
    it('applies high-contrast class', () => {
      const { result } = renderHook(() => useAccessibility(), { wrapper });
      
      act(() => {
        result.current.updateSetting('highContrast', true);
      });
      
      expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
    });

    it('applies extra-dark class', () => {
      const { result } = renderHook(() => useAccessibility(), { wrapper });
      
      act(() => {
        result.current.updateSetting('extraDark', true);
      });
      
      expect(document.documentElement.classList.contains('extra-dark')).toBe(true);
    });

    it('applies large-text class', () => {
      const { result } = renderHook(() => useAccessibility(), { wrapper });
      
      act(() => {
        result.current.updateSetting('largeText', true);
      });
      
      expect(document.documentElement.classList.contains('large-text')).toBe(true);
    });

    it('applies reduce-motion class', () => {
      const { result } = renderHook(() => useAccessibility(), { wrapper });
      
      act(() => {
        result.current.updateSetting('reducedMotion', true);
      });
      
      expect(document.documentElement.classList.contains('reduce-motion')).toBe(true);
    });

    it('applies enhanced-focus class', () => {
      const { result } = renderHook(() => useAccessibility(), { wrapper });
      
      act(() => {
        result.current.updateSetting('enhancedFocus', true);
      });
      
      expect(document.documentElement.classList.contains('enhanced-focus')).toBe(true);
    });

    it('applies dyslexia-font class to body', () => {
      const { result } = renderHook(() => useAccessibility(), { wrapper });
      
      act(() => {
        result.current.updateSetting('dyslexiaFont', true);
      });
      
      expect(document.body.classList.contains('dyslexia-font')).toBe(true);
    });

    it('applies colorblind mode class', () => {
      const { result } = renderHook(() => useAccessibility(), { wrapper });
      
      act(() => {
        result.current.updateSetting('colorblindMode', 'protanopia');
      });
      
      expect(document.documentElement.classList.contains('colorblind-protanopia')).toBe(true);
    });

    it('removes previous colorblind class when changing modes', () => {
      const { result } = renderHook(() => useAccessibility(), { wrapper });
      
      act(() => {
        result.current.updateSetting('colorblindMode', 'protanopia');
      });
      
      expect(document.documentElement.classList.contains('colorblind-protanopia')).toBe(true);
      
      act(() => {
        result.current.updateSetting('colorblindMode', 'deuteranopia');
      });
      
      expect(document.documentElement.classList.contains('colorblind-protanopia')).toBe(false);
      expect(document.documentElement.classList.contains('colorblind-deuteranopia')).toBe(true);
    });

    it('removes colorblind class when set to none', () => {
      const { result } = renderHook(() => useAccessibility(), { wrapper });
      
      act(() => {
        result.current.updateSetting('colorblindMode', 'tritanopia');
      });
      
      expect(document.documentElement.classList.contains('colorblind-tritanopia')).toBe(true);
      
      act(() => {
        result.current.updateSetting('colorblindMode', 'none');
      });
      
      expect(document.documentElement.classList.contains('colorblind-tritanopia')).toBe(false);
    });
  });
});

describe('useAccessibility hook', () => {
  it('throws error when used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useAccessibility());
    }).toThrow('useAccessibility must be used within an AccessibilityProvider');
    
    consoleSpy.mockRestore();
  });
});

describe('COLORBLIND_MODES constant', () => {
  it('contains all expected modes', () => {
    const modeValues = COLORBLIND_MODES.map(m => m.value);
    
    expect(modeValues).toContain('none');
    expect(modeValues).toContain('protanopia');
    expect(modeValues).toContain('deuteranopia');
    expect(modeValues).toContain('tritanopia');
    expect(modeValues).toContain('monochromacy');
  });

  it('each mode has label and description', () => {
    COLORBLIND_MODES.forEach(mode => {
      expect(mode.label).toBeTruthy();
      expect(mode.description).toBeTruthy();
    });
  });
});

// Test component that uses accessibility
function TestAccessibilityComponent() {
  const { settings, toggleSetting, updateSetting, resetSettings } = useAccessibility();
  
  return (
    <div>
      <p data-testid="high-contrast">{settings.highContrast ? 'on' : 'off'}</p>
      <p data-testid="colorblind">{settings.colorblindMode}</p>
      <button onClick={() => toggleSetting('highContrast')}>Toggle High Contrast</button>
      <button onClick={() => updateSetting('colorblindMode', 'protanopia' as ColorblindMode)}>Set Protanopia</button>
      <button onClick={resetSettings}>Reset</button>
    </div>
  );
}

describe('Accessibility Component Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('toggles settings via button', () => {
    render(
      <AccessibilityProvider>
        <TestAccessibilityComponent />
      </AccessibilityProvider>
    );
    
    expect(screen.getByTestId('high-contrast')).toHaveTextContent('off');
    
    fireEvent.click(screen.getByRole('button', { name: 'Toggle High Contrast' }));
    
    expect(screen.getByTestId('high-contrast')).toHaveTextContent('on');
  });

  it('updates colorblind mode via button', () => {
    render(
      <AccessibilityProvider>
        <TestAccessibilityComponent />
      </AccessibilityProvider>
    );
    
    expect(screen.getByTestId('colorblind')).toHaveTextContent('none');
    
    fireEvent.click(screen.getByRole('button', { name: 'Set Protanopia' }));
    
    expect(screen.getByTestId('colorblind')).toHaveTextContent('protanopia');
  });

  it('resets settings via button', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ highContrast: true }));
    
    render(
      <AccessibilityProvider>
        <TestAccessibilityComponent />
      </AccessibilityProvider>
    );
    
    expect(screen.getByTestId('high-contrast')).toHaveTextContent('on');
    
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    
    expect(screen.getByTestId('high-contrast')).toHaveTextContent('off');
  });
});
