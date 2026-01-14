/**
 * useHaptics - Provides native-style haptic feedback for touch interactions.
 * 
 * Uses the Vibration API on Android and falls back gracefully on iOS
 * (iOS Safari doesn't support Vibration API but has native haptics through certain interactions).
 */

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

// Vibration patterns (in milliseconds) for different feedback types
const hapticPatterns: Record<HapticStyle, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 20],
  warning: [20, 100, 20],
  error: [30, 100, 30, 100, 30],
  selection: 5,
};

/**
 * Check if the device supports vibration
 */
function supportsVibration(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

/**
 * Check if device is iOS (doesn't support Vibration API)
 */
function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

/**
 * Trigger haptic feedback
 */
function triggerHaptic(style: HapticStyle = 'light'): void {
  // iOS doesn't support Vibration API, skip silently
  if (isIOS()) return;
  
  if (supportsVibration()) {
    try {
      const pattern = hapticPatterns[style];
      navigator.vibrate(pattern);
    } catch {
      // Silently fail if vibration fails
    }
  }
}

/**
 * useHaptics hook - provides haptic feedback functions
 */
export function useHaptics() {
  return {
    /** Light tap feedback - for selections and minor interactions */
    light: () => triggerHaptic('light'),
    /** Medium tap feedback - for button taps and confirmations */
    medium: () => triggerHaptic('medium'),
    /** Heavy tap feedback - for important actions */
    heavy: () => triggerHaptic('heavy'),
    /** Success pattern - for completed actions */
    success: () => triggerHaptic('success'),
    /** Warning pattern - for alerts */
    warning: () => triggerHaptic('warning'),
    /** Error pattern - for failures */
    error: () => triggerHaptic('error'),
    /** Selection tick - for picker/toggle changes */
    selection: () => triggerHaptic('selection'),
    /** Generic trigger with custom style */
    trigger: triggerHaptic,
    /** Whether haptics are supported */
    isSupported: supportsVibration() && !isIOS(),
  };
}

/**
 * Standalone haptic trigger for use outside of React components
 */
export const haptics = {
  light: () => triggerHaptic('light'),
  medium: () => triggerHaptic('medium'),
  heavy: () => triggerHaptic('heavy'),
  success: () => triggerHaptic('success'),
  warning: () => triggerHaptic('warning'),
  error: () => triggerHaptic('error'),
  selection: () => triggerHaptic('selection'),
  trigger: triggerHaptic,
};
