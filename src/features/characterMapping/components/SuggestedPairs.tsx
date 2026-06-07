import { type CSSProperties } from "react";
import { AnimatePresence } from "motion/react";
import { Check, Loader2, Wand2 } from "lucide-react";
import { PairCard } from "@/features/characterMapping/components/PairCard";
import { pairKey } from "@/features/characterMapping/hooks/useCharacterMapping";
import type { MatchPair } from "@/features/characterMapping/types";
import mailMoogle from "@/assets/moogles/moogle mail.webp";

interface SuggestedPairsProps {
  pairs: MatchPair[];
  exactCount: number;
  confirmingPairKey: string | null;
  isConfirmingAll: boolean;
  onConfirm: (pair: MatchPair) => void;
  onSkip: (pair: MatchPair) => void;
  onConfirmAllExact: () => void;
  onGoManual: () => void;
}

export function SuggestedPairs({
  pairs,
  exactCount,
  confirmingPairKey,
  isConfirmingAll,
  onConfirm,
  onSkip,
  onConfirmAllExact,
  onGoManual,
}: SuggestedPairsProps) {
  if (pairs.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-center py-10">
        <img
          src={mailMoogle}
          alt=""
          aria-hidden="true"
          className="w-24 sm:w-28 mb-3 object-contain"
        />
        <p className="font-display font-bold text-lg text-[var(--text)]">
          No suggestions to confirm
        </p>
        <p className="font-soft text-sm text-[var(--text-muted)] mt-1 max-w-xs">
          We couldn&apos;t find confident matches, kupo~ You can still pair the
          rest by hand.
        </p>
        <button
          onClick={onGoManual}
          className="gel hover-bounce mt-4 inline-flex items-center gap-1.5 px-4 py-2 font-display font-bold text-sm text-white cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary)]"
        >
          <Wand2 className="w-4 h-4" aria-hidden="true" />
          Match by hand
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex flex-1 flex-col min-h-0">
      <div className="flex items-center justify-between gap-3 mb-3 shrink-0">
        <p className="font-soft text-sm text-[var(--text-muted)]">
          {pairs.length} suggested {pairs.length === 1 ? "pairing" : "pairings"}{" "}
          &mdash; one tap to link, kupo~
        </p>
        {exactCount > 0 && (
          <button
            onClick={onConfirmAllExact}
            disabled={isConfirmingAll}
            className="gel hover-bounce shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 font-display font-bold text-sm text-white disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--gel-color)]"
            style={{ "--gel-color": "#22c55e" } as CSSProperties}
          >
            {isConfirmingAll ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Check className="w-4 h-4" aria-hidden="true" />
            )}
            Confirm {exactCount} exact {exactCount === 1 ? "match" : "matches"}
          </button>
        )}
      </div>

      <div className="space-y-3 overflow-y-auto pr-1 -mr-1 pb-2 pt-1">
        <AnimatePresence mode="popLayout" initial={false}>
          {pairs.map((pair) => (
            <PairCard
              key={pairKey(pair)}
              pair={pair}
              isConfirming={confirmingPairKey === pairKey(pair)}
              disabled={isConfirmingAll}
              onConfirm={() => onConfirm(pair)}
              onSkip={() => onSkip(pair)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
