import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, X, Link2 } from "lucide-react";
import { Button, IconButton } from "../../../components/Button";

export function LinkBar({
  show,
  characterName,
  discordName,
  canLink,
  isMapping,
  onClear,
  onLink,
}: {
  show: boolean;
  characterName: string | undefined;
  discordName: string | undefined;
  canLink: boolean;
  isMapping: boolean;
  onClear: () => void;
  onLink: () => void;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
          className="relative z-10 flex-shrink-0 border-t border-[var(--border)]/60 bg-[var(--bg)]/90"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1 text-sm">
              <span className="font-display font-semibold text-[var(--text)] truncate">
                {characterName ?? "Pick a character"}
              </span>
              <ArrowRight className="w-4 h-4 text-[var(--text-subtle)] shrink-0" />
              <span
                className={`font-display font-semibold truncate ${discordName ? "text-[var(--text)]" : "text-[var(--text-subtle)]"}`}
              >
                {discordName ?? "Pick a Discord account"}
              </span>
            </div>
            <IconButton
              variant="ghost"
              size="sm"
              icon={<X className="w-4 h-4" />}
              aria-label="Clear selection"
              onClick={onClear}
            />
            <Button
              variant="primary"
              size="sm"
              isLoading={isMapping}
              disabled={!canLink}
              onClick={onLink}
              className="shrink-0"
            >
              {!isMapping && <Link2 className="w-4 h-4" aria-hidden="true" />}
              Link
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
