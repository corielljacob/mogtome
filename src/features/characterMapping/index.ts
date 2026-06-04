// Main component
export { CharacterMapping } from "./CharacterMapping";

// Sub-components (for potential reuse/testing)
export {
  ConfidenceBadge,
  EmptyState,
  SearchInput,
  CharacterItem,
  DiscordUserItem,
} from "./components";

// Hooks
export { useCharacterMapping, useSmartPicker, pairKey } from "./hooks";
export type {
  UseCharacterMappingResult,
  UseSmartPickerResult,
} from "./hooks";

// Types
export type {
  MatchInfo,
  MatchConfidence,
  MatchPair,
  UnmappedCharacter,
  UnmappedDiscordUser,
} from "./types";
export { confidenceConfig } from "./types";
