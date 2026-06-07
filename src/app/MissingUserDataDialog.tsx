import { useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/shared/ui/Button";

import deadMoogle from "@/assets/moogles/dead moogle.webp";

export function MissingUserDataDialog() {
  const [searchParams, setSearchParams] = useSearchParams();
  // open state derives from the URL flag, so there's no local state to sync
  const isOpen = searchParams.get("missingUserData") === "true";
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = useCallback(() => {
    // drop the param; isOpen re-derives false and AnimatePresence plays the exit
    searchParams.delete("missingUserData");
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const root = document.documentElement;
    if (isOpen) {
      closeButtonRef.current?.focus();
      root.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      root.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      root.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            aria-hidden="true"
          />

          <motion.div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="missing-data-title"
            aria-describedby="missing-data-desc"
            className="relative w-full max-w-md bg-[var(--card)] rounded-lg shadow-sm border border-[var(--border)] overflow-hidden"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-500/15 via-orange-500/5 to-transparent pointer-events-none" />

            <div className="absolute top-4 left-6 opacity-70">
              <motion.div
                animate={{ rotate: [-5, 5, -5] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </motion.div>
            </div>
            <div className="absolute top-16 right-8 opacity-50 pointer-events-none">
              <motion.div
                animate={{ rotate: [5, -5, 5] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3,
                }}
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </motion.div>
            </div>

            <button
              ref={closeButtonRef}
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-[var(--bg)] transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5 text-[var(--text-muted)]" />
            </button>

            <div className="relative p-6 pt-8 sm:p-8 sm:pt-10">
              <div className="flex justify-center mb-4">
                <motion.img
                  src={deadMoogle}
                  alt="A tired moogle flopped over"
                  className="w-28 sm:w-32 drop-shadow-lg"
                  initial={{ y: 20, opacity: 0, rotate: -5 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.2 }}
                />
              </div>

              <h2
                id="missing-data-title"
                className="text-2xl sm:text-3xl font-display font-bold text-center text-amber-500 mb-4"
              >
                Hold Up, Kupo!
              </h2>

              <div id="missing-data-desc" className="space-y-4 text-center">
                <p className="text-[var(--text)] leading-relaxed">
                  Your Discord has not yet been linked to your character.
                </p>
                <p className="text-[var(--text-muted)] leading-relaxed">
                  Please try logging in again in a few hours. If you still see
                  this message, shoot a message to{" "}
                  <span className="font-semibold text-[var(--primary)]">
                    Plane Donut
                  </span>{" "}
                  on Discord!
                </p>
              </div>

              <div className="flex justify-center mt-6">
                <Button
                  onClick={handleClose}
                  className="px-8 bg-amber-500 hover:bg-amber-600 border-amber-600"
                >
                  Got it, kupo~
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
