// Main component
export { CharacterMapping } from './CharacterMapping';

// Sub-components (for potential reuse/testing)
export {
  ConfidenceBadge,
  EmptyState,
  SearchInput,
  CharacterItem,
  DiscordUserItem,
  MatchPairCard,
  SmartMatchesTab,
  ManualPickerTab,
} from './components';

// Hooks
export { useCharacterMapping, useManualPicker, pairKey } from './hooks';
export type { UseCharacterMappingResult, UseManualPickerResult } from './hooks';

// Types
export type {
  TabId,
  MatchInfo,
  MatchConfidence,
  MatchPair,
  UnmappedCharacter,
  UnmappedDiscordUser,
} from './types';
export { confidenceConfig } from './types';
