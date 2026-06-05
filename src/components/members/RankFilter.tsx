import { type CSSProperties } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { KawaiiBow } from "../kawaiiMotifs";
import { getRankColor } from "../../constants/rankColors";
import { FC_RANKS } from "../../types";

export function RankFilter({
  selectedRanks,
  toggleRank,
  clearFilters,
  hasActiveFilters,
  filteredCount,
  totalCount,
  rankCounts,
}: {
  selectedRanks: string[];
  toggleRank: (rankName: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  filteredCount: number;
  totalCount: number;
  rankCounts: Record<string, number>;
}) {
  return (
    <section className="relative mb-7 sm:mb-9">
      <span
        className="pushpin absolute -top-2 left-8 z-10"
        style={{ "--pin": "var(--accent)" } as CSSProperties}
        aria-hidden="true"
      />
      <span
        className="pushpin absolute -top-2 right-8 z-10"
        style={{ "--pin": "var(--secondary)" } as CSSProperties}
        aria-hidden="true"
      />
      <div className="surface paper p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <KawaiiBow className="w-5 h-5 text-[var(--primary)]" />
            <span className="font-display font-bold text-sm text-[var(--text)]">
              Pick a rank, kupo!
            </span>
            {hasActiveFilters && (
              <span
                id="search-results-count"
                aria-live="polite"
                className="text-xs font-soft text-[var(--text-muted)]"
              >
                ·{" "}
                <span className="font-display font-bold text-[var(--primary)]">
                  {filteredCount}
                </span>
                /{totalCount}
              </span>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm font-display font-bold text-[var(--text-muted)] hover:text-[var(--primary)] active:text-[var(--primary)] transition-colors cursor-pointer touch-manipulation"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter by rank"
        >
          {FC_RANKS.map((rank) => {
            const count = rankCounts[rank.name] || 0;
            const isSelected = selectedRanks.includes(rank.name);
            const rankColor = getRankColor(rank.name);
            const RankIcon = rankColor.icon;
            return (
              <motion.button
                key={rank.name}
                onClick={() => toggleRank(rank.name)}
                aria-pressed={isSelected}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`
                      inline-flex items-center gap-1.5
                      pl-1.5 pr-3 py-1.5 rounded-full text-sm font-display font-bold
                      cursor-pointer transition-colors duration-200 touch-manipulation
                      focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
                      ${isSelected ? "gel text-white" : "bg-[var(--card)] border-2 text-[var(--text)]"}
                    `}
                style={
                  isSelected
                    ? ({ "--gel-color": rankColor.hex } as CSSProperties)
                    : ({
                        borderColor: `color-mix(in srgb, ${rankColor.hex} 32%, var(--card))`,
                      } as CSSProperties)
                }
              >
                <span
                  className="flex items-center justify-center w-6 h-6 rounded-full shrink-0"
                  style={
                    isSelected
                      ? { background: "rgba(255,255,255,0.22)" }
                      : {
                          background: `color-mix(in srgb, ${rankColor.hex} 16%, var(--card))`,
                        }
                  }
                >
                  <RankIcon
                    className="w-3.5 h-3.5"
                    style={{ color: isSelected ? "#fff" : rankColor.hex }}
                    aria-hidden="true"
                  />
                </span>
                <span>{rank.name}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full leading-none ${isSelected ? "bg-white/25" : "bg-[var(--bg)] text-[var(--text-muted)]"}`}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
