import { motion } from 'motion/react';

/**
 * Floating moogle background decorations for ambient page effects.
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
  /** Base opacity range [min, max] */
  opacityRange?: [number, number];
}

export function FloatingMoogles({ 
  moogles, 
  opacityRange = [0.15, 0.25] 
}: FloatingMooglesProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {moogles.map((moogle, i) => (
        <motion.img
          key={i}
          src={moogle.src}
          alt=""
          aria-hidden="true"
          className={`absolute ${moogle.position} ${moogle.size} object-contain`}
          style={{ rotate: `${moogle.rotate}deg` }}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [opacityRange[0], opacityRange[1], opacityRange[0]],
            y: [0, -15, 0],
          }}
          transition={{
            opacity: { duration: 4, repeat: Infinity, delay: moogle.delay },
            y: { duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: moogle.delay },
          }}
        />
      ))}
    </div>
  );
}

/**
 * Simple two-moogle floating background for pages like Chronicle.
 */
export interface SimpleFloatingMooglesProps {
  /** First moogle image source */
  primarySrc: string;
  /** Second moogle image source */
  secondarySrc: string;
}

export function SimpleFloatingMoogles({ primarySrc, secondarySrc }: SimpleFloatingMooglesProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.img
        src={primarySrc}
        alt=""
        aria-hidden="true"
        className="absolute top-32 left-4 md:left-16 w-24 md:w-32 object-contain"
        style={{ rotate: '-5deg' }}
        animate={{ 
          opacity: [0.06, 0.12, 0.06],
          y: [0, -15, 0],
        }}
        transition={{
          opacity: { duration: 5, repeat: Infinity },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      <motion.img
        src={secondarySrc}
        alt=""
        aria-hidden="true"
        className="absolute top-64 right-4 md:right-16 w-20 md:w-28 object-contain"
        style={{ rotate: '8deg' }}
        animate={{ 
          opacity: [0.06, 0.12, 0.06],
          y: [0, -12, 0],
        }}
        transition={{
          opacity: { duration: 4, repeat: Infinity, delay: 1.5 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 },
        }}
      />
    </div>
  );
}
