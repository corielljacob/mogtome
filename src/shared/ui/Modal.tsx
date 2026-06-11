import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { KawaiiSparkle, KawaiiBow } from "@/shared/ui/kawaiiMotifs";
import { TapeStrip } from "@/shared/ui/stickers";
import { useIsMobile } from "@/shared/hooks/useMobile";

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

// A cozy scrapbook modal. On desktop it's a sheet of sticker-paper taped onto a
// dimmed page (kawaii title row, hand-written eyebrow, die-cut sticker buttons).
// On phones it becomes a native-feeling bottom sheet: slides up from the bottom,
// rounded top, a grab handle that swipes-to-dismiss, and safe-area aware padding
// so action bars clear the home indicator. Handles scroll-lock, Escape, focus
// and backdrop-close so callers just pass content. Shared across the app.
//
// NOTE: animations are pure CSS (see animations.css: sheetSlideUp / modalPop /
// fadeIn) and the swipe-to-dismiss is plain touch handlers - Framer Motion was
// removed app-wide because its mount/unmount churned the iOS Safari compositor.
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
  const isMobile = useIsMobile();

  // swipe-to-dismiss for the mobile sheet (replaces Framer's drag). Driven only
  // from the grab handle so it never hijacks scrolling inside the body. Follows
  // the finger downward; release past a threshold closes, else snaps back.
  const [dragY, setDragY] = useState(0);
  const dragStartY = useRef<number | null>(null);

  const onHandleTouchStart = (e: ReactTouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  };
  const onHandleTouchMove = (e: ReactTouchEvent) => {
    if (dragStartY.current === null) return;
    const dy = e.touches[0].clientY - dragStartY.current;
    // rubbery: follow at full speed down, ignore upward
    setDragY(dy > 0 ? dy : 0);
  };
  const onHandleTouchEnd = () => {
    if (dragStartY.current === null) return;
    const shouldClose = dragY > 120;
    dragStartY.current = null;
    setDragY(0);
    if (shouldClose) onClose();
  };

  // lock the page behind the modal (html is the document scroller)
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prevRoot = root.style.overflow;
    const prevBody = document.body.style.overflow;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      root.style.overflow = prevRoot;
      document.body.style.overflow = prevBody;
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

  if (!open) return null;

  // header controls (close + any caller actions) - identical on both layouts
  const controls = (
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
  );

  const titleBlock = (
    <>
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
    </>
  );

  const body = (
    <div
      className={`flex-1 min-h-0 ${padded ? "px-4 sm:px-5 py-4" : ""} ${
        scroll
          ? "overflow-y-auto overscroll-contain"
          : "overflow-hidden flex flex-col"
      } ${isMobile && !footer ? "pb-[calc(1rem+env(safe-area-inset-bottom))]" : ""}`}
    >
      {children}
    </div>
  );

  const footerBlock = footer && (
    <div
      className={`shrink-0 ${isMobile ? "pb-[env(safe-area-inset-bottom)]" : ""}`}
    >
      {footer}
    </div>
  );

  const divider = (
    <div
      className="mx-5 border-t-2 border-dashed border-[color:color-mix(in_srgb,var(--primary)_22%,transparent)] shrink-0"
      aria-hidden="true"
    />
  );

  return createPortal(
    <div
      className={`fixed inset-x-0 top-0 h-[100dvh] z-50 flex justify-center ${
        isMobile ? "items-end" : "items-center p-4 sm:p-6"
      }`}
    >
      {/* dim the page behind */}
      <div
        onClick={closeOnBackdrop ? onClose : undefined}
        className="absolute inset-x-0 top-0 h-full bg-black/45"
        style={{ animation: "fadeIn 0.2s ease-out" }}
        aria-hidden="true"
      />

      {isMobile ? (
        /* ---- phone: bottom sheet ---- */
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="relative z-10 w-full max-w-[40rem] focus:outline-none"
          style={
            dragY
              ? { transform: `translateY(${dragY}px)` }
              : {
                  animation:
                    "sheetSlideUp 0.32s cubic-bezier(0.22, 1, 0.36, 1)",
                }
          }
        >
          <div className="surface relative flex max-h-[92dvh] flex-col overflow-hidden rounded-t-3xl rounded-b-none">
            {/* grab handle - the swipe-to-dismiss grip */}
            <div
              onTouchStart={onHandleTouchStart}
              onTouchMove={onHandleTouchMove}
              onTouchEnd={onHandleTouchEnd}
              style={{ touchAction: "none" }}
              className="flex justify-center pt-3 pb-1 shrink-0 cursor-grab active:cursor-grabbing"
            >
              <div
                className="h-1.5 w-10 rounded-full bg-[color:color-mix(in_srgb,var(--text-subtle)_40%,transparent)]"
                aria-hidden="true"
              />
            </div>

            <div className="relative px-6 pt-1 pb-4 text-center shrink-0">
              {controls}
              {titleBlock}
            </div>

            {divider}
            {body}
            {footerBlock}
          </div>
        </div>
      ) : (
        /* ---- desktop: taped scrapbook dialog ---- */
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className={`relative z-10 w-full ${SIZES[size]} max-h-[88vh] focus:outline-none`}
          style={{
            animation: "modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <div className="surface relative flex max-h-[88vh] flex-col overflow-hidden">
            <div className="relative px-6 pt-7 pb-4 text-center shrink-0">
              {controls}
              {titleBlock}
            </div>

            {divider}
            {body}
            {footerBlock}
          </div>

          {/* washi tape pinning the page to the board */}
          <TapeStrip className="z-20 -top-3 left-10 -rotate-[10deg]" />
          <TapeStrip
            className="z-20 -top-3 right-10 rotate-[10deg]"
            color="var(--accent)"
          />
        </div>
      )}
    </div>,
    document.body,
  );
}
