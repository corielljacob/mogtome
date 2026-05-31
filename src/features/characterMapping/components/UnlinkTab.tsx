import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import type { MappedCharacter } from "../types";
import { LinkedPairCard } from "./LinkedPairCard";
import { SearchInput } from "./SearchInput";

interface UnlinkTabProps {
  mappedCharacters: MappedCharacter[];
  onUnlink: (pair: MappedCharacter) => void;
  isUnlinking: boolean;
  // onConfirmPair: (pair: MatchPair) => void;
  // onDismissPair: (pair: MatchPair) => void;
}

export function UnlinkTab({
  mappedCharacters,
  onUnlink,
  isUnlinking,
  // onConfirmPair,
  // onDismissPair,
}: UnlinkTabProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Crapper loader to give the rendering time when there are a large amount of cards, meh
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 300);

  //   return () => clearTimeout(timer);
  // }, []);

  // if (isLoading) {
  //   return (
  //     <div className="flex-1 flex flex-col items-center justify-center min-h-0 py-16">
  //       <motion.div
  //         initial={{ opacity: 0, scale: 1 }}
  //         animate={{ opacity: 1, scale: 1 }}
  //         className="flex flex-col items-center gap-4"
  //       >
  //         <Loader2 className="w-8 h-8 text-[var(--bento-primary)] animate-spin" />
  //       </motion.div>
  //     </div>
  //   );
  // }

  return (
    <>
      <SearchInput
        value={searchTerm}
        onChange={(value) => setSearchTerm(value)}
        placeholder="Search characters..."
      />
      <div className="flex-1 overflow-y-auto min-h-0 space-y-4">
        <AnimatePresence mode="popLayout">
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-hidden"
          >
            {mappedCharacters
              .filter(
                (pair) =>
                  pair.characterName.includes(searchTerm) ||
                  pair.discordName.includes(searchTerm),
              )
              .map((pair, index) => (
                <LinkedPairCard
                  key={index}
                  pair={pair}
                  onUnlink={() => onUnlink(pair)}
                  isUnlinking={isUnlinking}
                />
              ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
