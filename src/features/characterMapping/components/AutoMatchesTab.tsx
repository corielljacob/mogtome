import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { MatchPair, UnmappedCharacter, UnmappedDiscordUser } from '../types';
import { MatchPairCard } from './MatchPairCard';
import { EmptyState } from './EmptyState';
import { Tag } from '../../../components/Tag';
import { pairKey } from '../hooks';

interface AutoMatchesTabProps {
  visibleExactMatches: MatchPair[];
  visibleSuggestedMatches: MatchPair[];
  totalMatches: number;
  unmatchedCharacters: UnmappedCharacter[];
  unmatchedDiscordUsers: UnmappedDiscordUser[];
  confirmingPairKey: string | null;
  onConfirmPair: (pair: MatchPair) => void;
  onDismissPair: (pair: MatchPair) => void;
  onSwitchToManual: () => void;
}

export function AutoMatchesTab({
  visibleExactMatches,
  visibleSuggestedMatches,
  totalMatches,
  unmatchedCharacters,
  unmatchedDiscordUsers,
  confirmingPairKey,
  onConfirmPair,
  onDismissPair,
  onSwitchToManual,
}: AutoMatchesTabProps) {
  const [exactExpanded, setExactExpanded] = useState(true);
  const [suggestedExpanded, setSuggestedExpanded] = useState(true);

  if (totalMatches === 0) {
    return (
      <EmptyState
        icon={<HelpCircle className="w-7 h-7 text-[var(--primary)]" />}
        title="No matches yet, kupo"
        subtitle="The moogles couldn't sniff out any likely pairs. Pop over to the Manual tab to link accounts by hand, kupo~"
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto min-h-0 space-y-4">
      {/* Exact matches section */}
      {visibleExactMatches.length > 0 && (
        <div>
          <button
            onClick={() => setExactExpanded(!exactExpanded)}
            className="flex items-center gap-2 mb-3 w-full text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none rounded-lg"
          >
            {exactExpanded ? (
              <ChevronDown className="w-4 h-4 text-green-500" />
            ) : (
              <ChevronUp className="w-4 h-4 text-green-500" />
            )}
            <Sparkles className="w-4 h-4 text-green-500" />
            <span className="font-soft font-semibold text-sm text-[var(--text)]">
              Exact Matches
            </span>
            <Tag color="#22c55e">{visibleExactMatches.length}</Tag>
          </button>
          <AnimatePresence mode="popLayout">
            {exactExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-hidden"
              >
                {visibleExactMatches.map((pair) => (
                  <MatchPairCard
                    key={pairKey(pair)}
                    pair={pair}
                    onConfirm={onConfirmPair}
                    onDismiss={onDismissPair}
                    isConfirming={confirmingPairKey === pairKey(pair)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Suggested matches section */}
      {visibleSuggestedMatches.length > 0 && (
        <div>
          <button
            onClick={() => setSuggestedExpanded(!suggestedExpanded)}
            className="flex items-center gap-2 mb-3 w-full text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none rounded-lg"
          >
            {suggestedExpanded ? (
              <ChevronDown className="w-4 h-4 text-amber-500" />
            ) : (
              <ChevronUp className="w-4 h-4 text-amber-500" />
            )}
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span className="font-soft font-semibold text-sm text-[var(--text)]">
              Suggested Matches
            </span>
            <Tag color="#f59e0b">{visibleSuggestedMatches.length}</Tag>
          </button>
          <AnimatePresence mode="popLayout">
            {suggestedExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-hidden"
              >
                {visibleSuggestedMatches.map((pair) => (
                  <MatchPairCard
                    key={pairKey(pair)}
                    pair={pair}
                    onConfirm={onConfirmPair}
                    onDismiss={onDismissPair}
                    isConfirming={confirmingPairKey === pairKey(pair)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Unmatched summary */}
      {(unmatchedCharacters.length > 0 || unmatchedDiscordUsers.length > 0) && (
        <div className="pt-2 border-t border-[var(--border)]">
          <p className="text-xs text-[var(--text-muted)] font-soft">
            {unmatchedCharacters.length} character
            {unmatchedCharacters.length !== 1 ? 's' : ''} and{' '}
            {unmatchedDiscordUsers.length} Discord user
            {unmatchedDiscordUsers.length !== 1 ? 's' : ''} couldn&apos;t be
            auto-matched.{' '}
            <button
              onClick={onSwitchToManual}
              className="text-[var(--primary)] font-semibold hover:underline cursor-pointer"
            >
              Link them manually &rarr;
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
