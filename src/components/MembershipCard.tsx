import { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Crown, Shield, Sword, Leaf, Cat, Bird, Star, Heart, Sparkles, ExternalLink } from 'lucide-react';

import lilGuyMoogle from '../assets/moogles/lil guy moogle.webp';

// ─────────────────────────────────────────────────────────────────────────────
// RANK THEMES
// ─────────────────────────────────────────────────────────────────────────────

export interface RankTheme {
  gradient: string;
  glow: string;
  bg: string;
  icon: typeof Crown;
  accent: string;
}

export const rankThemes: Record<string, RankTheme> = {
  'Moogle Guardian': {
    gradient: 'from-amber-400 via-yellow-400 to-orange-400',
    glow: 'rgba(251, 191, 36, 0.5)',
    bg: 'bg-amber-500/10',
    icon: Crown,
    accent: 'text-amber-400',
  },
  'Moogle Knight': {
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    glow: 'rgba(167, 139, 250, 0.5)',
    bg: 'bg-violet-500/10',
    icon: Shield,
    accent: 'text-violet-400',
  },
  'Paissa Trainer': {
    gradient: 'from-rose-400 via-pink-500 to-rose-500',
    glow: 'rgba(251, 113, 133, 0.5)',
    bg: 'bg-rose-500/10',
    icon: Heart,
    accent: 'text-rose-400',
  },
  'Coeurl Hunter': {
    gradient: 'from-purple-400 via-violet-400 to-indigo-400',
    glow: 'rgba(196, 181, 253, 0.5)',
    bg: 'bg-purple-400/10',
    icon: Cat,
    accent: 'text-purple-300',
  },
  'Mandragora': {
    gradient: 'from-orange-400 via-amber-400 to-rose-400',
    glow: 'rgba(253, 186, 116, 0.5)',
    bg: 'bg-orange-400/10',
    icon: Leaf,
    accent: 'text-orange-300',
  },
  'Apkallu Seeker': {
    gradient: 'from-pink-400 via-rose-400 to-pink-500',
    glow: 'rgba(249, 168, 212, 0.5)',
    bg: 'bg-pink-400/10',
    icon: Bird,
    accent: 'text-pink-300',
  },
  'Kupo Shelf': {
    gradient: 'from-violet-400 via-purple-400 to-violet-500',
    glow: 'rgba(196, 181, 253, 0.45)',
    bg: 'bg-violet-400/10',
    icon: Star,
    accent: 'text-violet-300',
  },
  'Bom Boko': {
    gradient: 'from-stone-400 via-stone-500 to-stone-400',
    glow: 'rgba(168, 162, 158, 0.4)',
    bg: 'bg-stone-400/10',
    icon: Sparkles,
    accent: 'text-stone-300',
  },
};

export const defaultTheme: RankTheme = {
  gradient: 'from-[var(--bento-primary)] via-[var(--bento-accent)] to-[var(--bento-secondary)]',
  glow: 'rgba(199, 91, 122, 0.4)',
  bg: 'bg-[var(--bento-primary)]/10',
  icon: Sword,
  accent: 'text-[var(--bento-primary)]',
};

export function getTheme(rank: string | undefined): RankTheme {
  return rank ? (rankThemes[rank] ?? defaultTheme) : defaultTheme;
}

// ─────────────────────────────────────────────────────────────────────────────
// MEMBERSHIP CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export interface MembershipCardProps {
  name: string;
  rank: string;
  avatarUrl: string;
  characterId?: string;
  memberSince?: Date | string;
  /** Slightly smaller variant for compact layouts */
  compact?: boolean;
}

export function MembershipCard({
  name,
  rank,
  avatarUrl,
  characterId,
  memberSince,
  compact = false,
}: MembershipCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const theme = rankThemes[rank] || defaultTheme;
  const RankIcon = theme.icon;
  const lodestoneUrl = characterId
    ? `https://na.finalfantasyxiv.com/lodestone/character/${characterId}`
    : null;

  // Format the member since date
  const formattedDate = memberSince
    ? (memberSince instanceof Date ? memberSince : new Date(memberSince)).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Member';

  // Motion values for tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring-animated rotation for smooth effect
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 25,
  });

  // Shine/glare effect position
  const glareX = useTransform(mouseX, [-0.5, 0.5], [150, -50]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], [150, -50]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (e.clientX - centerX) / rect.width;
      const y = (e.clientY - centerY) / rect.height;

      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  // Size classes based on compact prop
  const sizeClasses = compact
    ? 'max-w-[340px] sm:max-w-[360px]'
    : 'max-w-[360px]';
  const paddingClass = compact ? 'p-4 sm:p-5' : 'p-5';
  const avatarSize = compact ? 'w-12 h-12 sm:w-14 sm:h-14' : 'w-14 h-14';
  const nameSize = compact ? 'text-sm sm:text-base' : 'text-base';
  const moogleSize = compact ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-12 h-12';

  return (
    <div className={compact ? 'perspective-1000' : 'perspective-1000 py-6'}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`relative w-full ${sizeClasses} mx-auto aspect-[1.6/1]`}
      >
        {/* Card glow effect */}
        <motion.div
          className="absolute -inset-6 rounded-3xl blur-3xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${theme.glow} 0%, transparent 70%)`,
          }}
          animate={{
            opacity: isHovered ? 0.8 : 0.4,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Main card */}
        <div
          className="relative w-full h-full overflow-hidden rounded-2xl shadow-2xl"
          style={{
            background: `linear-gradient(135deg, 
              hsl(340, 50%, 12%) 0%, 
              hsl(330, 45%, 8%) 50%,
              hsl(320, 40%, 10%) 100%)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Subtle texture overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
              backgroundSize: '16px 16px',
            }}
          />

          {/* Gradient border effect */}
          <div
            className="absolute inset-0 rounded-2xl opacity-60"
            style={{
              background: `linear-gradient(135deg, transparent 40%, ${theme.glow} 100%)`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'xor',
              WebkitMaskComposite: 'xor',
              padding: '2px',
            }}
          />

          {/* Holographic shine overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([x, y]) => `
                  radial-gradient(ellipse 80% 50% at ${x}% ${y}%, 
                    rgba(255,255,255,0.3) 0%, 
                    rgba(255,255,255,0.1) 30%,
                    transparent 70%)
                `
              ),
            }}
          />

          {/* Rainbow shimmer - reacts to card tilt angle */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: useTransform([mouseX, mouseY], ([x, y]) => {
                const shimmerX = 50 + (x as number) * 100;
                const shimmerY = 50 + (y as number) * 60;
                return `
                  radial-gradient(
                    ellipse 120% 80% at ${shimmerX}% ${shimmerY}%,
                    rgba(255, 200, 220, 0.08) 0%,
                    rgba(200, 210, 255, 0.06) 30%,
                    rgba(255, 230, 200, 0.04) 50%,
                    transparent 70%
                  )
                `;
              }),
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
            }}
          />

          {/* Card content */}
          <div
            className={`relative h-full ${paddingClass} flex flex-col`}
            style={{ transform: 'translateZ(20px)' }}
          >
            {/* Top section: Branding */}
            <div className="flex items-center justify-between">
              {/* MogTome Membership title */}
              <div>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-md bg-gradient-to-br ${theme.gradient} flex items-center justify-center`}
                  >
                    <Star className="w-3.5 h-3.5 text-white fill-white/50" />
                  </div>
                  <span className="font-display font-bold text-white/90 text-sm tracking-wide">
                    MOGTOME
                  </span>
                </div>
                <p className="font-accent text-[var(--bento-primary)] text-lg -mt-0.5 ml-7">
                  Membership
                </p>
              </div>

              {/* Moogle */}
              <motion.div
                className="relative"
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ transform: 'translateZ(40px)' }}
              >
                <img
                  src={lilGuyMoogle}
                  alt=""
                  className={`${moogleSize} object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]`}
                />
              </motion.div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom section: Member info */}
            <div className="flex items-end gap-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0" style={{ transform: 'translateZ(25px)' }}>
                <div
                  className={`absolute -inset-1 rounded-lg bg-gradient-to-br ${theme.gradient} opacity-80`}
                />
                <img src={avatarUrl} alt="" className={`relative ${avatarSize} rounded-md object-cover`} />
              </div>

              {/* Member details */}
              <div className="flex-1 min-w-0 pb-0.5">
                <h3
                  className={`font-display font-bold text-white ${nameSize} truncate leading-tight`}
                  style={{ transform: 'translateZ(15px)' }}
                >
                  {name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${theme.bg} backdrop-blur-sm`}
                  >
                    <RankIcon className={`w-3 h-3 ${theme.accent}`} />
                    <span
                      className={`font-soft font-semibold text-[10px] ${theme.accent} uppercase tracking-wide`}
                    >
                      {rank}
                    </span>
                  </div>
                  <span className="text-white/40 text-[10px]">•</span>
                  <span className="font-accent text-[11px] text-[var(--bento-primary)]">Kupo Life!</span>
                </div>
              </div>

              {/* Member since & Lodestone */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0 pb-0.5">
                <div className="text-right">
                  <p className="font-soft text-[9px] text-white/40 uppercase tracking-wider">Since</p>
                  <p className="font-soft font-semibold text-[11px] text-white/70">{formattedDate}</p>
                </div>
                {lodestoneUrl && (
                  <a
                    href={lodestoneUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] text-white/40 hover:text-[var(--bento-primary)] transition-colors"
                    style={{ transform: 'translateZ(10px)' }}
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
                    <span>Lodestone</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Animated border glow on hover */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{
              boxShadow: isHovered
                ? `inset 0 0 40px -10px ${theme.glow}`
                : 'inset 0 0 0px transparent',
            }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </motion.div>
    </div>
  );
}
