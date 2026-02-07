import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Heart, RefreshCw, Sparkles, X } from 'lucide-react';
import { StoryDivider } from './StoryDivider';
import { FloatingSparkles } from './FloatingSparkles';
import { SimpleFloatingMoogles } from './FloatingMoogles';
import { ContentCard } from './ContentCard';

import pushingMoogles from '../assets/moogles/moogles pushing.webp';
import deadMoogle from '../assets/moogles/dead moogle.webp';

// ─────────────────────────────────────────────────────────────────────────────
// PageLayout - Consistent page wrapper with background decorations
// ─────────────────────────────────────────────────────────────────────────────

interface PageLayoutProps {
  children: ReactNode;
  /** Floating moogle images for background decoration */
  moogles?: { primary: string; secondary: string };
  /** Override the max-width container class (default: 'max-w-7xl') */
  maxWidth?: string;
  /** Extra class names on the content container */
  className?: string;
}

export function PageLayout({ 
  children, 
  moogles,
  maxWidth = 'max-w-7xl',
  className = '',
}: PageLayoutProps) {
  return (
    <div className="min-h-[100dvh] relative pt-[calc(4rem+env(safe-area-inset-top))] md:pt-0 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0 overflow-x-hidden">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-[var(--bento-primary)]/[0.04] via-transparent to-[var(--bento-secondary)]/[0.03] pointer-events-none" />
      
      {/* Floating background decorations */}
      {moogles && <SimpleFloatingMoogles primarySrc={moogles.primary} secondarySrc={moogles.secondary} />}
      <FloatingSparkles minimal />

      <div className={`relative py-6 sm:py-8 md:py-12 px-3 sm:px-4 z-10 ${className}`}>
        <div className={`${maxWidth} mx-auto`}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PageHeader - Consistent page title section
// ─────────────────────────────────────────────────────────────────────────────

interface PageHeaderProps {
  /** Decorative opener text (e.g. "~ The ones who guide us ~") */
  opener?: string;
  /** Main page title */
  title: string;
  /** Subtitle text */
  subtitle?: string;
  /** Show a Heart icon next to the subtitle */
  showHeart?: boolean;
  /** Size of the story divider */
  dividerSize?: 'sm' | 'md' | 'lg';
  /** Extra content after the subtitle (e.g. member count badge) */
  children?: ReactNode;
}

export function PageHeader({ 
  opener, 
  title, 
  subtitle, 
  showHeart = true,
  dividerSize = 'sm',
  children,
}: PageHeaderProps) {
  return (
    <motion.header 
      className="text-center mb-6 sm:mb-10"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {opener && (
        <motion.p
          className="font-accent text-lg sm:text-xl md:text-2xl text-[var(--bento-secondary)] mb-3 sm:mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {opener}
        </motion.p>
      )}

      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-2 sm:mb-3">
        <span className="bg-gradient-to-r from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-secondary)] bg-clip-text text-transparent">
          {title}
        </span>
      </h1>

      {subtitle && (
        <p className="text-base sm:text-lg text-[var(--bento-text-muted)] font-soft flex items-center justify-center gap-2 mb-3 sm:mb-4">
          {subtitle}
          {showHeart && (
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
          )}
        </p>
      )}

      {children}

      <StoryDivider className="mx-auto mt-3 sm:mt-0" size={dividerSize} />
    </motion.header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PageFooter - Consistent page footer with story divider
// ─────────────────────────────────────────────────────────────────────────────

interface PageFooterProps {
  /** The main footer message */
  message: string;
  /** The closing tag (default: "~ fin ~") */
  closing?: string;
}

export function PageFooter({ message, closing = '~ fin ~' }: PageFooterProps) {
  return (
    <footer 
      className="text-center mt-16 pt-8" 
      style={{ paddingBottom: 'calc(2rem + var(--safe-area-inset-bottom, 0px))' }}
    >
      <StoryDivider className="mx-auto mb-6" size="sm" />
      <p className="font-accent text-xl text-[var(--bento-text-muted)] flex items-center justify-center gap-2">
        <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
        {message}
        <Heart className="w-5 h-5 text-[var(--bento-primary)] fill-[var(--bento-primary)]" />
      </p>
      <p className="font-accent text-lg text-[var(--bento-secondary)] mt-2">
        {closing}
      </p>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SectionLabel - Consistent section header with icon and divider line
// ─────────────────────────────────────────────────────────────────────────────

interface SectionLabelProps {
  /** Section label text */
  label: string;
  /** Optional badge (e.g. count) */
  badge?: ReactNode;
  /** Icon to show (defaults to Sparkles) */
  icon?: ReactNode;
}

export function SectionLabel({ label, badge, icon }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 px-2 mb-6">
      {icon || <Sparkles className="w-4 h-4 text-[var(--bento-primary)]" aria-hidden="true" />}
      <h2 className="text-sm font-soft font-semibold text-[var(--bento-primary)]">
        {label}
      </h2>
      {badge}
      <div className="flex-1 h-px bg-gradient-to-r from-[var(--bento-primary)]/30 to-transparent" aria-hidden="true" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LoadingState - Animated loading indicator with moogle
// ─────────────────────────────────────────────────────────────────────────────

interface LoadingStateProps {
  /** Loading message (e.g. "Fetching members, kupo...") */
  message: string;
  /** Custom image source (defaults to pushing moogles) */
  imageSrc?: string;
}

export function LoadingState({ message, imageSrc }: LoadingStateProps) {
  return (
    <ContentCard className="text-center py-16" aria-busy={true} aria-live="polite">
      <motion.img 
        src={imageSrc || pushingMoogles} 
        alt="" 
        className="w-40 md:w-52 mx-auto mb-4"
        animate={{ 
          x: [0, 4, -4, 4, 0],
          rotate: [0, 1.5, -1.5, 1.5, 0],
        }}
        transition={{ 
          duration: 0.7, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        aria-hidden="true"
      />
      <motion.p 
        className="font-accent text-2xl text-[var(--bento-text-muted)]"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        role="status"
      >
        {message}
      </motion.p>
    </ContentCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ErrorState - Error display with retry button
// ─────────────────────────────────────────────────────────────────────────────

interface ErrorStateProps {
  /** Error message (e.g. "A moogle fell over, kupo...") */
  message: string;
  /** Retry callback */
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <ContentCard className="text-center py-12 md:py-16" role="alert">
      <img 
        src={deadMoogle} 
        alt="" 
        className="w-40 h-40 mx-auto mb-5 object-contain"
        aria-hidden="true"
      />
      <p className="text-xl font-display font-semibold mb-2 text-[var(--bento-text)]">
        Something went wrong
      </p>
      <p className="font-accent text-2xl text-[var(--bento-text-muted)] mb-6">
        {message}
      </p>
      <motion.button
        onClick={onRetry}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="
          inline-flex items-center justify-center gap-2
          px-6 py-3 rounded-xl
          bg-gradient-to-r from-[var(--bento-primary)] to-[var(--bento-secondary)]
          text-white font-soft font-semibold
          shadow-lg shadow-[var(--bento-primary)]/25
          hover:shadow-xl hover:shadow-[var(--bento-primary)]/30
          transition-all cursor-pointer touch-manipulation
          focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bento-primary)] focus-visible:outline-none
        "
      >
        <RefreshCw className="w-4 h-4" aria-hidden="true" />
        Try Again
      </motion.button>
    </ContentCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EmptyState - Empty results with optional clear action
// ─────────────────────────────────────────────────────────────────────────────

interface EmptyStateProps {
  /** Title (e.g. "No members found") */
  title: string;
  /** Kupo-themed message */
  message: string;
  /** Custom image source */
  imageSrc: string;
  /** Show a "Clear filters" button */
  onClear?: () => void;
  /** Label for the clear button */
  clearLabel?: string;
}

export function EmptyState({ title, message, imageSrc, onClear, clearLabel = 'Clear filters' }: EmptyStateProps) {
  return (
    <ContentCard className="text-center py-12 md:py-16" aria-live="polite">
      <img 
        src={imageSrc} 
        alt="" 
        className="w-40 h-40 mx-auto mb-5 object-contain"
        aria-hidden="true"
      />
      <p className="text-xl font-display font-semibold mb-2 text-[var(--bento-text)]">{title}</p>
      <p className="font-accent text-2xl text-[var(--bento-text-muted)] mb-5">
        {message}
      </p>
      {onClear && (
        <motion.button
          onClick={onClear}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="
            inline-flex items-center justify-center gap-2
            px-5 py-2.5 rounded-xl
            bg-transparent border border-[var(--bento-primary)]/30
            text-[var(--bento-primary)] font-soft font-semibold
            hover:bg-[var(--bento-primary)]/10
            transition-all cursor-pointer touch-manipulation
            focus-visible:ring-2 focus-visible:ring-[var(--bento-primary)] focus-visible:outline-none
          "
        >
          <X className="w-4 h-4" aria-hidden="true" />
          {clearLabel}
        </motion.button>
      )}
    </ContentCard>
  );
}
