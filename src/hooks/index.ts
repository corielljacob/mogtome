export { useMembers, useMemberByCharacterId } from './useMembers';
export { useEventsHub } from './useEventsHub';
export { useReducedMotion, getReducedMotionProps } from './useReducedMotion';
export { useIntersectionObserver, useLazyImage } from './useIntersectionObserver';
export { useSeasonalEvent } from './useSeasonalEvent';
export type { ConnectionStatus } from './useEventsHub';
export type { UseSeasonalEventReturn } from './useSeasonalEvent';

// Re-export character mapping hooks from feature module
export {
  useCharacterMapping,
  useManualPicker,
} from '../features/characterMapping';
export type {
  UseCharacterMappingResult,
  UseManualPickerResult,
} from '../features/characterMapping';
export type { MatchInfo } from '../features/characterMapping';

// Mobile utilities
export { 
  useIsMobile, 
  useHasTouch, 
  useHapticFeedback, 
  useLockBodyScroll,
  useSafeAreaInsets,
  useReducedMotion as usePrefersReducedMotion,
} from './useMobile';