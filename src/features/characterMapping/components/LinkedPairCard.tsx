import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import type { MappedCharacter } from "../types";
import FfxivIcon from "../../../assets/icons/ffxiv.png";
import { DiscordIcon } from "../../../../src/components/DiscordIcon";
import { Link } from "lucide-react";
import { Link2Off } from "lucide-react";

interface LinkedPairCardProps {
  pair: MappedCharacter;
  onUnlink: (pair: MappedCharacter) => void;
  isUnlinking: boolean;
}

export function LinkedPairCard({
  pair,
  onUnlink,
  isUnlinking,
}: LinkedPairCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="
        bg-[var(--bento-bg)]/50
        border border-[var(--bento-border)]
        rounded-xl p-3
        hover:border-[var(--bento-primary)]/20
        transition-colors
        flex flex-col
      "
    >
      {/* Character */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-lg bg-[var(--bento-primary)]/10 flex items-center justify-center flex-shrink-0">
          <img
            src={FfxivIcon}
            className="w-7 h-7 text-[var(--bento-primary)]"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-soft font-semibold text-sm text-[var(--bento-text)] truncate leading-tight">
            {pair.characterName}
          </p>
          <p className="text-[10px] font-mono text-[var(--bento-text-muted)]/50 truncate leading-tight">
            {pair.characterId}
          </p>
        </div>
      </div>

      {/* Connector */}
      <div className="flex items-center gap-2 pl-1 mb-2">
        <Link className="text-[var(--bento-text-muted)]" />
      </div>

      {/* Discord */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#5865F2]/15 flex items-center justify-center flex-shrink-0">
          <DiscordIcon className="h-6 text-[#5865F2]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-soft font-semibold text-sm text-[var(--bento-text)] truncate leading-tight">
            {pair.discordName}
          </p>
          <p className="text-[10px] font-mono text-[var(--bento-text-muted)]/50 truncate leading-tight">
            {pair.discordId}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={() => onUnlink(pair)}
          disabled={isUnlinking}
          className="
            flex-1 flex items-center justify-center gap-1.5 
            px-3 py-2 rounded-lg text-xs font-soft font-semibold
            bg-red-400 hover:bg-red-600 text-white
            transition-colors cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed
            focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:outline-none
          "
        >
          {isUnlinking ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Link2Off className="w-3.5 h-3.5" />
          )}
          Unlink
        </button>
      </div>
    </motion.div>
  );
}
