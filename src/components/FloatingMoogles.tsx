import { memo } from 'react';

/**
 * Floating moogle background decorations for ambient page effects.
 * 
 * PERFORMANCE: Uses CSS animations instead of Framer Motion for infinite loops.
 * CSS animations run on the compositor thread, avoiding main thread work.
 */

export interface MoogleConfig {
  src: string;
  position: string;
  size: string;
  rotate: number;
  delay: number;
}

export interface FloatingMooglesProps {
  /** Array of moogle configurations */
  moogles: MoogleConfig[];
  /** Base opacity range [min, max] - converted to CSS custom properties */
  opacityRange?: [number, number];
}

export const FloatingMoogles = memo(function FloatingMoogles({ 
  moogles, 
  opacityRange = [0.15, 0.25] 
}: FloatingMooglesProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {moogles.map((moogle, i) => (
        <img
          key={i}
          src={moogle.src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className={`absolute ${moogle.position} ${moogle.size} object-contain animate-float-moogle will-change-transform`}
          style={{ 
            transform: `rotate(${moogle.rotate}deg)`,
            animationDelay: `${moogle.delay}s`,
            animationDuration: `${5 + i}s`,
            opacity: opacityRange[0], // Initial opacity before animation starts
            '--float-opacity-min': opacityRange[0],
            '--float-opacity-max': opacityRange[1],
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
});

/**
 * Simple two-moogle floating background for pages like Chronicle.
 * Uses CSS animations for better performance.
 */
export interface SimpleFloatingMooglesProps {
  /** First moogle image source */
  primarySrc: string;
  /** Second moogle image source */
  secondarySrc: string;
}

export const SimpleFloatingMoogles = memo(function SimpleFloatingMoogles({ 
  primarySrc, 
  secondarySrc 
}: SimpleFloatingMooglesProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <img
        src={primarySrc}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute top-32 left-4 md:left-16 w-24 md:w-32 object-contain animate-float-moogle-subtle will-change-transform"
        style={{ 
          transform: 'rotate(-5deg)',
          animationDuration: '6s',
          opacity: 0.06, // Initial opacity before animation starts
          '--float-opacity-min': 0.06,
          '--float-opacity-max': 0.12,
        } as React.CSSProperties}
      />
      <img
        src={secondarySrc}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute top-64 right-4 md:right-16 w-20 md:w-28 object-contain animate-float-moogle-subtle will-change-transform"
        style={{ 
          transform: 'rotate(8deg)',
          animationDelay: '1.5s',
          animationDuration: '5s',
          opacity: 0.06, // Initial opacity before animation starts
          '--float-opacity-min': 0.06,
          '--float-opacity-max': 0.12,
        } as React.CSSProperties}
      />
    </div>
  );
});
