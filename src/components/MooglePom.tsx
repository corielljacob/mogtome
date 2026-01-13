import { motion } from 'motion/react';

interface MooglePomProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
  showStem?: boolean;
  color?: 'pink' | 'coral' | 'purple';
}

/**
 * MooglePom - A cute decorative moogle pom-pom element.
 * Features gradient coloring, optional glow, and bounce animation.
 */
export function MooglePom({ 
  size = 'md', 
  className = '',
  animate = false,
  showStem = true,
  color = 'pink',
}: MooglePomProps) {
  const sizeConfig = {
    xs: { pom: 'w-2 h-2', stem: 'h-2 w-px', glow: 'blur-[2px]', border: 'border' },
    sm: { pom: 'w-3 h-3', stem: 'h-3 w-0.5', glow: 'blur-[3px]', border: 'border' },
    md: { pom: 'w-5 h-5', stem: 'h-4 w-0.5', glow: 'blur-sm', border: 'border-2' },
    lg: { pom: 'w-8 h-8', stem: 'h-6 w-1', glow: 'blur-md', border: 'border-2' },
    xl: { pom: 'w-12 h-12', stem: 'h-8 w-1', glow: 'blur-lg', border: 'border-2' },
  };

  const colorConfig = {
    pink: {
      gradient: 'from-pink-300 via-pink-400 to-rose-500',
      glow: 'bg-pink-400/50',
      stem: 'from-pink-300/80 to-pink-200/40',
      border: 'border-white/30',
    },
    coral: {
      gradient: 'from-red-300 via-[var(--bento-primary)] to-rose-600',
      glow: 'bg-[var(--bento-primary)]/50',
      stem: 'from-red-300/80 to-red-200/40',
      border: 'border-white/30',
    },
    purple: {
      gradient: 'from-violet-300 via-[var(--bento-secondary)] to-purple-600',
      glow: 'bg-[var(--bento-secondary)]/50',
      stem: 'from-violet-300/80 to-violet-200/40',
      border: 'border-white/30',
    },
  };

  const { pom, stem, glow, border } = sizeConfig[size];
  const colors = colorConfig[color];

  const PomContent = (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* Glow effect */}
      <div className={`absolute ${pom} rounded-full ${colors.glow} ${glow} scale-150`} />
      
      {/* Main pom with gradient */}
      <div className={`
        relative ${pom} rounded-full 
        bg-gradient-to-br ${colors.gradient}
        ${border} ${colors.border}
        shadow-lg
      `}>
        {/* Highlight */}
        <div className="absolute top-[15%] left-[20%] w-[30%] h-[25%] rounded-full bg-white/50" />
      </div>
      
      {/* Stem */}
      {showStem && (
        <div className={`${stem} bg-gradient-to-b ${colors.stem} rounded-full -mt-0.5`} />
      )}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {PomContent}
      </motion.div>
    );
  }

  return PomContent;
}

/**
 * MooglePomCluster - A decorative cluster of pom-poms.
 */
export function MooglePomCluster({ className = '' }: { className?: string }) {
  return (
    <div className={`relative inline-flex items-center gap-1 ${className}`}>
      <MooglePom size="xs" color="purple" showStem={false} />
      <MooglePom size="sm" color="coral" animate />
      <MooglePom size="xs" color="pink" showStem={false} />
    </div>
  );
}
