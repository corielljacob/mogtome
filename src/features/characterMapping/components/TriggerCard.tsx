import { Link2, Loader2, AlertCircle, Check, ChevronRight } from "lucide-react";
import { ContentCard } from "../../../components/ContentCard";

export function TriggerCard({
  onOpen,
  isLoading,
  isError,
  hasAnyUnmapped,
  charactersCount,
  totalMatches,
}: {
  onOpen: () => void;
  isLoading: boolean;
  isError: boolean;
  hasAnyUnmapped: boolean;
  charactersCount: number;
  totalMatches: number;
}) {
  return (
    <div
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Open Character Mapping"
      className="cursor-pointer group"
    >
      <ContentCard className="h-full flex flex-col group-hover:border-[var(--primary)]/25 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5 sm:gap-3">
            <span className="icon-badge w-10 h-10 shrink-0 text-[var(--primary)]">
              <Link2 className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-display font-bold text-base sm:text-lg text-[var(--text)]">
                Character Mapping
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
                Link characters to Discord accounts
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors mt-2" />
        </div>

        <div className="flex-1 flex items-center justify-center py-6 sm:py-8">
          {isLoading ? (
            <Loader2 className="w-6 h-6 text-[var(--primary)] animate-spin" />
          ) : isError ? (
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-[var(--text-muted)] font-soft">
                Error loading data
              </p>
            </div>
          ) : !hasAnyUnmapped ? (
            <div className="text-center">
              <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-[var(--text-muted)] font-soft">
                All accounts mapped!
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-6 text-center">
              <div>
                <p className="text-2xl font-display font-bold text-[var(--text)]">
                  {charactersCount}
                </p>
                <p className="text-xs text-[var(--text-muted)] font-soft">
                  To Link
                </p>
              </div>
              {totalMatches > 0 && (
                <>
                  <div className="w-px h-8 bg-[var(--border)]" />
                  <div>
                    <p className="text-2xl font-display font-bold text-green-500">
                      {totalMatches}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] font-soft">
                      Suggested
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </ContentCard>
    </div>
  );
}
