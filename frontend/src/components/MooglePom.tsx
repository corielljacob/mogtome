import { motion } from 'motion/react';

interface MooglePomProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

export function MooglePom({ size = 'md', className = '', animate = true }: MooglePomProps) {
  const sizeConfig = {
    sm: { pom: 'w-3 h-3', stem: 'h-3 w-0.5' },
    md: { pom: 'w-5 h-5', stem: 'h-4 w-0.5' },
    lg: { pom: 'w-8 h-8', stem: 'h-6 w-1' },
    xl: { pom: 'w-12 h-12', stem: 'h-8 w-1' },
  };

  const { pom, stem } = sizeConfig[size];

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      {/* Pom ball */}
      {animate ? (
        <motion.div
          animate={{ y: [0, -5, 0], rotate: [0, -2, 2, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            className={`${pom} rounded-full bg-gradient-to-br from-secondary to-pink-400 shadow-lg`}
            style={{
              boxShadow: '0 0 15px rgba(255, 183, 197, 0.6), inset 0 -2px 4px rgba(0,0,0,0.1)',
            }}
          />
        </motion.div>
      ) : (
        <div
          className={`${pom} rounded-full bg-gradient-to-br from-secondary to-pink-400 shadow-lg`}
          style={{
            boxShadow: '0 0 15px rgba(255, 183, 197, 0.6), inset 0 -2px 4px rgba(0,0,0,0.1)',
          }}
        />
      )}
      {/* Antenna stem */}
      <div
        className={`${stem} bg-gradient-to-b from-secondary/80 to-neutral/40 rounded-full`}
      />
    </div>
  );
}
