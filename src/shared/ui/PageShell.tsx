import type { ReactNode } from "react";
import { Heart, RefreshCw, Sparkles, X } from "lucide-react";
import { StoryDivider } from "@/shared/ui/StoryDivider";
import { FloatingSparkles } from "@/shared/ui/FloatingSparkles";
import { FloatingBubbles } from "@/shared/ui/FloatingBubbles";
import { SimpleFloatingMoogles } from "@/shared/ui/FloatingMoogles";
import { ContentCard } from "@/shared/ui/ContentCard";
import { KawaiiSparkle, KawaiiBow, KawaiiStar } from "@/shared/ui/kawaiiMotifs";

import pushingMoogles from "@/assets/moogles/moogles pushing.webp";
import deadMoogle from "@/assets/moogles/dead moogle.webp";

interface PageLayoutProps {
  children: ReactNode;
  moogles?: { primary: string; secondary: string };
  maxWidth?: string;
  className?: string;
  /**
   * Phones only: when the page's content is a full `.corkboard`, pass `bleed` so
   * this layout drops its own top/bottom clearance and the board itself runs to
   * the screen edges (behind the status bar + floating nav). The board provides
   * the chrome clearance via its own padding (see components.css). Non-corkboard
   * pages leave this off so their content still clears the chrome.
   */
  bleed?: boolean;
}

export function PageLayout({
  children,
  moogles,
  // One shared width for every view, so navigating between pages doesn't make
  // the content column jump around. Grows on large / ultra-wide screens so the
  // space gets used. Pages can still override for special cases (e.g. tiny
  // sign-in / status screens).
  maxWidth = "max-w-6xl 2xl:max-w-[84rem] 3xl:max-w-[96rem] 4xl:max-w-[110rem]",
  className = "",
  bleed = false,
}: PageLayoutProps) {
  return (
    <div className="min-h-[100lvh] relative pt-0 pb-0">
      {moogles && (
        <SimpleFloatingMoogles
          primarySrc={moogles.primary}
          secondarySrc={moogles.secondary}
        />
      )}
      <FloatingSparkles />
      <FloatingBubbles />

      <div
        className={`relative ${bleed ? "" : "pt-[calc(4rem+env(safe-area-inset-top))] pb-[calc(5rem+env(safe-area-inset-bottom))]"} md:py-12 px-3 sm:px-4 z-10 ${className}`}
      >
        <div className={`${maxWidth} mx-auto`}>{children}</div>
      </div>
    </div>
  );
}

interface PageHeaderProps {
  opener?: string;
  title: string;
  subtitle?: string;
  showHeart?: boolean;
  /** page-specific scrapbook stickers, tucked into the banner around the title */
  stickers?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({
  opener,
  title,
  subtitle,
  showHeart = true,
  stickers,
  children,
}: PageHeaderProps) {
  return (
    <header className="relative mb-7 sm:mb-10 animate-[fadeSlideIn_0.4s_ease-out]">
      {/* the title is a full-width scrapbook banner; each page tucks its own
          die-cut stickers into the `stickers` slot, which fills the space on
          either side of the centered title (stickers fade in where there's
          room on wider screens). */}
      <div className="surface paper relative overflow-hidden px-5 sm:px-10 py-7 sm:py-9 md:py-11 text-center">
        {stickers && (
          <div
            className="pointer-events-none absolute inset-0 z-0"
            aria-hidden="true"
          >
            {stickers}
          </div>
        )}

        <div className="relative z-10 mx-auto max-w-[34rem]">
          <div
            className="flex items-center justify-center gap-1.5 mb-1.5"
            aria-hidden="true"
          >
            <KawaiiSparkle className="w-3.5 h-3.5 text-[var(--accent)]" />
            <KawaiiBow className="w-6 h-6 text-[var(--primary)]" />
            <KawaiiSparkle className="w-3.5 h-3.5 text-[var(--secondary)]" />
          </div>

          {opener && (
            <p className="eyebrow-script text-lg sm:text-2xl text-[var(--secondary)]/90 mb-1">
              {opener}
            </p>
          )}

          <h1 className="editorial-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-[var(--text)]">
            <span className="text-highlight">{title}</span>
          </h1>

          {subtitle && (
            <p className="text-base sm:text-lg text-[var(--text-muted)] font-soft flex items-center justify-center gap-2 mt-3">
              {subtitle}
              {showHeart && (
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary)] fill-[var(--primary)]/90" />
              )}
            </p>
          )}

          {children}
        </div>
      </div>
    </header>
  );
}

interface PageFooterProps {
  message: string;
  closing?: string;
}

export function PageFooter({ message, closing = "~ fin ~" }: PageFooterProps) {
  return (
    <footer
      className="mt-12"
      style={{
        paddingBottom: "calc(1rem + var(--safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="surface px-6 py-6 text-center">
        <StoryDivider className="mx-auto mb-4" size="sm" />
        <p className="eyebrow-script text-2xl text-[var(--text-muted)] flex items-center justify-center gap-2">
          <Heart className="w-5 h-5 text-[var(--primary)] fill-[var(--primary)]" />
          {message}
          <Heart className="w-5 h-5 text-[var(--primary)] fill-[var(--primary)]" />
        </p>
        <p className="eyebrow-script text-xl text-[var(--secondary)] mt-2">
          {closing}
        </p>
      </div>
    </footer>
  );
}

interface SectionLabelProps {
  label: string;
  badge?: ReactNode;
  /** defaults to Sparkles */
  icon?: ReactNode;
}

export function SectionLabel({ label, badge, icon }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 px-2 mb-6">
      <span className="icon-badge w-9 h-9 shrink-0 text-[var(--primary)]">
        {icon || <Sparkles className="w-4 h-4" aria-hidden="true" />}
      </span>
      <h2 className="text-sm font-soft font-semibold tracking-[0.14em] uppercase text-[var(--primary)]">
        {label}
      </h2>
      {badge}
      <div className="divider flex-1" aria-hidden="true" />
      <KawaiiStar
        className="w-4 h-4 shrink-0 text-[var(--accent)]"
        aria-hidden="true"
      />
    </div>
  );
}

interface LoadingStateProps {
  message: string;
  /** defaults to pushing moogles */
  imageSrc?: string;
}

export function LoadingState({ message, imageSrc }: LoadingStateProps) {
  return (
    <ContentCard
      className="text-center py-16"
      aria-busy={true}
      aria-live="polite"
    >
      <img
        src={imageSrc || pushingMoogles}
        alt=""
        className="w-40 md:w-52 mx-auto mb-2 animate-[wiggle_0.7s_ease-in-out_infinite]"
        aria-hidden="true"
      />
      <p
        className="font-display text-2xl sm:text-3xl text-[var(--primary)] mb-1 select-none"
        aria-hidden="true"
      >
        (๑•̀ㅂ•́)و
      </p>
      <p
        className="font-accent text-2xl text-[var(--text-muted)] animate-pulse"
        role="status"
      >
        {message}
      </p>
    </ContentCard>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <ContentCard className="text-center py-12 md:py-16" role="alert">
      <img
        src={deadMoogle}
        alt=""
        className="w-40 h-40 mx-auto mb-2 object-contain animate-[float-gentle_3.5s_ease-in-out_infinite]"
        aria-hidden="true"
      />
      <p
        className="font-display text-2xl sm:text-3xl text-[var(--primary)] mb-2 select-none"
        aria-hidden="true"
      >
        (╥﹏╥)
      </p>
      <p className="text-xl font-display font-semibold mb-2 text-[var(--text)]">
        Something went wrong
      </p>
      <p className="font-accent text-2xl text-[var(--text-muted)] mb-6">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="
          inline-flex items-center justify-center gap-2
          px-6 py-3 rounded-2xl
          bg-[var(--primary)]
          text-white font-soft font-semibold
          shadow-[0_2px_8px_-2px_color-mix(in_srgb,var(--primary)_40%,transparent)]
          hover:shadow-[0_4px_12px_-3px_color-mix(in_srgb,var(--primary)_50%,transparent)]
          hover:-translate-y-0.5
          active:scale-[0.97]
          transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer touch-manipulation
          border-2 border-[color:color-mix(in_srgb,var(--primary)_72%,black)]
          focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--primary)] focus-visible:outline-none
        "
      >
        <RefreshCw className="w-4 h-4" aria-hidden="true" />
        Try Again
      </button>
    </ContentCard>
  );
}

interface EmptyStateProps {
  title: string;
  message: string;
  imageSrc: string;
  onClear?: () => void;
  clearLabel?: string;
}

export function EmptyState({
  title,
  message,
  imageSrc,
  onClear,
  clearLabel = "Clear filters",
}: EmptyStateProps) {
  return (
    <ContentCard className="text-center py-12 md:py-16" aria-live="polite">
      <img
        src={imageSrc}
        alt=""
        className="w-40 h-40 mx-auto mb-2 object-contain animate-[float-gentle_3.5s_ease-in-out_infinite]"
        aria-hidden="true"
      />
      <p
        className="font-display text-2xl sm:text-3xl text-[var(--secondary)] mb-2 select-none"
        aria-hidden="true"
      >
        (・_・;)
      </p>
      <p className="text-xl font-display font-semibold mb-2 text-[var(--text)]">
        {title}
      </p>
      <p className="font-accent text-2xl text-[var(--text-muted)] mb-5">
        {message}
      </p>
      {onClear && (
        <button
          onClick={onClear}
          className="
            inline-flex items-center justify-center gap-2
            px-5 py-2.5 rounded-2xl
            bg-transparent border border-[var(--primary)]/30
            text-[var(--primary)] font-soft font-semibold
            hover:bg-[var(--primary)]/10
            hover:-translate-y-0.5
            active:scale-[0.97]
            transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer touch-manipulation
            focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:outline-none
          "
        >
          <X className="w-4 h-4" aria-hidden="true" />
          {clearLabel}
        </button>
      )}
    </ContentCard>
  );
}
