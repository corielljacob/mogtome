import { ArrowLeft, Link2, RefreshCw } from "lucide-react";
import { IconButton } from "@/components/Button";

export function OverlayHeader({
  onClose,
  onRefresh,
  isLoading,
}: {
  onClose: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}) {
  return (
    <div className="relative z-10 flex-shrink-0 border-b border-[var(--border)]/50 bg-[var(--bg)]/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <IconButton
            variant="ghost"
            size="md"
            icon={<ArrowLeft className="w-5 h-5" />}
            aria-label="Close"
            onClick={onClose}
            className="-ml-1"
          />
          <div className="flex items-center gap-2.5">
            <span className="icon-badge w-9 h-9 shrink-0 text-[var(--primary)]">
              <Link2 className="w-4 h-4" aria-hidden="true" />
            </span>
            <div>
              <h1 className="font-display font-bold text-base sm:text-lg text-[var(--text)]">
                Character Mapping
              </h1>
              <p className="text-xs text-[var(--text-muted)] hidden sm:block">
                Link characters to Discord accounts
              </p>
            </div>
          </div>
        </div>

        <IconButton
          variant="ghost"
          size="md"
          icon={
            <RefreshCw
              className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
            />
          }
          aria-label="Refresh unmapped lists"
          onClick={onRefresh}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
