import type { MatchConfidence, MatchPair } from '../../utils/characterMatching';
import type {
  UnmappedCharacter,
  UnmappedDiscordUser,
} from '../../api/characterMapping';

// Re-export for convenience
export type { MatchConfidence, MatchPair, UnmappedCharacter, UnmappedDiscordUser };

// --- Tab types ---------------------------------------------------------------

export type TabId = 'matches' | 'manual';

// --- Match info --------------------------------------------------------------

export interface MatchInfo {
  confidence: MatchConfidence;
  score: number;
}

// --- Confidence config -------------------------------------------------------

export const confidenceConfig: Record<
  MatchConfidence,
  { label: string; className: string }
> = {
  exact: {
    label: 'Exact Match',
    className: 'bg-green-500/15 text-green-600 dark:text-green-400',
  },
  high: {
    label: 'High',
    className: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  },
  medium: {
    label: 'Medium',
    className: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  },
  low: {
    label: 'Low',
    className: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
  },
};
