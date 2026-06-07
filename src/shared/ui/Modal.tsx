import { useEffect, useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { KawaiiSparkle, KawaiiBow } from "@/shared/ui/kawaiiMotifs";
import { TapeStrip } from "@/shared/ui/stickers";

const SIZES = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
} as const;

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** little hand-written line above the title */
  eyebrow?: string;
  /** shown as a badge in the kawaii title row (falls back to a bow) */
  icon?: ReactNode;
  /** extra controls placed beside the close sticker (e.g. a refresh) */
  headerActions?: ReactNode;
  /** sticky area pinned under the body (e.g. an action bar) */
  footer?: ReactNode;
  size?: keyof typeof SIZES;
  closeOnBackdrop?: boolean;
  /** pad the body (default true); turn off to lay the body out yourself */
  padded?: boolean;
  /** let the body scroll (default true); turn off for internal scroll regions */
  scroll?: boolean;
  children: ReactNode;
}

// A cozy scrapbook modal: a sheet of sticker-paper taped onto a dimmed, blurred
// page. Kawaii title row, a hand-written eyebrow, a highlighted title, and
// die-cut sticker buttons. Handles scroll-lock, Escape, focus and backdrop-close
// so callers just pass content. Shared across the app.
export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  icon,
  headerActions,
  footer,
  size = "md",
  closeOnBackdrop = true,
  padded = true,
  scroll = true,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // lock the page behind the modal
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape to close + move focus into the dialog, restoring it on close
  useEffect(() => {
    if (!open) return;
    const prevActive = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prevActive?.focus?.();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          {/* dim + blur the page behind */}
          <div
            onClick={closeOnBackdrop ? onClose : undefined}
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.92, y: 18, rotate: -1.5 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 280 }}
            className={`relative z-10 w-full ${SIZES[size]} max-h-[88vh] focus:outline-none`}
          >
            {/* the sheet of sticker-paper */}
            <div className="surface relative flex max-h-[88vh] flex-col overflow-hidden">
              {/* header */}
              <div className="relative px-6 pt-7 pb-4 text-center shrink-0">
                {/* die-cut sticker controls, tucked in the corner */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
                  {headerActions}
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="grid place-items-center w-9 h-9 rounded-full border-2 border-white bg-[color:color-mix(in_srgb,var(--secondary)_22%,var(--card))] text-[var(--secondary)] shadow-[0_4px_10px_-3px_rgba(0,0,0,0.25)] transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 hover:rotate-[12deg] active:scale-90 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--card)]"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                <div
                  className="flex items-center justify-center gap-2 mb-1.5"
                  aria-hidden="true"
                >
                  <KawaiiSparkle className="w-3.5 h-3.5 text-[var(--accent)]" />
                  {icon ? (
                    <span className="icon-badge w-9 h-9 text-[var(--primary)]">
                      {icon}
                    </span>
                  ) : (
                    <KawaiiBow className="w-6 h-6 text-[var(--primary)]" />
                  )}
                  <KawaiiSparkle className="w-3.5 h-3.5 text-[var(--secondary)]" />
                </div>

                {eyebrow && (
                  <p className="eyebrow-script text-base sm:text-lg text-[var(--secondary)]/90 mb-0.5">
                    {eyebrow}
                  </p>
                )}

                <h2
                  id={titleId}
                  className="font-display font-bold text-xl sm:text-2xl text-[var(--text)] leading-tight"
                >
                  <span className="text-highlight">{title}</span>
                </h2>
              </div>

              {/* dashed scrapbook divider */}
              <div
                className="mx-5 border-t-2 border-dashed border-[color:color-mix(in_srgb,var(--primary)_22%,transparent)] shrink-0"
                aria-hidden="true"
              />

              {/* body */}
              <div
                className={`flex-1 min-h-0 ${padded ? "px-4 sm:px-5 py-4" : ""} ${
                  scroll ? "overflow-y-auto" : "overflow-hidden flex flex-col"
                }`}
              >
                {children}
              </div>

              {footer && <div className="shrink-0">{footer}</div>}
            </div>

            {/* washi tape pinning the page to the board */}
            <TapeStrip className="z-20 -top-3 left-10 -rotate-[10deg]" />
            <TapeStrip
              className="z-20 -top-3 right-10 rotate-[10deg]"
              color="var(--accent)"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
