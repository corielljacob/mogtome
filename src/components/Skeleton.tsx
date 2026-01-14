import { motion } from 'motion/react';

interface SkeletonProps {
  className?: string;
  /** Animation style: 'pulse' for iOS-style, 'shimmer' for Android-style */
  variant?: 'pulse' | 'shimmer';
  style?: React.CSSProperties;
}

/**
 * Skeleton - Base skeleton loading component
 */
export function Skeleton({ className = '', variant = 'pulse', style }: SkeletonProps) {
  return (
    <motion.div
      className={`
        bg-[var(--bento-bg)] rounded-lg
        ${variant === 'shimmer' ? 'skeleton-native' : ''}
        ${className}
      `}
      style={style}
      animate={variant === 'pulse' ? { opacity: [0.4, 0.7, 0.4] } : undefined}
      transition={variant === 'pulse' ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" } : undefined}
    />
  );
}

/**
 * SkeletonText - Text line skeleton
 */
export function SkeletonText({ 
  lines = 1, 
  className = '',
  lastLineWidth = '60%'
}: { 
  lines?: number; 
  className?: string;
  lastLineWidth?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 rounded-full ${i === lines - 1 ? '' : 'w-full'}`}
          style={i === lines - 1 ? { width: lastLineWidth } : undefined}
        />
      ))}
    </div>
  );
}

/**
 * SkeletonAvatar - Circular avatar skeleton
 */
export function SkeletonAvatar({ 
  size = 'md',
  className = '' 
}: { 
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  return (
    <Skeleton className={`rounded-full ${sizeClasses[size]} ${className}`} />
  );
}

/**
 * SkeletonCard - Card-shaped skeleton for member cards, etc.
 */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`native-card p-3 space-y-3 ${className}`}>
      <Skeleton className="aspect-square rounded-lg" />
      <div className="space-y-2 px-1">
        <Skeleton className="h-4 rounded-full w-3/4 mx-auto" />
        <Skeleton className="h-5 rounded-full w-1/2 mx-auto" />
      </div>
    </div>
  );
}

/**
 * SkeletonMemberCard - Skeleton for the member grid cards
 */
export function SkeletonMemberCard() {
  return (
    <motion.div 
      className="w-full max-w-[10rem] sm:max-w-[11rem] md:max-w-[12rem]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-[var(--bento-card)] border border-[var(--bento-primary)]/10 rounded-xl md:rounded-2xl overflow-hidden shadow-sm">
        {/* Rank banner skeleton */}
        <Skeleton className="h-1 rounded-none" variant="shimmer" />
        
        {/* Avatar skeleton */}
        <div className="aspect-square relative overflow-hidden">
          <Skeleton className="absolute inset-0 rounded-none" variant="shimmer" />
        </div>
        
        {/* Info skeleton */}
        <div className="p-2 sm:p-3 space-y-2">
          <Skeleton className="h-3 rounded-full w-4/5 mx-auto" />
          <Skeleton className="h-4 rounded-full w-3/5 mx-auto" />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * SkeletonMemberGrid - Full grid of skeleton cards
 */
export function SkeletonMemberGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4 justify-items-center">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03, duration: 0.3 }}
        >
          <SkeletonMemberCard />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * SkeletonEventCard - Skeleton for chronicle event cards
 */
export function SkeletonEventCard() {
  return (
    <div className="flex items-start gap-3 p-3 bg-[var(--bento-card)] rounded-xl border border-[var(--bento-border)]">
      <Skeleton className="w-9 h-9 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="h-3 w-20 rounded-full ml-auto" />
        </div>
        <Skeleton className="h-4 rounded-full w-full" />
        <Skeleton className="h-4 rounded-full w-3/4" />
      </div>
    </div>
  );
}

/**
 * SkeletonEventList - List of skeleton event cards
 */
export function SkeletonEventList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
        >
          <SkeletonEventCard />
        </motion.div>
      ))}
    </div>
  );
}

/**
 * SkeletonListItem - Generic list item skeleton
 */
export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-3 p-3 bg-[var(--bento-card)] rounded-xl">
      <SkeletonAvatar size="md" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 rounded-full w-3/4" />
        <Skeleton className="h-3 rounded-full w-1/2" />
      </div>
    </div>
  );
}

/**
 * MobilePageSkeleton - Full page skeleton for mobile views
 */
export function MobilePageSkeleton({ 
  type = 'list' 
}: { 
  type?: 'list' | 'grid' | 'detail';
}) {
  return (
    <div className="px-4 py-4 space-y-4">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 rounded-lg w-1/3" />
        <Skeleton className="h-4 rounded-full w-2/3" />
      </div>
      
      {/* Search bar skeleton */}
      <Skeleton className="h-11 rounded-xl w-full" />
      
      {/* Content skeleton */}
      {type === 'list' && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonListItem key={i} />
          ))}
        </div>
      )}
      
      {type === 'grid' && <SkeletonMemberGrid count={9} />}
      
      {type === 'detail' && (
        <div className="space-y-4">
          <Skeleton className="aspect-video rounded-xl" />
          <SkeletonText lines={4} />
        </div>
      )}
    </div>
  );
}
