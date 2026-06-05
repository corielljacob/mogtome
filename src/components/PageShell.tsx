import type { ReactNode } from "react";
import { Heart, RefreshCw, Sparkles, X } from "lucide-react";
import { StoryDivider } from "@/components/StoryDivider";
import { FloatingSparkles } from "@/components/FloatingSparkles";
import { FloatingBubbles } from "@/components/FloatingBubbles";
import { SimpleFloatingMoogles } from "@/components/FloatingMoogles";
import { ContentCard } from "@/components/ContentCard";
import { KawaiiSparkle, KawaiiBow, KawaiiStar } from "@/components/kawaiiMotifs";

import pushingMoogles from "@/assets/moogles/moogles pushing.webp";
import deadMoogle from "@/assets/moogles/dead moogle.webp";
import lilGuyMoogle from "@/assets/moogles/lil guy moogle.webp";

interface PageLayoutProps {
  children: ReactNode;
  moogles?: { primary: string; secondary: string };
  maxWidth?: string;
  className?: string;
}

export function PageLayout({
  children,
  moogles,
  maxWidth = "max-w-7xl",
  className = "",
}: PageLayoutProps) {
  // page backdrop lives on the #app-scroll container in App.tsx so it scrolls
  // natively with the content and sits behind the nav.

  return (
    <div className="min-h-full relative pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
      {moogles && (
        <SimpleFloatingMoogles
          primarySrc={moogles.primary}
          secondarySrc={moogles.secondary}
        />
      )}
      <FloatingSparkles />
      <FloatingBubbles />

      <div
        className={`relative py-6 sm:py-8 md:py-12 px-3 sm:px-4 z-10 ${className}`}
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
  dividerSize?: "sm" | "md" | "lg";
  children?: ReactNode;
}

export function PageHeader({
  opener,
  title,
  subtitle,
  showHeart = true,
  children,
}: PageHeaderProps) {
  return (
    <header className="relative w-fit mx-auto mb-6 sm:mb-10 text-center animate-[fadeSlideIn_0.4s_ease-out]">
      <img
        src={lilGuyMoogle}
        alt=""
        aria-hidden="true"
        className="hidden lg:block absolute -top-7 -right-5 w-16 object-contain rotate-[8deg] animate-[float-gentle_4s_ease-in-out_infinite] pointer-events-none select-none z-10"
      />

      {/* title sits on a pinned polaroid so it never floats on the bare page */}
      <div className="surface paper -rotate-1 px-7 sm:px-12 py-5 sm:py-6">
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

        <h1 className="editorial-title text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[var(--text)]">
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
